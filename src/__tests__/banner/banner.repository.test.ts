import { Types } from 'mongoose';
import { BannerRepository } from '../../repositories/banner.repository';
import { Banner } from '../../models/banner.model';
import { Post } from '../../models/post.model';
import { Category } from '../../models/category.model';

describe('BannerRepository', () => {
  let bannerRepository: BannerRepository;
  let testCategory: any;
  let testPost: any;

  beforeAll(() => {
    bannerRepository = new BannerRepository();
  });

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
  });

  describe('create', () => {
    it('should create a new banner', async () => {
      const bannerData = {
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Test Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test-post/',
        position: 'hero' as const,
        status: 'active' as const,
        isAutoAssigned: false,
      };

      const banner = await bannerRepository.create(bannerData);

      expect(banner).toBeDefined();
      expect(banner.title).toBe('Test Banner');
      expect(banner.position).toBe('hero');
      expect(banner.status).toBe('active');
    });
  });

  describe('findById', () => {
    it('should find banner by ID', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Find By ID Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const found = await bannerRepository.findById(created._id.toString());

      expect(found).toBeDefined();
      expect(found?.title).toBe('Find By ID Test');
    });

    it('should return null for invalid ID', async () => {
      const found = await bannerRepository.findById('invalid-id');
      expect(found).toBeNull();
    });

    it('should return null for non-existent ID', async () => {
      const fakeId = new Types.ObjectId().toString();
      const found = await bannerRepository.findById(fakeId);
      expect(found).toBeNull();
    });
  });

  describe('findByPostId', () => {
    it('should find banner by post ID', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Find By Post Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const found = await bannerRepository.findByPostId(testPost._id.toString());

      expect(found).toBeDefined();
      expect(found?.title).toBe('Find By Post Test');
    });

    it('should return null for non-existent post', async () => {
      const fakeId = new Types.ObjectId().toString();
      const found = await bannerRepository.findByPostId(fakeId);
      expect(found).toBeNull();
    });
  });

  describe('findAllWithFilters', () => {
    beforeEach(async () => {
      // Create multiple banners
      await Banner.create([
        {
          postId: testPost._id,
          categoryId: testCategory._id,
          title: 'Hero Banner',
          imageUrl: 'https://example.com/1.jpg',
          linkUrl: '/1/',
          position: 'hero',
          status: 'active',
          rank: 1,
        },
      ]);

      // Create another post for second banner
      const post2 = await Post.create({
        title: 'Test Post 2',
        slug: 'test-post-2',
        content: 'Test content 2',
        coverImage: 'https://example.com/image2.jpg',
        categoryId: testCategory._id,
        status: 'published',
      });

      await Banner.create({
        postId: post2._id,
        categoryId: testCategory._id,
        title: 'Sidebar Banner',
        imageUrl: 'https://example.com/2.jpg',
        linkUrl: '/2/',
        position: 'sidebar',
        status: 'inactive',
        rank: 2,
      });
    });

    it('should return all banners with pagination', async () => {
      const result = await bannerRepository.findAllWithFilters({ page: 1, limit: 10 });

      expect(result.data.length).toBe(2);
      expect(result.total).toBe(2);
    });

    it('should filter by position', async () => {
      const result = await bannerRepository.findAllWithFilters({ position: 'hero' });

      expect(result.data.length).toBe(1);
      expect(result.data[0].position).toBe('hero');
    });

    it('should filter by status', async () => {
      const result = await bannerRepository.findAllWithFilters({ status: 'active' });

      expect(result.data.length).toBe(1);
      expect(result.data[0].status).toBe('active');
    });

    it('should sort by rank ascending', async () => {
      const result = await bannerRepository.findAllWithFilters({
        sortBy: 'rank',
        sortOrder: 'ASC',
      });

      expect(result.data[0].rank).toBe(1);
      expect(result.data[1].rank).toBe(2);
    });
  });

  describe('findActiveByPosition', () => {
    it('should find active banners by position', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Active Hero',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        rank: 1,
      });

      const banners = await bannerRepository.findActiveByPosition('hero', 10);

      expect(banners.length).toBe(1);
      expect(banners[0].title).toBe('Active Hero');
    });

    it('should not return inactive banners', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Inactive Hero',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'inactive',
      });

      const banners = await bannerRepository.findActiveByPosition('hero', 10);

      expect(banners.length).toBe(0);
    });

    it('should respect date constraints', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 1);

      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Future Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        startDate: futureDate, // Starts in future
      });

      const banners = await bannerRepository.findActiveByPosition('hero', 10);

      expect(banners.length).toBe(0);
    });
  });

  describe('findActiveByCategory', () => {
    it('should find active banners by category', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Category Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        rank: 1,
      });

      const banners = await bannerRepository.findActiveByCategory(
        testCategory._id.toString(),
        10
      );

      expect(banners.length).toBe(1);
      expect(banners[0].title).toBe('Category Banner');
    });

    it('should return empty array for invalid category ID', async () => {
      const banners = await bannerRepository.findActiveByCategory('invalid-id', 10);
      expect(banners).toEqual([]);
    });
  });

  describe('update', () => {
    it('should update banner', async () => {
      const created = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Original Title',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const updated = await bannerRepository.update(created._id.toString(), {
        title: 'Updated Title',
        status: 'inactive',
      } as any);

      expect(updated?.title).toBe('Updated Title');
      expect(updated?.status).toBe('inactive');
    });

    it('should return null for invalid ID', async () => {
      const updated = await bannerRepository.update('invalid-id', { title: 'Test' } as any);
      expect(updated).toBeNull();
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

      const result = await bannerRepository.delete(created._id.toString());

      expect(result).toBe(true);

      const found = await Banner.findById(created._id);
      expect(found).toBeNull();
    });

    it('should return false for non-existent ID', async () => {
      const fakeId = new Types.ObjectId().toString();
      const result = await bannerRepository.delete(fakeId);
      expect(result).toBe(false);
    });
  });

  describe('deleteByPostId', () => {
    it('should delete banner by post ID', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'To Delete By Post',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const result = await bannerRepository.deleteByPostId(testPost._id.toString());

      expect(result).toBe(true);
    });
  });

  describe('findAutoAssigned', () => {
    it('should find all auto-assigned banners', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Auto Banner',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: true,
      });

      const banners = await bannerRepository.findAutoAssigned();

      expect(banners.length).toBe(1);
      expect(banners[0].isAutoAssigned).toBe(true);
    });
  });

  describe('deleteAllAutoAssigned', () => {
    it('should delete all auto-assigned banners', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Auto Banner 1',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: true,
      });

      const deletedCount = await bannerRepository.deleteAllAutoAssigned();

      expect(deletedCount).toBe(1);
    });
  });

  describe('incrementViewCount', () => {
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

      await bannerRepository.incrementViewCount(created._id.toString());

      const updated = await Banner.findById(created._id);
      expect(updated?.viewCount).toBe(1);
    });
  });

  describe('incrementClickCount', () => {
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

      await bannerRepository.incrementClickCount(created._id.toString());

      const updated = await Banner.findById(created._id);
      expect(updated?.clickCount).toBe(1);
    });
  });

  describe('count', () => {
    it('should count banners', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Count Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const count = await bannerRepository.count();

      expect(count).toBe(1);
    });

    it('should count with filters', async () => {
      await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Count Test',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
      });

      const count = await bannerRepository.count({ status: 'inactive' });

      expect(count).toBe(0);
    });
  });

  describe('bulkUpsertTrending', () => {
    it('should bulk upsert trending banners', async () => {
      const trendingData = [
        {
          postId: testPost._id.toString(),
          categoryId: testCategory._id.toString(),
          title: 'Trending Post 1',
          imageUrl: 'https://example.com/1.jpg',
          linkUrl: '/post-1/',
          rank: 1,
        },
      ];

      await bannerRepository.bulkUpsertTrending(trendingData, 'hero');

      const banners = await Banner.find({ isAutoAssigned: true });

      expect(banners.length).toBe(1);
      expect(banners[0].title).toBe('Trending Post 1');
      expect(banners[0].rank).toBe(1);
      expect(banners[0].isAutoAssigned).toBe(true);
    });
  });

  describe('removeNonTrendingByCategory', () => {
    it('should remove non-trending banners by category', async () => {
      const banner1 = await Banner.create({
        postId: testPost._id,
        categoryId: testCategory._id,
        title: 'Trending',
        imageUrl: 'https://example.com/banner.jpg',
        linkUrl: '/test/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: true,
      });

      const post2 = await Post.create({
        title: 'Test Post 2',
        slug: 'test-post-2',
        content: 'Test content 2',
        coverImage: 'https://example.com/image2.jpg',
        categoryId: testCategory._id,
        status: 'published',
      });

      await Banner.create({
        postId: post2._id,
        categoryId: testCategory._id,
        title: 'Non-Trending',
        imageUrl: 'https://example.com/banner2.jpg',
        linkUrl: '/test2/',
        position: 'hero',
        status: 'active',
        isAutoAssigned: true,
      });

      // Keep only testPost in trending
      const removedCount = await bannerRepository.removeNonTrendingByCategory(
        testCategory._id.toString(),
        [testPost._id.toString()]
      );

      expect(removedCount).toBe(1);

      // Check that only banner1 remains
      const remainingBanners = await Banner.find({ categoryId: testCategory._id });
      expect(remainingBanners.length).toBe(1);
      expect(remainingBanners[0].postId.toString()).toBe(testPost._id.toString());
    });
  });
});
