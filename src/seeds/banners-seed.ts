/**
 * Seed banners by syncing with top trending posts
 * This script will auto-generate banners for Top 10 posts by viewCount
 */

import mongoose from 'mongoose';
import { Post } from '../models/post.model';
import { bannerService } from '../services/banner.service';
import dotenv from 'dotenv';

dotenv.config();

async function seedBanners() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';
    console.log('Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('Connected to MongoDB');

    // First, add some random viewCounts to existing posts for testing
    console.log('\n--- Adding random viewCounts to posts ---');
    const posts = await Post.find({ status: 'published' });

    if (posts.length === 0) {
      console.log('⚠ No published posts found. Please run construction-posts-seed.ts first.');
      return;
    }

    // Update posts with random viewCounts
    const bulkOps = posts.map(post => ({
      updateOne: {
        filter: { _id: post._id },
        update: {
          $set: {
            viewCount: Math.floor(Math.random() * 10000) + 100,
            shareCount: Math.floor(Math.random() * 500),
            likeCount: Math.floor(Math.random() * 1000),
            commentCount: Math.floor(Math.random() * 100),
          },
        },
      },
    }));

    await Post.bulkWrite(bulkOps);
    console.log(`✓ Updated ${posts.length} posts with random engagement data`);

    // Now sync trending banners
    console.log('\n--- Syncing Trending Banners ---');
    const result = await bannerService.syncTrendingBanners({
      topCount: 10,
      position: 'hero',
      minViewCount: 0,
    });

    console.log('\n✅ Banner sync completed!');
    console.log(`\nSummary:`);
    console.log(`- Created: ${result.created} banners`);
    console.log(`- Updated: ${result.updated} banners`);
    console.log(`- Removed: ${result.removed} banners`);

    console.log('\n📊 Top 10 Trending Posts:');
    result.topPosts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.title.substring(0, 50)}... (${post.viewCount} views)`);
    });

    // Verify posts have isTrending flag set
    const trendingPosts = await Post.find({ isTrending: true }).select('title trendingRank viewCount');
    console.log(`\n🔥 Posts marked as trending: ${trendingPosts.length}`);

  } catch (error) {
    console.error('Seed error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run if called directly
seedBanners();
