import { Router } from 'express';
import {
  getAllRedirects,
  getRedirectById,
  createRedirect,
  updateRedirect,
  deleteRedirect,
  getRobotsTxt,
  updateRobotsTxt,
  getSitemapConfig,
  updateSitemapConfig,
} from '../controllers/seo-controller';

const router = Router();

// Redirects
router.get('/redirects', getAllRedirects);
router.get('/redirects/:id', getRedirectById);
router.post('/redirects', createRedirect);
router.put('/redirects/:id', updateRedirect);
router.delete('/redirects/:id', deleteRedirect);

// Robots.txt
router.get('/robots', getRobotsTxt);
router.put('/robots', updateRobotsTxt);

// Sitemap
router.get('/sitemap-config', getSitemapConfig);
router.put('/sitemap-config', updateSitemapConfig);

export default router;
