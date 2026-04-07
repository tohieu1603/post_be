import mongoose from 'mongoose';
import { config } from 'dotenv';
config();

import { Category } from '../models/category.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';

const NAV_CATEGORIES = [
  { name: 'AI Models', slug: 'ai-models', description: 'Model mới, benchmark, so sánh hiệu năng', sortOrder: 1 },
  { name: 'AI Tools', slug: 'ai-tools', description: 'Review công cụ AI, hướng dẫn sử dụng', sortOrder: 2 },
  { name: 'AI Agents', slug: 'ai-agents', description: 'Agent AI, automation, workflow tự động', sortOrder: 3 },
  { name: 'AI Code', slug: 'ai-code', description: 'Dev tools, coding assistants, IDE plugins', sortOrder: 4 },
  { name: 'AI Creative', slug: 'ai-creative', description: 'AI tạo video, hình ảnh, giọng nói, âm nhạc', sortOrder: 5 },
  { name: 'AI Business', slug: 'ai-business', description: 'Startup, funding, chiến lược kinh doanh AI', sortOrder: 6 },
  { name: 'Research', slug: 'research', description: 'Paper nghiên cứu, phân tích kỹ thuật chuyên sâu', sortOrder: 7 },
  { name: 'Tutorials', slug: 'tutorials', description: 'Hướng dẫn thực hành, tutorial step-by-step', sortOrder: 8 },
  { name: 'AI Vietnam', slug: 'ai-vietnam', description: 'Tin tức AI tại Việt Nam', sortOrder: 9 },
  { name: 'Prompt Lab', slug: 'prompt-lab', description: 'Prompt hay, tips & tricks, kỹ thuật prompting', sortOrder: 10 },
];

async function seed() {
  await mongoose.connect(MONGODB_URI);
  console.log('Connected to MongoDB');

  for (const cat of NAV_CATEGORIES) {
    const existing = await Category.findOne({ slug: cat.slug });
    if (existing) {
      console.log(`  ✓ "${cat.name}" already exists — skipped`);
    } else {
      await Category.create({ ...cat, isActive: true, level: 0 });
      console.log(`  + "${cat.name}" created`);
    }
  }

  // Deactivate old categories that are no longer in nav
  const oldSlugs = ['model-moi', 'github-hot', 'ai-flash'];
  for (const slug of oldSlugs) {
    const old = await Category.findOne({ slug });
    if (old) {
      console.log(`  ~ "${old.name}" (${slug}) kept but not in nav`);
    }
  }

  const total = await Category.countDocuments({ isActive: true });
  console.log(`\nDone. Total active categories: ${total}`);
  await mongoose.disconnect();
}

seed().catch(err => { console.error(err); process.exit(1); });
