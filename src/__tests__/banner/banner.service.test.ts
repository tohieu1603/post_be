import { Types } from 'mongoose';
import { BannerService } from '../../services/banner.service';
import { Banner } from '../../models/banner.model';
import { Post } from '../../models/post.model';
import { Category } from '../../models/category.model';

describe('BannerService', () => {
  let bannerService: BannerService;
  let testCategory: any;
  let testCategory2: any;
  let testPost: any;

  beforeAll(() => {
    bannerService = new BannerService();
  });

  beforeEach(async () => {
    // Create test categories
    testCategory = await Category.create({
      name: 'Technology',
      slug: 'technology',
      isActive: true,
    });

    testCategory2 = await Category.create({
      name: 'Finance',
      slug: 'finance',
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
  });

  describe('getAll', () => {
    beforeEach(async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Test Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });
    });

    it('should return paginated banners', async () => {
      const result = await bannerService.getAll({ page: 1, limit: 10 });

      expect(result.data.length).toBe(1);
      expect(result.pagination.page).toBe(1);
      expect(result.pagination.limit).toBe(10);
      expect(result.pagination.total).toBe(1);
      expect(result.pagination.totalPages).toBe(1);
    });

    it('should apply filters', async () => {
      const result = await bannerService.getAll({ position: 'hero' });

      expect(result.data.length).toBe(1);
      expect(result.data[0].position).toBe('hero');
    });
  });

  describe('getById', () => {
    it('should get banner by ID', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Get By ID Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const banner = await bannerService.getById(created._id.toString());

      expect(banner).toBeDefined();
      expect(banner?.title).toBe('Get By ID Test');
    });

    it('should return null for non-existent ID', async () => {
      const banner = await bannerService.getById(new Types.ObjectId().toString());
      expect(banner).toBeNull();
    });
  });

  describe('getByPostId', () => {
    it('should get banner by post ID', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Get By Post Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const banner = await bannerService.getByPostId(testPost._id.toString());

      expect(banner).toBeDefined();
      expect(banner?.title).toBe('Get By Post Test');
    });
  });

  describe('getActiveByPosition', () => {
    it('should get active banners by position', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Hero Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const banners = await bannerService.getActiveByPosition('hero');

      expect(banners.length).toBe(1);
      expect(banners[0].position).toBe('hero');
    });
  });

  describe('getActiveByCategory', () => {
    it('should get active banners by category', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Category Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const banners = await bannerService.getActiveByCategory(testCategory._id.toString());

      expect(banners.length).toBe(1);
    });
  });

  describe('getTrending', () => {
    it('should get trending banners (auto-assigned in hero)', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Trending Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: true,
      });

      const banners = await bannerService.getTrending(10);

      expect(banners.length).toBe(1);
      expect(banners[0].isAutoAssigned).toBe(true);
    });

    it('should not return manual banners', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Manual Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: false,
      });

      const banners = await bannerService.getTrending(10);

      expect(banners.length).toBe(0);
    });
  });

  describe('create', () => {
    it('should create banner with post defaults', async () => {
      const banner = await bannerService.create({
        postId: testPost._id.toString(),
        position: 'sidebar',
      });

      expect(banner).toBeDefined();
      expect(banner.title).toBe(testPost.title);
      expect(banner.imageUrl).toBe(testPost.coverImage);
      expect(banner.linkUrl).toBe(`/${testPost.slug}/`);
      expect(banner.position).toBe('sidebar');
      expect(banner.isAutoAssigned).toBe(false);
    });

    it('should create banner with custom values', async () => {
      const banner = await bannerService.create({
        postId: testPost._id.toString(),
        title: 'Custom Title',
        imageUrl: 'https://custom.com/image.jpg',
        position: 'hero',
      });

      expect(banner.title).toBe('Custom Title');
      expect(banner.imageUrl).toBe('https://custom.com/image.jpg');
    });

    it('should throw error for non-existent post', async () => {
      const fakeId = new Types.ObjectId().toString();

      await expect(
        bannerService.create({ postId: fakeId })
      ).rejects.toThrow('Post not found');
    });
  });

  describe('update', () => {
    it('should update banner', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Original',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const updated = await bannerService.update(created._id.toString(), {
        title: 'Updated',
        status: 'inactive',
      });

      expect(updated?.title).toBe('Updated');
      expect(updated?.status).toBe('inactive');
    });
  });

  describe('delete', () => {
    it('should delete banner', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'To Delete',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const result = await bannerService.delete(created._id.toString());

      expect(result).toBe(true);
    });
  });

  describe('trackView', () => {
    it('should increment view count', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'View Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        viewCount: 0,
      });

      await bannerService.trackView(created._id.toString());

      const updated = await Banner.findById(created._id);
      expect(updated?.viewCount).toBe(1);
    });
  });

  describe('trackClick', () => {
    it('should increment click count', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Click Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        clickCount: 0,
      });

      await bannerService.trackClick(created._id.toString());

      const updated = await Banner.findById(created._id);
      expect(updated?.clickCount).toBe(1);
    });
  });

  describe('syncTrendingBanners', () => {
    beforeEach(async () => {
      // Create posts with different view counts in different categories
      await Post.create([
        {
          title: 'Tech Post 1',
          slug: 'tech-post-1',
          content: 'Content',
          coverImage: 'https://example.com/1.jpg',
          categoryId: testCategory._id,
          status: 'published',
          viewCount: 1000,
        },
        {
          title: 'Tech Post 2',
          slug: 'tech-post-2',
          content: 'Content',
          coverImage: 'https://example.com/2.jpg',
          categoryId: testCategory._id,
          status: 'published',
          viewCount: 500,
        },
        {
          title: 'Finance Post 1',
          slug: 'finance-post-1',
          content: 'Content',
          coverImage: 'https://example.com/3.jpg',
          categoryId: testCategory2._id,
          status: 'published',
          viewCount: 800,
        },
      ]);
    });

    it('should sync trending banners by category', async () => {
      const result = await bannerService.syncTrendingBanners({ topCount: 2 });

      expect(result.created).toBeGreaterThan(0);
      expect(result.byCategory.length).toBe(2); // Tech and Finance

      // Check banners were created
      const banners = await Banner.find({ isAutoAssigned: true });
      expect(banners.length).toBeGreaterThan(0);
    });

    it('should respect minViewCount filter', async () => {
      const result = await bannerService.syncTrendingBanners({
        topCount: 10,
        minViewCount: 600,
      });

      // Only posts with viewCount >= 600 should be included
      const banners = await Banner.find({ isAutoAssigned: true });
      expect(banners.length).toBe(2); // Tech Post 1 (1000), Finance Post 1 (800)
    });

    it('should sync specific category only', async () => {
      const result = await bannerService.syncTrendingBanners({
        topCount: 10,
        categoryId: testCategory._id.toString(),
      });

      expect(result.byCategory.length).toBe(1);
      expect(result.byCategory[0].categoryId).toBe(testCategory._id.toString());
    });
  });

  describe('getStatistics', () => {
    beforeEach(async () => {
      await Banner.create([
        {
          postId: testPost._id,
          categoryId: testCategory._id,
          title: 'Hero Auto',
          imageUrl: 'https://example.com/1.jpg',
          linkUrl: '/1/',
          position: 'hero',
          status: 'active',
          isAutoAssigned: true,
        },
      ]);

      const post2 = await Post.create({
        title: 'Post 2',
        slug: 'post-2',
        content: 'Content',
        coverImage: 'https://example.com/2.jpg',
        categoryId: testCategory._id,
        status: 'published',
      });

      await Banner.create({
        postId: post2._id,
        categoryId: testCategory._id,
        title: 'Sidebar Manual',
        imageUrl: 'https://example.com/2.jpg',
        linkUrl: '/2/',
        position: 'sidebar',
        status: 'active',
        isAutoAssigned: false,
      });
    });

    it('should return correct statistics', async () => {
      const stats = await bannerService.getStatistics();

      expect(stats.total).toBe(2);
      expect(stats.autoAssigned).toBe(1);
      expect(stats.manual).toBe(1);
      expect(stats.byPosition.hero).toBe(1);
      expect(stats.byPosition.sidebar).toBe(1);
    });
  });

  describe('isPostInTrending', () => {
    it('should check if post is in trending', async () => {
      // Create high view count post
      const highViewPost = await Post.create({
        title: 'High View Post',
        slug: 'high-view-post',
        content: 'Content',
        coverImage: 'https://example.com/high.jpg',
        categoryId: testCategory._id,
        status: 'published',
        viewCount: 10000,
      });

      const isInTrending = await bannerService.isPostInTrending(
        highViewPost._id.toString(),
        10
      );

      expect(isInTrending).toBe(true);
    });
  });

  describe('getPostTrendingRank', () => {
    beforeEach(async () => {
      // Create posts with different view counts
      await Post.create([
        {
          title: 'Rank 1',
          slug: 'rank-1',
          content: 'Content',
          coverImage: 'https://example.com/1.jpg',
          categoryId: testCategory._id,
          status: 'published',
          viewCount: 1000,
        },
        {
          title: 'Rank 2',
          slug: 'rank-2',
          content: 'Content',
          coverImage: 'https://example.com/2.jpg',
          categoryId: testCategory._id,
          status: 'published',
          viewCount: 500,
        },
      ]);
    });

    it('should return correct rank', async () => {
      const posts = await Post.find().sort({ viewCount: -1 });
      const topPost = posts[0];

      const rank = await bannerService.getPostTrendingRank(
        topPost._id.toString(),
        10
      );

      expect(rank).toBe(1);
    });

    it('should return 0 for post not in top', async () => {
      // Create post with very low views
      const lowViewPost = await Post.create({
        title: 'Low View',
        slug: 'low-view',
        content: 'Content',
        coverImage: 'https://example.com/low.jpg',
        categoryId: testCategory._id,
        status: 'published',
        viewCount: 1,
      });

      // Get rank with topCount=1 (only top 1)
      const rank = await bannerService.getPostTrendingRank(
        lowViewPost._id.toString(),
        1
      );

      expect(rank).toBe(0);
    });
  });
});
