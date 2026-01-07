import request from 'supertest';
import express from 'express';
import { Types } from 'mongoose';
import bannerRoutes from '../../routes/banner-routes';
import { Banner } from '../../models/banner.model';
import { Post } from '../../models/post.model';
import { Category } from '../../models/category.model';
import { User } from '../../models/user.model';
import jwt from 'jsonwebtoken';

// Create test app
const app = express();
app.use(express.json());

// Mock auth middleware for testing
const mockAuthMiddleware = (req: any, _res: any, next: any) => {
  // Add mock user to request
  req.user = {
    id: new Types.ObjectId().toString(),
    email: 'admin@test.com',
    role: 'admin',
    permissions: ['banner:create', 'banner:edit', 'banner:delete', 'banner:sync'],
  };
  next();
};

// Mock auth and permission middlewares
jest.mock('../../middleware/auth.middleware', () => ({
  requireAuth: (req: any, _res: any, next: any) => {
    req.user = {
      id: new Types.ObjectId().toString(),
      email: 'admin@test.com',
      role: 'admin',
      permissions: ['banner:create', 'banner:edit', 'banner:delete', 'banner:sync'],
    };
    next();
  },
}));

jest.mock('../../middleware/rbac.middleware', () => ({
  requirePermission: () => (_req: any, _res: any, next: any) => next(),
  attachUser: () => (_req: any, _res: any, next: any) => next(),
}));

app.use('/api/banners', bannerRoutes);

describe('Banner API Endpoints', () => {
  let testCategory: any;
  let testPost: any;
  let testBanner: any;

  beforeEach(async () => {
    // Create test category
    testCategory = await Category.create({
      name: 'Test Category',
      slug: 'test-category',
      isActive: true,
    });

    // Create test post
    testPost = await Post.create({
      title: 'Test Post',
      slug: 'test-post',
      content: 'Test content',
      coverImage: 'https://example.com/image.jpg',
      categoryId: testCategory._id,
      status: 'published',
      viewCount: 100,
    });

    // Create test banner
    testBanner = await Banner.create({
      postId: testPost._id,
      categoryId: testCategory._id,
      title: 'Test Banner',
      imageUrl: 'https://example.com/banner.jpg',
      linkUrl: '/test-post/',
      position: 'hero',
      status: 'active',
      isAutoAssigned: false,
      viewCount: 10,
      clickCount: 5,
    });
  });

  describe('GET /api/banners', () => {
    it('should return paginated banners', async () => {
      const res = await request(app)
        .get('/api/banners')
        .query({ page: 1, limit: 10 });

      expect(res.status).toBe(200);
      expect(res.body.data).toBeDefined();
      expect(res.body.pagination).toBeDefined();
      expect(res.body.data.length).toBe(1);
    });

    it('should filter by position', async () => {
      const res = await request(app)
        .get('/api/banners')
        .query({ position: 'hero' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
      expect(res.body.data[0].position).toBe('hero');
    });

    it('should filter by status', async () => {
      const res = await request(app)
        .get('/api/banners')
        .query({ status: 'active' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(1);
    });

    it('should filter by isAutoAssigned', async () => {
      const res = await request(app)
        .get('/api/banners')
        .query({ isAutoAssigned: 'true' });

      expect(res.status).toBe(200);
      expect(res.body.data.length).toBe(0); // testBanner is not auto-assigned
    });
  });

  describe('GET /api/banners/trending', () => {
    beforeEach(async () => {
      // Create auto-assigned banner
      const post2 = await Post.create({
        title: 'Trending Post',
        slug: 'trending-post',
        content: 'Content',
        coverImage: 'https://example.com/2.jpg',
        categoryId: testCategory._id,
        status: 'published',
        viewCount: 1000,
      });

      await Banner.create({
        postId: post2._id,
        categoryId: testCategory._id,
        title: 'Trending Banner',
        imageUrl: 'https://example.com/trending.jpg',
        linkUrl: '/trending-post/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: true,
      });
    });

    it('should return trending banners', async () => {
      const res = await request(app)
        .get('/api/banners/trending')
        .query({ limit: 10 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].isAutoAssigned).toBe(true);
    });
  });

  describe('GET /api/banners/statistics', () => {
    it('should return banner statistics', async () => {
      const res = await request(app).get('/api/banners/statistics');

      expect(res.status).toBe(200);
      expect(res.body.total).toBeDefined();
      expect(res.body.byPosition).toBeDefined();
      expect(res.body.autoAssigned).toBeDefined();
      expect(res.body.manual).toBeDefined();
    });
  });

  describe('GET /api/banners/position/:position', () => {
    it('should return banners by position', async () => {
      const res = await request(app)
        .get('/api/banners/position/hero')
        .query({ limit: 10 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
      expect(res.body[0].position).toBe('hero');
    });

    it('should return 400 for invalid position', async () => {
      const res = await request(app).get('/api/banners/position/invalid');

      expect(res.status).toBe(400);
    });
  });

  describe('GET /api/banners/category/:categoryId', () => {
    it('should return banners by category', async () => {
      const res = await request(app)
        .get(`/api/banners/category/${testCategory._id}`)
        .query({ limit: 10 });

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(1);
    });

    it('should return 400 for invalid category ID', async () => {
      const res = await request(app).get('/api/banners/category/invalid-id');

      expect(res.status).toBe(400);
    });

    it('should return empty array for non-existent category', async () => {
      const fakeId = new Types.ObjectId().toString();
      const res = await request(app).get(`/api/banners/category/${fakeId}`);

      expect(res.status).toBe(200);
      expect(res.body).toEqual([]);
    });
  });

  describe('GET /api/banners/post/:postId', () => {
    it('should return banner by post ID', async () => {
      const res = await request(app).get(`/api/banners/post/${testPost._id}`);

      expect(res.status).toBe(200);
      expect(res.body.postId).toBe(testPost._id.toString());
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new Types.ObjectId().toString();
      const res = await request(app).get(`/api/banners/post/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('GET /api/banners/post/:postId/rank', () => {
    it('should return post trending rank', async () => {
      const res = await request(app)
        .get(`/api/banners/post/${testPost._id}/rank`)
        .query({ topCount: 10 });

      expect(res.status).toBe(200);
      expect(res.body.postId).toBe(testPost._id.toString());
      expect(res.body.rank).toBeDefined();
      expect(res.body.isInTrending).toBeDefined();
    });
  });

  describe('GET /api/banners/:id', () => {
    it('should return banner by ID', async () => {
      const res = await request(app).get(`/api/banners/${testBanner._id}`);

      expect(res.status).toBe(200);
      expect(res.body.id || res.body._id).toBeDefined();
      expect(res.body.title).toBe('Test Banner');
    });

    it('should return 404 for non-existent ID', async () => {
      const fakeId = new Types.ObjectId().toString();
      const res = await request(app).get(`/api/banners/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/banners', () => {
    it('should create new banner', async () => {
      // Create new post for this banner
      const newPost = await Post.create({
        title: 'New Post',
        slug: 'new-post',
        content: 'Content',
        coverImage: 'https://example.com/new.jpg',
        categoryId: testCategory._id,
        status: 'published',
      });

      const res = await request(app)
        .post('/api/banners')
        .send({
          postId: newPost._id.toString(),
          title: 'New Banner',
          position: 'sidebar',
        });

      expect(res.status).toBe(201);
      expect(res.body.title).toBe('New Banner');
      expect(res.body.position).toBe('sidebar');
    });

    it('should return 400 without postId', async () => {
      const res = await request(app)
        .post('/api/banners')
        .send({
          title: 'No Post Banner',
        });

      expect(res.status).toBe(400);
    });

    it('should return 404 for non-existent post', async () => {
      const fakeId = new Types.ObjectId().toString();
      const res = await request(app)
        .post('/api/banners')
        .send({
          postId: fakeId,
          title: 'Fake Banner',
        });

      expect(res.status).toBe(404);
    });

    it('should return 409 for duplicate banner', async () => {
      // Try to create another banner for the same post
      const res = await request(app)
        .post('/api/banners')
        .send({
          postId: testPost._id.toString(),
          title: 'Duplicate Banner',
        });

      expect(res.status).toBe(409);
    });
  });

  describe('PUT /api/banners/:id', () => {
    it('should update banner', async () => {
      const res = await request(app)
        .put(`/api/banners/${testBanner._id}`)
        .send({
          title: 'Updated Banner',
          status: 'inactive',
        });

      expect(res.status).toBe(200);
      expect(res.body.title).toBe('Updated Banner');
      expect(res.body.status).toBe('inactive');
    });

    it('should return 404 for non-existent banner', async () => {
      const fakeId = new Types.ObjectId().toString();
      const res = await request(app)
        .put(`/api/banners/${fakeId}`)
        .send({ title: 'Updated' });

      expect(res.status).toBe(404);
    });
  });

  describe('DELETE /api/banners/:id', () => {
    it('should delete banner', async () => {
      const res = await request(app).delete(`/api/banners/${testBanner._id}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify deletion
      const deleted = await Banner.findById(testBanner._id);
      expect(deleted).toBeNull();
    });

    it('should return 404 for non-existent banner', async () => {
      const fakeId = new Types.ObjectId().toString();
      const res = await request(app).delete(`/api/banners/${fakeId}`);

      expect(res.status).toBe(404);
    });
  });

  describe('POST /api/banners/sync-trending', () => {
    beforeEach(async () => {
      // Create multiple posts with different view counts
      await Post.create([
        {
          title: 'High View Post 1',
          slug: 'high-view-1',
          content: 'Content',
          coverImage: 'https://example.com/high1.jpg',
          categoryId: testCategory._id,
          status: 'published',
          viewCount: 5000,
        },
        {
          title: 'High View Post 2',
          slug: 'high-view-2',
          content: 'Content',
          coverImage: 'https://example.com/high2.jpg',
          categoryId: testCategory._id,
          status: 'published',
          viewCount: 3000,
        },
      ]);
    });

    it('should sync trending banners', async () => {
      const res = await request(app)
        .post('/api/banners/sync-trending')
        .send({ topCount: 5 });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.created).toBeDefined();
      expect(res.body.updated).toBeDefined();
      expect(res.body.removed).toBeDefined();
      expect(res.body.topPosts).toBeDefined();
      expect(res.body.byCategory).toBeDefined();
    });

    it('should sync with minViewCount filter', async () => {
      const res = await request(app)
        .post('/api/banners/sync-trending')
        .send({
          topCount: 10,
          minViewCount: 4000,
        });

      expect(res.status).toBe(200);
      // Only 1 post has viewCount >= 4000 (5000)
      expect(res.body.topPosts.length).toBeLessThanOrEqual(1);
    });

    it('should sync specific category', async () => {
      const res = await request(app)
        .post('/api/banners/sync-trending')
        .send({
          topCount: 10,
          categoryId: testCategory._id.toString(),
        });

      expect(res.status).toBe(200);
      expect(res.body.byCategory.length).toBe(1);
    });
  });

  describe('POST /api/banners/:id/view', () => {
    it('should track view', async () => {
      const initialViewCount = testBanner.viewCount;

      const res = await request(app).post(`/api/banners/${testBanner._id}/view`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify view count increased
      const updated = await Banner.findById(testBanner._id);
      expect(updated?.viewCount).toBe(initialViewCount + 1);
    });
  });

  describe('POST /api/banners/:id/click', () => {
    it('should track click', async () => {
      const initialClickCount = testBanner.clickCount;

      const res = await request(app).post(`/api/banners/${testBanner._id}/click`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify click count increased
      const updated = await Banner.findById(testBanner._id);
      expect(updated?.clickCount).toBe(initialClickCount + 1);
    });
  });
});
