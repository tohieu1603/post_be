import { Router, Request, Response } from 'express';
import {
  BLOCK_TEMPLATES,
  TOTAL_TEMPLATES,
  getTemplatesByCategory,
  getTemplateCategories,
  searchTemplates,
} from '../utils/block-templates';

const router = Router();

// GET /api/block-templates — list all or filter by category/search
router.get('/', (req: Request, res: Response) => {
  const { category, search, page = '1', limit = '20' } = req.query;

  let results = BLOCK_TEMPLATES;

  if (search && typeof search === 'string') {
    results = searchTemplates(search);
  } else if (category && typeof category === 'string') {
    results = getTemplatesByCategory(category);
  }

  // Pagination
  const p = Math.max(1, parseInt(page as string));
  const l = Math.min(100, Math.max(1, parseInt(limit as string)));
  const total = results.length;
  const paginated = results.slice((p - 1) * l, p * l);

  res.json({
    data: paginated,
    pagination: { total, page: p, limit: l, totalPages: Math.ceil(total / l) },
  });
});

// GET /api/block-templates/categories — list all categories
router.get('/categories', (_req: Request, res: Response) => {
  const categories = getTemplateCategories();
  res.json({ data: categories, total: categories.length });
});

// GET /api/block-templates/stats — total count per category
router.get('/stats', (_req: Request, res: Response) => {
  const categories = getTemplateCategories();
  const stats = categories.map(cat => ({
    category: cat,
    count: getTemplatesByCategory(cat).length,
  }));
  res.json({ total: TOTAL_TEMPLATES, categories: stats });
});

// GET /api/block-templates/:id — get single template by id
router.get('/:id', (req: Request, res: Response) => {
  const template = BLOCK_TEMPLATES.find(t => t.id === req.params.id);
  if (!template) return res.status(404).json({ error: 'Template not found' });
  res.json(template);
});

export default router;
