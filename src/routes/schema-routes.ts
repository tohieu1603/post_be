import { Router } from 'express';
import { listTables, getTableDetail, executeQuery } from '../controllers/schema-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/rbac.middleware';

const router = Router();

/**
 * Schema & Query Routes
 * All routes require authentication and admin role
 */

// GET /api/schema/tables - List all collections
router.get('/tables', requireAuth, requireRole('admin'), listTables);

// GET /api/schema/tables/:table_name - Get collection detail
router.get('/tables/:table_name', requireAuth, requireRole('admin'), getTableDetail);

// POST /api/query/execute - Execute a query
router.post('/query/execute', requireAuth, requireRole('admin'), executeQuery);

export default router;
