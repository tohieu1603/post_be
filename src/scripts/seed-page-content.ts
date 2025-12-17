import mongoose from 'mongoose';
import { config } from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables
config();

// Import model
import { PageContent } from '../models/page-content.model';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/managepost';

async function seedPageContent() {
  console.log('Starting PageContent seeding...\n');

  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Read page-content.json
    const jsonPath = path.join(process.cwd(), '..', 'page-content.json');
    console.log(`Reading from: ${jsonPath}`);

    if (!fs.existsSync(jsonPath)) {
      throw new Error(`File not found: ${jsonPath}`);
    }

    const jsonContent = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
    const sectionKeys = Object.keys(jsonContent);
    console.log(`Found ${sectionKeys.length} sections: ${sectionKeys.join(', ')}\n`);

    // Clear existing PageContent data
    console.log('Clearing existing PageContent data...');
    await PageContent.deleteMany({});
    console.log('Cleared existing data\n');

    // Prepare document - lưu nguyên cục JSON
    const pageSlug = 'thiet-ke-website-doanh-nghiep';
    const pageName = 'Thiết kế website doanh nghiệp';

    const document = {
      pageSlug,
      pageName,
      content: jsonContent, // Raw JSON content
      isActive: true,
    };

    // Insert document
    console.log('Seeding PageContent...');
    const result = await PageContent.create(document);
    console.log(`Created page: ${result.pageSlug}\n`);

    // Summary
    console.log('='.repeat(50));
    console.log('PageContent seeding completed successfully!\n');
    console.log('Summary:');
    console.log(`   - Page: ${pageName} (${pageSlug})`);
    console.log(`   - Content sections: ${sectionKeys.length}`);
    console.log(`   - Sections: ${sectionKeys.join(', ')}`);
    console.log('='.repeat(50));

  } catch (error) {
    console.error('Seeding failed:', error);
    throw error;
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

// Run seed
seedPageContent()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
