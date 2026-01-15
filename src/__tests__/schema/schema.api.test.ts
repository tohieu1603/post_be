import request from 'supertest';
import express from 'express';
import { Types } from 'mongoose';
import schemaRoutes from '../../routes/schema-routes';
import { Category } from '../../models/category.model';
import { Post } from '../../models/post.model';
import { Tag } from '../../models/tag.model';

// Create test app
const app = express();
app.use(express.json());

// Mock auth middleware for testing
jest.mock('../../middleware/auth.middleware', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = {
      id: new Types.ObjectId().toString(),
      email: 'admin@test.com',
      role: 'admin',
    };
    next();
  },
}));

jest.mock('../../middleware/rbac.middleware', () => ({
  requireRole: () => (_req: any, _res: any, next: any) => next(),
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  attachUser: () => (_req: any, _res: any, next: any) => next(),
}));

// Mount routes
app.use('/api/schema', schemaRoutes);
app.use('/api', schemaRoutes);

describe('Schema API Endpoints', () => {
  let testCategory: any;
  let testPost: any;
  let testTag: any;

  beforeEach(async () => {
    // Create test data
    testCategory = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      isActive: true,
    });

    testTag = await Tag.create({
      name: 'Test Tag',
      slug: 'test-tag',
      isActive: true,
    });

    testPost = await Post.create({
      title: 'Test Post',
      slug: 'test-post',
      content: 'Test content for schema testing',
      categoryId: testCategory._id,
      status: 'published',
      tagsRelation: [testTag._id],
    });
  });

  describe('GET /api/schema/tables', () => {
    it('should return list of collections', async () => {
      const res = await request(app).get('/api/schema/tables');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tables).toBeDefined();
      expect(Array.isArray(res.body.data.tables)).toBe(true);
    });

    it('should include collection metadata', async () => {
      const res = await request(app).get('/api/schema/tables');

      expect(res.status).toBe(200);
      const tables = res.body.data.tables;

      // Check if any table has the required fields
      if (tables.length > 0) {
        const table = tables[0];
        expect(table).toHaveProperty('name');
        expect(table).toHaveProperty('description');
        expect(table).toHaveProperty('row_count');
      }
    });

    it('should return correct row counts', async () => {
      const res = await request(app).get('/api/schema/tables');

      expect(res.status).toBe(200);
      const tables = res.body.data.tables;

      // Find categories and posts tables
      const categoriesTable = tables.find((t: any) => t.name === 'categories');
      const postsTable = tables.find((t: any) => t.name === 'posts');
      const tagsTable = tables.find((t: any) => t.name === 'tags');

      if (categoriesTable) {
        expect(categoriesTable.row_count).toBeGreaterThanOrEqual(1);
      }
      if (postsTable) {
        expect(postsTable.row_count).toBeGreaterThanOrEqual(1);
      }
      if (tagsTable) {
        expect(tagsTable.row_count).toBeGreaterThanOrEqual(1);
      }
    });
  });

  describe('GET /api/schema/tables/:table_name', () => {
    it('should return collection detail for posts', async () => {
      const res = await request(app).get('/api/schema/tables/posts');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.name).toBe('posts');
      expect(res.body.data.columns).toBeDefined();
      expect(Array.isArray(res.body.data.columns)).toBe(true);
    });

    it('should return columns with correct structure', async () => {
      const res = await request(app).get('/api/schema/tables/posts');

      expect(res.status).toBe(200);
      const columns = res.body.data.columns;

      // Check column structure
      const titleColumn = columns.find((c: any) => c.name === 'title');
      expect(titleColumn).toBeDefined();
      expect(titleColumn.type).toContain('VARCHAR');
      expect(titleColumn.nullable).toBe(false);

      // Check _id column
      const idColumn = columns.find((c: any) => c.name === '_id');
      expect(idColumn).toBeDefined();
      expect(idColumn.primary_key).toBe(true);
    });

    it('should return relationships for referenced fields', async () => {
      const res = await request(app).get('/api/schema/tables/posts');

      expect(res.status).toBe(200);
      const relationships = res.body.data.relationships;

      expect(Array.isArray(relationships)).toBe(true);

      // Posts should have relationship to Category via categoryId
      const categoryRel = relationships.find((r: any) => r.field === 'categoryId');
      expect(categoryRel).toBeDefined();
      expect(categoryRel.references).toBe('categorys');
      expect(categoryRel.type).toBe('many_to_one');
    });

    it('should return 404 for non-existent collection', async () => {
      const res = await request(app).get('/api/schema/tables/nonexistent');

      expect(res.status).toBe(404);
    });

    it('should return 404 for system collections', async () => {
      const res = await request(app).get('/api/schema/tables/system.users');

      expect(res.status).toBe(404);
    });

    it('should return collection detail for categories', async () => {
      const res = await request(app).get('/api/schema/tables/categories');

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('categories');

      // Check for self-referencing relationship (parentId)
      const relationships = res.body.data.relationships;
      const parentRel = relationships.find((r: any) => r.field === 'parentId');
      expect(parentRel).toBeDefined();
    });
  });

  describe('POST /api/query/execute', () => {
    it('should execute simple query', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toBeDefined();
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.row_count).toBeGreaterThanOrEqual(1);
    });

    it('should execute query with filter', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: { status: 'published' },
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.length).toBeGreaterThanOrEqual(1);
      expect(res.body.data[0].status).toBe('published');
    });

    it('should execute query with projection', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          projection: { title: 1, slug: 1 },
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.columns).toContain('title');
      expect(res.body.columns).toContain('slug');
    });

    it('should respect limit constraint', async () => {
      // Create more posts
      for (let i = 0; i < 5; i++) {
        await Post.create({
          title: `Extra Post ${i}`,
          slug: `extra-post-${i}`,
          content: 'Content',
          categoryId: testCategory._id,
          status: 'published',
        });
      }

      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          limit: 3,
        });

      expect(res.status).toBe(200);
      expect(res.body.row_count).toBeLessThanOrEqual(3);
    });

    it('should reject query without collection', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          filter: {},
        });

      expect(res.status).toBe(400);
    });

    it('should reject query with disallowed collection', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'system.users',
          filter: {},
        });

      expect(res.status).toBe(403);
    });

    it('should reject dangerous operators', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: { $where: 'this.title == "test"' },
        });

      expect(res.status).toBe(400);
    });

    it('should allow safe operators', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {
            $or: [
              { status: 'published' },
              { status: 'draft' },
            ],
          },
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should execute query with sort', async () => {
      // Create more posts with different dates
      await Post.create({
        title: 'Older Post',
        slug: 'older-post',
        content: 'Content',
        categoryId: testCategory._id,
        status: 'published',
        createdAt: new Date('2020-01-01'),
      });

      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          sort: { createdAt: -1 },
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it('should include execution time', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          limit: 10,
        });

      expect(res.status).toBe(200);
      expect(res.body.execution_time_ms).toBeDefined();
      expect(typeof res.body.execution_time_ms).toBe('number');
    });

    it('should reject timeout exceeding max', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          timeout: 120, // Exceeds MAX_TIMEOUT_SECONDS (60)
        });

      expect(res.status).toBe(400);
    });

    it('should reject limit exceeding max', async () => {
      const res = await request(app)
        .post('/api/query/execute')
        .send({
          collection: 'posts',
          filter: {},
          limit: 5000, // Exceeds MAX_ROWS (1000)
        });

      expect(res.status).toBe(400);
    });
  });
});
