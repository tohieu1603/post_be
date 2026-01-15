import { Request, Response } from 'express';
import { schemaService } from '../services/schema.service';
import { successResponse, errorResponse, notFoundResponse } from '../utils/response.util';
import { QueryExecuteDto, QueryOperation, QUERY_CONSTRAINTS } from '../dtos/schema.dto';

const ALLOWED_OPERATIONS: QueryOperation[] = ['find', 'find_one', 'aggregate', 'count', 'distinct'];

/**
 * List all collections/tables
 * GET /api/schema/tables
 */
export const listTables = async (_req: Request, res: Response) => {
  try {
    const tables = await schemaService.listCollections();
    return successResponse(res, { tables });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to list tables';
    return errorResponse(res, message, 500);
  }
};

/**
 * Get table/collection detail
 * GET /api/schema/tables/:table_name
 */
export const getTableDetail = async (req: Request, res: Response) => {
  try {
    const { table_name } = req.params;

    if (!table_name) {
      return errorResponse(res, 'Table name is required', 400);
    }

    const detail = await schemaService.getCollectionDetail(table_name);
    return successResponse(res, detail);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get table detail';

    if (message.includes('not found') || message.includes('access denied')) {
      return notFoundResponse(res, 'Table');
    }

    return errorResponse(res, message, 500);
  }
};

/**
 * Execute a query
 * POST /api/query/execute
 */
export const executeQuery = async (req: Request, res: Response) => {
  try {
    const body = req.body as QueryExecuteDto;

    // Validate required fields
    if (!body.collection) {
      return errorResponse(res, 'Collection name is required', 400);
    }

    // Validate operation
    if (body.operation && !ALLOWED_OPERATIONS.includes(body.operation)) {
      return errorResponse(
        res,
        `Operation must be one of: ${ALLOWED_OPERATIONS.join(', ')}`,
        400
      );
    }

    // Validate aggregate requires pipeline
    if (body.operation === 'aggregate' && !body.pipeline) {
      return errorResponse(res, 'Pipeline is required for aggregate operation', 400);
    }

    // Validate distinct requires field
    if (body.operation === 'distinct' && !body.field) {
      return errorResponse(res, 'Field is required for distinct operation', 400);
    }

    // Validate timeout range
    if (body.timeout !== undefined) {
      if (body.timeout < 1 || body.timeout > QUERY_CONSTRAINTS.MAX_TIMEOUT_SECONDS) {
        return errorResponse(
          res,
          `Timeout must be between 1 and ${QUERY_CONSTRAINTS.MAX_TIMEOUT_SECONDS} seconds`,
          400
        );
      }
    }

    // Validate limit range
    if (body.limit !== undefined) {
      if (body.limit < 1 || body.limit > QUERY_CONSTRAINTS.MAX_ROWS) {
        return errorResponse(
          res,
          `Limit must be between 1 and ${QUERY_CONSTRAINTS.MAX_ROWS}`,
          400
        );
      }
    }

    const result = await schemaService.executeQuery(body);
    return res.status(200).json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Query execution failed';

    // Check for specific error types
    if (message.includes('not allowed')) {
      return errorResponse(res, message, 403);
    }

    if (message.includes('Operator') || message.includes('Pipeline stage')) {
      return errorResponse(res, message, 400);
    }

    return errorResponse(res, message, 500);
  }
};
