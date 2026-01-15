/**
 * Generate long-term JWT token for service account
 * Usage: node scripts/generate-service-token.js
 */

const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Config from .env
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://admin:admin123@localhost:27017/managepost?authSource=admin';
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';

async function main() {
  try {
    // Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Check if service account exists
    const db = mongoose.connection.db;
    const usersCollection = db.collection('users');

    let serviceUser = await usersCollection.findOne({ email: 'seo-agent@system.internal' });

    if (!serviceUser) {
      // Create service account
      console.log('Creating service account...');

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash('service-account-no-login', salt);

      const result = await usersCollection.insertOne({
        email: 'seo-agent@system.internal',
        name: 'SEO Agent Service',
        passwordHash: passwordHash,
        role: 'admin', // Need admin for schema APIs
        isActive: true,
        isServiceAccount: true,
        permissions: ['read', 'schema:read', 'query:execute'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      serviceUser = await usersCollection.findOne({ _id: result.insertedId });
      console.log('✅ Service account created');
    } else {
      console.log('ℹ️ Service account already exists');
    }

    // Generate long-term token (365 days)
    const payload = {
      userId: serviceUser._id.toString(),
      email: serviceUser.email,
      role: serviceUser.role,
    };

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '365d' });

    console.log('\n========================================');
    console.log('SERVICE ACCOUNT TOKEN (365 days)');
    console.log('========================================');
    console.log('\nUser ID:', serviceUser._id.toString());
    console.log('Email:', serviceUser.email);
    console.log('Role:', serviceUser.role);
    console.log('\nToken:');
    console.log(token);
    console.log('\n========================================');

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('\nToken expires:', new Date(decoded.exp * 1000).toISOString());
    console.log('========================================\n');

  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

main();
