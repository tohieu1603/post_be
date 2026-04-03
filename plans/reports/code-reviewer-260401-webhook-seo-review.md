# Code Review Summary

## Scope
- Files reviewed: 10 backend files (webhook middleware/service/controller/routes, post/author models, indexnow service, public-seo-routes, seo.util, index.ts)
- Lines analyzed: ~1,800
- Review focus: Security, field mapping bugs, JSON-LD correctness, error handling

---

## Overall Assessment
Code is well-structured and functionally correct per test evidence. No critical security vulnerabilities. Three high-priority bugs found.

---

## Critical Issues
None.

---

## High Priority Findings

### 1. Timing-attack leak via length comparison before `timingSafeEqual`
**File:** `middleware/webhook-auth.middleware.ts` lines 39–41

```ts
if (
  providedBuf.length !== expectedBuf.length ||   // ← leaks key length
  !crypto.timingSafeEqual(providedBuf, expectedBuf)
```

The short-circuit `length` check leaks whether the submitted key has the correct byte length — defeating the purpose of `timingSafeEqual`.

**Fix:** Pad/hash both sides to a fixed length before comparing:
```ts
const h = (s: string) => crypto.createHash('sha256').update(s).digest();
if (!crypto.timingSafeEqual(h(providedKey), h(expectedKey))) { ... }
```

---

### 2. Translation post inherits primary post's FAQ — does not use `trans.extras`
**File:** `services/webhook.service.ts` line 319

```ts
faq: article.extras?.faq || null,   // ← uses PRIMARY article's FAQ, not translation's
```

`WebhookTranslation` interface has no `faq`/`extras` fields, so translations always get the primary language's FAQ even when the translated FAQ should differ. Either add `faq` to `WebhookTranslation` and map it, or document this as intentional.

---

### 3. `inLanguage` hardcoded to `'vi-VN'` in Article/NewsArticle schemas
**File:** `utils/seo.util.ts` lines 198, 291

```ts
inLanguage: 'vi-VN',
```

English posts (`language: 'en'`) will emit incorrect `inLanguage: 'vi-VN'` in their JSON-LD, which is a schema.org correctness violation and may affect Google's language-based serving.

**Fix:** Pass `post.language` (or a derived BCP-47 tag) into both `generateNewsArticleSchema` and `generateArticleSchema` and use it instead of the literal.

---

## Medium Priority Improvements

### 4. `syncCategories` reports `synced: categories.length` not actual upsert count
**File:** `services/webhook.service.ts` line 529

Malformed entries are silently skipped (line 525) but still counted in the response `{ synced: categories.length }`. Response is misleading for partially-invalid payloads. Maintain a counter of actually-processed entries.

### 5. News sitemap fetches all posts then filters in memory
**File:** `routes/public-seo-routes.ts` lines 437–444

`findAllWithFilters({ status: 'published', limit: 1000 })` loads up to 1,000 posts then filters to last-48h in JS. At scale this is wasteful. Push the date filter to the DB query.

### 6. In-memory module-level sitemap/RSS cache
**File:** `routes/public-seo-routes.ts` lines 30–33

Module-level variables (`sitemapCache`, `rssFeedCache`, etc.) are not shared across multiple Node processes (PM2 cluster, k8s replicas). Acceptable for now but will silently serve stale data in multi-instance deployments. Document the limitation or use Redis.

---

## Positive Observations
- Webhook auth design is solid: `CMS_API_KEY` absence fails closed (401), no key disclosed in error messages.
- Rate limiters are correctly split: 100 req/min for single-article, 10 req/min for batch/sync — appropriate tiering.
- Batch processing uses per-article error collection (no abort-on-first-error) — correct for bulk ingestion.
- `externalId` sparse unique index prevents duplicates without penalizing null rows.
- `upsertCategory`/`upsertAuthor` are idempotent — correct for replay-safe webhooks.
- `generateFaqSchema`, `generateClaimReviewSchema`, `generateLiveBlogSchema` are structurally correct per schema.org spec.
- `escapeXmlLocal` in RSS is complete (covers all five XML special chars including `'`).
- `/:key.txt` IndexNow route correctly 404s on key mismatch — no oracle.

---

## Recommended Actions
1. **[Security]** Fix timing-safe comparison: hash both buffers before `timingSafeEqual` (issue #1).
2. **[Bug]** Fix `inLanguage` to use `post.language` mapped to BCP-47 (issue #3) — affects all EN posts' JSON-LD today.
3. **[Bug/Design]** Clarify/fix translation FAQ mapping (issue #2) — decide if translation inherits primary FAQ or needs its own field.
4. **[Low]** Fix `synced` count in `syncCategories`/`syncAuthors` to reflect actual processed count.
5. **[Low]** Add `publishedAt: { $gte: cutoff }` to news sitemap DB query to avoid memory filtering.

---

## Metrics
- Type Coverage: Good — all new interfaces typed; `Record<string, any>` used only for dynamic post construction (acceptable).
- Linting Issues: 0 structural issues found.
- Test Coverage: Smoke-tested per verification evidence; no unit tests for webhook service/schemas.

---

## Unresolved Questions
- Should `WebhookTranslation` support its own `faq`/`extras`? (determines fix for issue #2)
- Is multi-instance deployment planned? (determines urgency of cache issue #6)
