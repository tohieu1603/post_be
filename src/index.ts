import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import swaggerUi from 'swagger-ui-express';
import { connectDatabase } from './config/database';
import { swaggerSpec } from './config/swagger';
import categoryRoutes from './routes/category-routes';
import postRoutes from './routes/post-routes';
import tagRoutes from './routes/tag-routes';
import mediaRoutes from './routes/media-routes';
import userRoutes from './routes/user-routes';
import settingsRoutes from './routes/settings-routes';
import seoRoutes from './routes/seo-routes';
import autoSeoRoutes from './routes/auto-seo-routes';
import publicSeoRoutes from './routes/public-seo-routes';
import authRoutes from './routes/auth-routes';
import pageContentRoutes from './routes/page-content-routes';
import publicApiRoutes from './routes/public-api-routes';
import analyticsRoutes from './routes/analytics-routes';
import authorRoutes from './routes/author-routes';
import bannerRoutes from './routes/banner-routes';
import dictionaryRoutes from './routes/dictionary-routes';
import schemaRoutes from './routes/schema-routes';
import mcpRoutes from './routes/mcp-routes';
import { attachUser } from './middleware/rbac.middleware';
import { authService } from './services/auth.service';
import { seoSchedulerService } from './services/seo-scheduler.service';
import {
  securityMiddleware,
  // generalRateLimiter, // disabled for development
  authRateLimiter,
  uploadRateLimiter,
  publicApiRateLimiter,
  corsOptions,
  requestSizeLimit,
} from './middleware/security.middleware';
import { redirectMiddleware } from './middleware/redirect.middleware';
import { cacheMiddleware } from './middleware/cache.middleware';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// ============================================
// SWAGGER - BEFORE SECURITY (needs inline scripts)
// ============================================
app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'ManagePost API Documentation',
}));

app.get('/api/docs.json', (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ============================================
// SECURITY MIDDLEWARE (ORDER MATTERS!)
// ============================================

// 1. Security headers & protections
app.use(securityMiddleware);

// 2. CORS with security options
app.use(cors(corsOptions));

// 3. Body parsers with size limits
app.use(express.json({ limit: requestSizeLimit.json }));
app.use(express.urlencoded({ extended: true, limit: requestSizeLimit.urlencoded }));

// 4. General rate limiting for all routes (disabled for development)
// app.use('/api/', generalRateLimiter);

// 5. Attach user info from headers/token
app.use(attachUser());

// 6. Cache headers middleware
app.use(cacheMiddleware());

// 7. Redirect middleware (SEO redirects from database)
app.use(redirectMiddleware);

// Static files for uploads
const uploadDir = process.env.UPLOAD_DIR || 'uploads';
app.use('/uploads', express.static(path.join(process.cwd(), uploadDir)));

// Public SEO routes (sitemap.xml, robots.txt) - no /api prefix
app.use('/', publicSeoRoutes);

// API Routes with specific rate limiters
app.use('/api/auth', authRateLimiter, authRoutes); // Strict limit for auth
app.use('/api/categories', categoryRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/media', uploadRateLimiter, mediaRoutes); // Upload limit
app.use('/api/users', userRoutes);
app.use('/api/settings', settingsRoutes);
app.use('/api/seo', seoRoutes);
app.use('/api/auto-seo', autoSeoRoutes);
app.use('/api/page-content', pageContentRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/authors', authorRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/dictionary', dictionaryRoutes);
app.use('/api/schema', schemaRoutes); // Schema introspection
app.use('/api', schemaRoutes); // Query execute route
app.use('/api/public', publicApiRateLimiter, publicApiRoutes); // Public API limit
app.use('/api/mcp', mcpRoutes); // MCP Protocol endpoint for AI agents

// Health check
app.get('/api/health', (_, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Root redirect to docs
app.get('/', (_, res) => {
  res.redirect('/api/docs');
});

// Initialize database and start server
const startServer = async () => {
  try {
    await connectDatabase();
    console.log('Database connected successfully');

    // Create initial admin user if none exists
    await authService.createInitialAdmin();

    // Initialize SEO scheduler
    if (process.env.ENABLE_SEO_SCHEDULER !== 'false') {
      seoSchedulerService.init();
    }

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API Documentation: http://localhost:${PORT}/api/docs`);
    });
  } catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
  }
};

startServer();
