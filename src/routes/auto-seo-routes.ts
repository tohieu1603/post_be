/**
 * Auto SEO Routes
 * API endpoints for automated SEO analysis, indexing, and keyword tracking
 */

import { Router } from 'express';
import {
  analyzePost,
  getSeoScore,
  getSeoScores,
  submitUrlForIndexing,
  inspectUrl,
  getIndexStatus,
  getPageSpeedInsights,
  getKeywords,
  trackKeyword,
  deleteKeyword,
  syncKeywords,
  getSearchAnalytics,
  getSeoLogs,
  getDashboardStats,
  bulkAnalyze,
  bulkSubmitForIndexing,
} from '../controllers/auto-seo-controller';
import {
  aiAnalyzePost,
  suggestTitles,
  generateMetaDescription,
  suggestKeywords,
  generateOutline,
  improveContent,
  generateSmartMeta,
  getRealtimeSeoScore,
  suggestInternalLinks,
  checkDuplicateContent,
  generateSchema,
  generateImageAltText,
  optimizeContent,
  getSchedulerStatus,
  getLastReport,
  generateReport,
  triggerDailyTasks,
  triggerWeeklyTasks,
  triggerMonthlyTasks,
} from '../controllers/ai-seo-controller';
import { requirePermission } from '../middleware/rbac.middleware';

const router = Router();

// Dashboard
router.get('/dashboard', requirePermission('seo:manage'), getDashboardStats);

// SEO Analysis
router.post('/analyze/:postId', requirePermission('seo:manage'), analyzePost);
router.get('/score/:postId', requirePermission('seo:manage'), getSeoScore);
router.get('/scores', requirePermission('seo:manage'), getSeoScores);
router.post('/bulk-analyze', requirePermission('seo:manage'), bulkAnalyze);

// Google Indexing
router.post('/submit-index', requirePermission('seo:manage'), submitUrlForIndexing);
router.post('/inspect-url', requirePermission('seo:manage'), inspectUrl);
router.get('/index-status', requirePermission('seo:manage'), getIndexStatus);
router.post('/bulk-submit', requirePermission('seo:manage'), bulkSubmitForIndexing);

// PageSpeed
router.post('/pagespeed', requirePermission('seo:manage'), getPageSpeedInsights);

// Keywords
router.get('/keywords', requirePermission('seo:manage'), getKeywords);
router.post('/keywords', requirePermission('seo:manage'), trackKeyword);
router.delete('/keywords/:id', requirePermission('seo:manage'), deleteKeyword);
router.post('/keywords/sync', requirePermission('seo:manage'), syncKeywords);

// Search Analytics
router.post('/search-analytics', requirePermission('seo:manage'), getSearchAnalytics);

// Logs
router.get('/logs', requirePermission('seo:manage'), getSeoLogs);

// AI SEO (DeepSeek)
router.post('/ai/analyze/:postId', requirePermission('seo:manage'), aiAnalyzePost);
router.post('/ai/suggest-titles/:postId', requirePermission('seo:manage'), suggestTitles);
router.post('/ai/generate-meta/:postId', requirePermission('seo:manage'), generateMetaDescription);
router.post('/ai/suggest-keywords', requirePermission('seo:manage'), suggestKeywords);
router.post('/ai/generate-outline', requirePermission('seo:manage'), generateOutline);
router.post('/ai/improve-content', requirePermission('seo:manage'), improveContent);

// Smart Meta & Real-time SEO
router.post('/ai/smart-meta', requirePermission('seo:manage'), generateSmartMeta);
router.post('/ai/realtime-score', requirePermission('seo:manage'), getRealtimeSeoScore);

// Internal Linking & Duplicate Check
router.post('/ai/suggest-links', requirePermission('seo:manage'), suggestInternalLinks);
router.post('/ai/check-duplicate', requirePermission('seo:manage'), checkDuplicateContent);

// Schema Generation
router.post('/ai/schema/:postId', requirePermission('seo:manage'), generateSchema);

// Image SEO
router.post('/ai/generate-alt', requirePermission('seo:manage'), generateImageAltText);

// Content Optimizer
router.post('/ai/optimize-content', requirePermission('seo:manage'), optimizeContent);

// Scheduler & Reports
router.get('/scheduler/status', requirePermission('seo:manage'), getSchedulerStatus);
router.get('/scheduler/report', requirePermission('seo:manage'), getLastReport);
router.post('/scheduler/report', requirePermission('seo:manage'), generateReport);
router.post('/scheduler/trigger/daily', requirePermission('seo:manage'), triggerDailyTasks);
router.post('/scheduler/trigger/weekly', requirePermission('seo:manage'), triggerWeeklyTasks);
router.post('/scheduler/trigger/monthly', requirePermission('seo:manage'), triggerMonthlyTasks);

export default router;
