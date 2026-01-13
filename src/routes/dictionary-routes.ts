import { Router } from 'express';
import { dictionaryController } from '../controllers/dictionary-controller';
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, isValidObjectId, searchValidation, paginationValidation } from '../middleware/validation.middleware';
import { body, query, param } from 'express-validator';

const router = Router();

// ============================================
// DICTIONARY VALIDATION RULES
// ============================================

const dictionaryValidation = {
  create: [
    body('term')
      .trim()
      .notEmpty()
      .withMessage('Term is required')
      .isLength({ min: 1, max: 255 })
      .withMessage('Term must be between 1 and 255 characters'),
    body('definition')
      .trim()
      .notEmpty()
      .withMessage('Definition is required')
      .isLength({ min: 1, max: 1000 })
      .withMessage('Definition must be between 1 and 1000 characters'),
    body('slug')
      .optional({ nullable: true })
      .trim()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('description')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 50000 })
      .withMessage('Description must not exceed 50000 characters'),
    body('pronunciation')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage('Pronunciation must not exceed 255 characters'),
    body('partOfSpeech')
      .optional({ nullable: true })
      .isIn(['noun', 'verb', 'adjective', 'adverb', 'phrase', 'abbreviation', 'acronym', 'other'])
      .withMessage('Invalid part of speech'),
    body('synonyms')
      .optional()
      .isArray()
      .withMessage('Synonyms must be an array'),
    body('synonyms.*')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 255 }),
    body('antonyms')
      .optional()
      .isArray()
      .withMessage('Antonyms must be an array'),
    body('antonyms.*')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 255 }),
    body('relatedTermIds')
      .optional()
      .isArray()
      .withMessage('Related term IDs must be an array'),
    body('relatedTermIds.*')
      .optional()
      .isMongoId()
      .withMessage('Related term ID must be a valid ID'),
    body('examples')
      .optional()
      .isArray()
      .withMessage('Examples must be an array'),
    body('examples.*')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 1000 }),
    body('etymology')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 2000 })
      .withMessage('Etymology must not exceed 2000 characters'),
    body('categoryId')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === '' || value === 'null') return true;
        if (!/^[a-f\d]{24}$/i.test(value)) {
          throw new Error('categoryId must be a valid ID or null');
        }
        return true;
      }),
    body('tags')
      .optional()
      .isArray()
      .withMessage('Tags must be an array'),
    body('tags.*')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 100 }),
    body('source')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 500 })
      .withMessage('Source must not exceed 500 characters'),
    body('imageUrl')
      .optional({ nullable: true })
      .trim()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Image URL must be a valid URL'),
    body('audioUrl')
      .optional({ nullable: true })
      .trim()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Audio URL must be a valid URL'),
    body('videoUrl')
      .optional({ nullable: true })
      .trim()
      .isURL({ protocols: ['http', 'https'], require_protocol: true })
      .withMessage('Video URL must be a valid URL'),
    body('isActive')
      .optional()
      .isBoolean()
      .withMessage('isActive must be a boolean'),
    body('isFeatured')
      .optional()
      .isBoolean()
      .withMessage('isFeatured must be a boolean'),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 })
      .withMessage('sortOrder must be a non-negative integer'),
    body('seo')
      .optional()
      .isObject()
      .withMessage('SEO must be an object'),
    body('seo.metaTitle')
      .optional()
      .trim()
      .isLength({ max: 70 })
      .withMessage('Meta title must not exceed 70 characters'),
    body('seo.metaDescription')
      .optional()
      .trim()
      .isLength({ max: 160 })
      .withMessage('Meta description must not exceed 160 characters'),
    body('seo.keywords')
      .optional()
      .isArray()
      .withMessage('Keywords must be an array'),
  ],
  update: [
    body('term')
      .optional()
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('Term must be between 1 and 255 characters'),
    body('definition')
      .optional()
      .trim()
      .isLength({ min: 1, max: 1000 })
      .withMessage('Definition must be between 1 and 1000 characters'),
    body('slug')
      .optional({ nullable: true })
      .trim()
      .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
      .withMessage('Slug must contain only lowercase letters, numbers, and hyphens'),
    body('description')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 50000 })
      .withMessage('Description must not exceed 50000 characters'),
    body('pronunciation')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 255 })
      .withMessage('Pronunciation must not exceed 255 characters'),
    body('partOfSpeech')
      .optional({ nullable: true })
      .isIn(['noun', 'verb', 'adjective', 'adverb', 'phrase', 'abbreviation', 'acronym', 'other'])
      .withMessage('Invalid part of speech'),
    body('synonyms')
      .optional()
      .isArray()
      .withMessage('Synonyms must be an array'),
    body('antonyms')
      .optional()
      .isArray()
      .withMessage('Antonyms must be an array'),
    body('relatedTermIds')
      .optional()
      .isArray()
      .withMessage('Related term IDs must be an array'),
    body('examples')
      .optional()
      .isArray()
      .withMessage('Examples must be an array'),
    body('etymology')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 2000 }),
    body('categoryId')
      .optional({ nullable: true })
      .custom((value) => {
        if (value === null || value === '' || value === 'null') return true;
        if (!/^[a-f\d]{24}$/i.test(value)) {
          throw new Error('categoryId must be a valid ID or null');
        }
        return true;
      }),
    body('tags')
      .optional()
      .isArray(),
    body('source')
      .optional({ nullable: true })
      .trim()
      .isLength({ max: 500 }),
    body('imageUrl')
      .optional({ nullable: true })
      .trim(),
    body('audioUrl')
      .optional({ nullable: true })
      .trim(),
    body('videoUrl')
      .optional({ nullable: true })
      .trim(),
    body('isActive')
      .optional()
      .isBoolean(),
    body('isFeatured')
      .optional()
      .isBoolean(),
    body('sortOrder')
      .optional()
      .isInt({ min: 0 }),
    body('seo')
      .optional()
      .isObject(),
  ],
  filter: [
    query('search')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 200 })
      .withMessage('Search query must not exceed 200 characters'),
    query('letter')
      .optional()
      .isString()
      .trim()
      .isLength({ min: 1, max: 1 })
      .withMessage('Letter must be a single character'),
    query('categoryId')
      .optional()
      .isMongoId()
      .withMessage('categoryId must be a valid ID'),
    query('tags')
      .optional()
      .isString()
      .withMessage('Tags must be comma-separated string'),
    query('partOfSpeech')
      .optional()
      .isIn(['noun', 'verb', 'adjective', 'adverb', 'phrase', 'abbreviation', 'acronym', 'other'])
      .withMessage('Invalid part of speech'),
    query('isActive')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('isActive must be true or false'),
    query('isFeatured')
      .optional()
      .isIn(['true', 'false'])
      .withMessage('isFeatured must be true or false'),
    ...paginationValidation,
  ],
  bulkImport: [
    body('terms')
      .isArray({ min: 1, max: 100 })
      .withMessage('Terms must be an array with 1-100 items'),
    body('terms.*.term')
      .trim()
      .notEmpty()
      .withMessage('Each term must have a term field'),
    body('terms.*.definition')
      .trim()
      .notEmpty()
      .withMessage('Each term must have a definition field'),
  ],
};

// ============================================
// PUBLIC ROUTES (No authentication required)
// ============================================

/**
 * @swagger
 * /api/dictionary:
 *   get:
 *     summary: Get all dictionary terms with pagination
 *     tags: [Dictionary]
 */
router.get('/', validate(dictionaryValidation.filter), dictionaryController.getAll);

/**
 * @swagger
 * /dictionary/alphabet:
 *   get:
 *     summary: Get alphabet index with term counts
 *     tags: [Dictionary]
 */
router.get('/alphabet', dictionaryController.getAlphabetIndex);

/**
 * @swagger
 * /dictionary/featured:
 *   get:
 *     summary: Get featured terms
 *     tags: [Dictionary]
 */
router.get('/featured', dictionaryController.getFeatured);

/**
 * @swagger
 * /dictionary/popular:
 *   get:
 *     summary: Get popular terms (most viewed)
 *     tags: [Dictionary]
 */
router.get('/popular', dictionaryController.getPopular);

/**
 * @swagger
 * /dictionary/recent:
 *   get:
 *     summary: Get recently added terms
 *     tags: [Dictionary]
 */
router.get('/recent', dictionaryController.getRecent);

/**
 * @swagger
 * /dictionary/random:
 *   get:
 *     summary: Get random terms (word of the day)
 *     tags: [Dictionary]
 */
router.get('/random', dictionaryController.getRandom);

/**
 * @swagger
 * /dictionary/suggestions:
 *   get:
 *     summary: Get search suggestions (autocomplete)
 *     tags: [Dictionary]
 */
router.get('/suggestions', dictionaryController.getSuggestions);

/**
 * @swagger
 * /api/dictionary/letter/{letter}:
 *   get:
 *     summary: Get terms by first letter (A, B, C...)
 *     tags: [Dictionary]
 *     parameters:
 *       - in: path
 *         name: letter
 *         required: true
 *         schema:
 *           type: string
 *         description: First letter to filter (A, B, C...)
 *         example: A
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 100
 */
router.get('/letter/:letter', dictionaryController.getByLetter);

/**
 * @swagger
 * /dictionary/category/{categoryId}:
 *   get:
 *     summary: Get terms by category
 *     tags: [Dictionary]
 */
router.get('/category/:categoryId', isValidObjectId('categoryId'), dictionaryController.getByCategory);

/**
 * @swagger
 * /dictionary/slug/{slug}:
 *   get:
 *     summary: Get term by slug (public view - increments view count)
 *     tags: [Dictionary]
 */
router.get('/slug/:slug', dictionaryController.getBySlug);

// ============================================
// AUTHENTICATED ROUTES
// ============================================

/**
 * @swagger
 * /dictionary/statistics:
 *   get:
 *     summary: Get dictionary statistics
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.get('/statistics', requireAuth, requirePermission('dictionary:view'), dictionaryController.getStatistics);

/**
 * @swagger
 * /dictionary/{id}:
 *   get:
 *     summary: Get term by ID
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', requireAuth, requirePermission('dictionary:view'), isValidObjectId('id'), dictionaryController.getById);

/**
 * @swagger
 * /api/dictionary:
 *   post:
 *     summary: Create new dictionary term
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', requireAuth, requirePermission('dictionary:create'), validate(dictionaryValidation.create), dictionaryController.create);

/**
 * @swagger
 * /dictionary/{id}:
 *   put:
 *     summary: Update dictionary term
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', requireAuth, requirePermission('dictionary:edit'), isValidObjectId('id'), validate(dictionaryValidation.update), dictionaryController.update);

/**
 * @swagger
 * /dictionary/{id}:
 *   delete:
 *     summary: Delete dictionary term
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', requireAuth, requirePermission('dictionary:delete'), isValidObjectId('id'), dictionaryController.delete);

/**
 * @swagger
 * /dictionary/{id}/toggle-active:
 *   patch:
 *     summary: Toggle term active status
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/toggle-active', requireAuth, requirePermission('dictionary:edit'), isValidObjectId('id'), dictionaryController.toggleActive);

/**
 * @swagger
 * /dictionary/{id}/toggle-featured:
 *   patch:
 *     summary: Toggle term featured status
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/toggle-featured', requireAuth, requirePermission('dictionary:edit'), isValidObjectId('id'), dictionaryController.toggleFeatured);

/**
 * @swagger
 * /dictionary/{id}/view:
 *   post:
 *     summary: Track view for a term
 *     tags: [Dictionary]
 */
router.post('/:id/view', isValidObjectId('id'), dictionaryController.trackView);

/**
 * @swagger
 * /dictionary/bulk-import:
 *   post:
 *     summary: Bulk import dictionary terms
 *     tags: [Dictionary]
 *     security:
 *       - bearerAuth: []
 */
router.post('/bulk-import', requireAuth, requirePermission('dictionary:create'), validate(dictionaryValidation.bulkImport), dictionaryController.bulkImport);

export default router;
