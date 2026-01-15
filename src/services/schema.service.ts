import mongoose from 'mongoose';
import {
  CollectionInfo,
  CollectionDetail,
  ColumnInfo,
  RelationshipInfo,
  QueryExecuteDto,
  QueryExecuteResult,
  ALLOWED_COLLECTIONS,
  COLLECTION_METADATA,
  QUERY_CONSTRAINTS,
  BLOCKED_PIPELINE_STAGES,
  SEARCHABLE_FIELDS,
} from '../dtos/schema.dto';

/**
 * Schema Service - Database schema introspection and query execution
 */
export class SchemaService {
  /**
   * Get list of all collections with metadata
   */
  async listCollections(): Promise<CollectionInfo[]> {
    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const collections: CollectionInfo[] = [];

    for (const collectionName of ALLOWED_COLLECTIONS) {
      try {
        const collection = db.collection(collectionName);
        const count = await collection.estimatedDocumentCount();
        const metadata = COLLECTION_METADATA[collectionName];

        collections.push({
          name: collectionName,
          description: metadata?.description || collectionName,
          row_count: count,
        });
      } catch {
        // Collection might not exist yet, skip it
        continue;
      }
    }

    return collections;
  }

  /**
   * Get detailed schema for a specific collection
   */
  async getCollectionDetail(collectionName: string): Promise<CollectionDetail> {
    // Validate collection name is allowed
    if (!ALLOWED_COLLECTIONS.includes(collectionName as typeof ALLOWED_COLLECTIONS[number])) {
      throw new Error(`Collection '${collectionName}' not found or access denied`);
    }

    const metadata = COLLECTION_METADATA[collectionName];
    if (!metadata) {
      throw new Error(`Collection '${collectionName}' not found`);
    }

    // Get the Mongoose model
    const model = mongoose.models[metadata.modelName];
    if (!model) {
      throw new Error(`Model '${metadata.modelName}' not registered`);
    }

    const schema = model.schema;
    const columns: ColumnInfo[] = [];
    const relationships: RelationshipInfo[] = [];

    // Extract schema paths (fields)
    schema.eachPath((pathName: string, schemaType: mongoose.SchemaType) => {
      // Skip internal fields
      if (pathName === '__v') return;

      const column = this.extractColumnInfo(pathName, schemaType);
      columns.push(column);

      // Check for references (foreign keys)
      const options = (schemaType as unknown as { options?: { ref?: string } }).options;
      if (options?.ref) {
        const refCollectionName = this.modelNameToCollectionName(options.ref);
        column.foreign_key = `${refCollectionName}._id`;

        relationships.push({
          field: pathName,
          references: refCollectionName,
          type: 'many_to_one',
        });
      }
    });

    // Get indexes
    const indexInfo = this.extractIndexes(schema);

    return {
      name: collectionName,
      columns,
      relationships,
      indexes: indexInfo,
    };
  }

  /**
   * Execute a MongoDB query with security constraints
   * Supports: find, find_one, aggregate, count, distinct
   */
  async executeQuery(query: QueryExecuteDto): Promise<QueryExecuteResult> {
    const startTime = Date.now();
    const operation = query.operation || 'find';

    // Validate collection
    if (!ALLOWED_COLLECTIONS.includes(query.collection as typeof ALLOWED_COLLECTIONS[number])) {
      throw new Error(`Collection '${query.collection}' not allowed`);
    }

    // Apply constraints
    const limit = Math.min(
      query.limit || QUERY_CONSTRAINTS.DEFAULT_ROWS,
      QUERY_CONSTRAINTS.MAX_ROWS
    );
    const timeout = Math.min(
      (query.timeout || QUERY_CONSTRAINTS.DEFAULT_TIMEOUT_SECONDS) * 1000,
      QUERY_CONSTRAINTS.MAX_TIMEOUT_SECONDS * 1000
    );

    const db = mongoose.connection.db;
    if (!db) {
      throw new Error('Database not connected');
    }

    const collection = db.collection(query.collection);

    // Build filter with keyword support
    let filter = this.sanitizeFilter(query.filter || {});
    if (query.keyword) {
      filter = this.buildKeywordFilter(query.collection, query.keyword, filter);
    }

    let data: unknown[] = [];
    let columns: string[] | undefined;

    switch (operation) {
      case 'find': {
        const projection = query.projection || {};
        const sort = query.sort || {};
        const skip = query.skip || 0;

        const cursor = collection
          .find(filter, { projection, maxTimeMS: timeout })
          .sort(sort)
          .skip(skip)
          .limit(limit);

        data = await cursor.toArray();
        columns = this.extractColumnsFromData(data, projection);
        break;
      }

      case 'find_one': {
        const projection = query.projection || {};
        const doc = await collection.findOne(filter, { projection, maxTimeMS: timeout });
        data = doc ? [doc] : [];
        columns = doc ? Object.keys(doc) : [];
        break;
      }

      case 'aggregate': {
        if (!query.pipeline || !Array.isArray(query.pipeline)) {
          throw new Error('Pipeline is required for aggregate operation');
        }
        // Validate and sanitize pipeline
        const pipeline = this.sanitizePipeline(query.pipeline);
        // Add limit stage if not present
        const hasLimit = pipeline.some(stage => '$limit' in stage);
        if (!hasLimit) {
          pipeline.push({ $limit: limit });
        }

        const cursor = collection.aggregate(pipeline, { maxTimeMS: timeout });
        data = await cursor.toArray();
        columns = data.length > 0 ? Object.keys(data[0] as object) : [];
        break;
      }

      case 'count': {
        const count = await collection.countDocuments(filter, { maxTimeMS: timeout });
        data = [{ count }];
        columns = ['count'];
        break;
      }

      case 'distinct': {
        if (!query.field) {
          throw new Error('Field is required for distinct operation');
        }
        const values = await collection.distinct(query.field, filter);
        // Limit results
        const limitedValues = values.slice(0, limit);
        data = limitedValues.map(v => ({ [query.field!]: v }));
        columns = [query.field];
        break;
      }

      default:
        throw new Error(`Operation '${operation}' not supported`);
    }

    const executionTime = Date.now() - startTime;

    return {
      success: true,
      data,
      columns,
      count: data.length,
      execution_time_ms: executionTime,
    };
  }

  /**
   * Build keyword filter with $regex on searchable fields
   */
  private buildKeywordFilter(
    collectionName: string,
    keyword: string,
    existingFilter: Record<string, unknown>
  ): Record<string, unknown> {
    const searchableFields = SEARCHABLE_FIELDS[collectionName] || ['name', 'title'];
    const regexConditions = searchableFields.map(field => ({
      [field]: { $regex: keyword, $options: 'i' }
    }));

    // Combine with existing filter using $and
    if (Object.keys(existingFilter).length > 0) {
      return {
        $and: [existingFilter, { $or: regexConditions }]
      };
    }

    return { $or: regexConditions };
  }

  /**
   * Sanitize aggregate pipeline - block dangerous stages and operators
   */
  private sanitizePipeline(pipeline: Record<string, unknown>[]): Record<string, unknown>[] {
    // Dangerous operators that allow code execution
    const DANGEROUS_OPERATORS = ['$function', '$accumulator', '$where'];

    // Recursively check object for dangerous operators
    const checkDangerousOperators = (obj: unknown, path: string = ''): void => {
      if (!obj || typeof obj !== 'object') return;

      if (Array.isArray(obj)) {
        obj.forEach((item, idx) => checkDangerousOperators(item, `${path}[${idx}]`));
        return;
      }

      for (const [key, value] of Object.entries(obj)) {
        if (DANGEROUS_OPERATORS.includes(key)) {
          throw new Error(`Operator '${key}' not allowed (code execution)`);
        }
        checkDangerousOperators(value, path ? `${path}.${key}` : key);
      }
    };

    return pipeline.map((stage) => {
      const stageKeys = Object.keys(stage);
      for (const key of stageKeys) {
        // Block dangerous write stages
        if (BLOCKED_PIPELINE_STAGES.includes(key as typeof BLOCKED_PIPELINE_STAGES[number])) {
          throw new Error(`Pipeline stage '${key}' not allowed (write operation)`);
        }
      }

      // Recursively check for dangerous operators in entire stage
      checkDangerousOperators(stage);

      // Recursively sanitize $match stage
      if (stage.$match && typeof stage.$match === 'object') {
        return { ...stage, $match: this.sanitizeFilter(stage.$match as Record<string, unknown>) };
      }
      return stage;
    });
  }

  /**
   * Extract column info from Mongoose SchemaType
   */
  private extractColumnInfo(pathName: string, schemaType: mongoose.SchemaType): ColumnInfo {
    const options = (schemaType as unknown as { options?: Record<string, unknown> }).options || {};
    const instance = (schemaType as unknown as { instance?: string }).instance || 'Mixed';

    // Map Mongoose types to SQL-like types for compatibility
    const typeMapping: Record<string, string> = {
      String: 'VARCHAR',
      Number: 'NUMBER',
      Boolean: 'BOOLEAN',
      Date: 'DATETIME',
      ObjectId: 'OBJECTID',
      ObjectID: 'OBJECTID',
      Array: 'ARRAY',
      Mixed: 'JSON',
      Buffer: 'BINARY',
      Map: 'JSON',
      Decimal128: 'DECIMAL',
    };

    let type = typeMapping[instance] || 'UNKNOWN';

    // Add maxlength info if available
    if (options.maxlength && type === 'VARCHAR') {
      type = `VARCHAR(${options.maxlength})`;
    }

    return {
      name: pathName,
      type,
      primary_key: pathName === '_id',
      nullable: !options.required,
      default: options.default !== undefined ? options.default : undefined,
    };
  }

  /**
   * Extract index information from schema
   */
  private extractIndexes(schema: mongoose.Schema): { name: string; fields: string[] }[] {
    const indexes: { name: string; fields: string[] }[] = [];

    // Get indexes from schema
    const schemaIndexes = schema.indexes();
    schemaIndexes.forEach((index, idx) => {
      const [fields] = index;
      indexes.push({
        name: `index_${idx}`,
        fields: Object.keys(fields as object),
      });
    });

    return indexes;
  }

  /**
   * Convert model name to collection name
   */
  private modelNameToCollectionName(modelName: string): string {
    // Mongoose convention: lowercase + 's'
    return modelName.toLowerCase() + 's';
  }

  /**
   * Sanitize filter to prevent injection attacks
   */
  private sanitizeFilter(filter: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};

    for (const [key, value] of Object.entries(filter)) {
      // Block dangerous operators
      if (key.startsWith('$')) {
        const allowedOperators = [
          '$eq', '$ne', '$gt', '$gte', '$lt', '$lte',
          '$in', '$nin', '$exists', '$regex', '$and', '$or'
        ];
        if (!allowedOperators.includes(key)) {
          throw new Error(`Operator '${key}' not allowed`);
        }
      }

      // Recursively sanitize nested objects
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        sanitized[key] = this.sanitizeFilter(value as Record<string, unknown>);
      } else if (Array.isArray(value)) {
        sanitized[key] = value.map(v =>
          v && typeof v === 'object' ? this.sanitizeFilter(v as Record<string, unknown>) : v
        );
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }

  /**
   * Extract column names from query results
   */
  private extractColumnsFromData(data: unknown[], projection: Record<string, 0 | 1>): string[] {
    // If projection specified, use those keys
    const projectionKeys = Object.keys(projection).filter(k => projection[k] === 1);
    if (projectionKeys.length > 0) {
      return projectionKeys;
    }

    // Otherwise, extract from first document
    if (data.length > 0 && data[0] && typeof data[0] === 'object') {
      return Object.keys(data[0] as object);
    }

    return [];
  }
}

export const schemaService = new SchemaService();
