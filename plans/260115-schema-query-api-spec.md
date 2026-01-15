# Schema & Query API Specification

**Version:** 1.0
**Date:** 2026-01-15
**Base URL:** `http://localhost:5445/api`

---

## Overview

APIs cho phép introspection database schema và thực thi MongoDB queries với security constraints.

**Authentication:** Tất cả endpoints yêu cầu Bearer token với role `admin`.

```
Authorization: Bearer <JWT_TOKEN>
```

---

## 1. List Collections API

Lấy danh sách tất cả collections được phép truy cập.

### Endpoint

```
GET /api/schema/tables
```

### Response

```json
{
  "success": true,
  "data": {
    "tables": [
      {
        "name": "posts",
        "description": "News articles and blog posts",
        "row_count": 150
      },
      {
        "name": "categories",
        "description": "Article categories",
        "row_count": 12
      }
    ]
  }
}
```

### Allowed Collections

| Collection | Description |
|------------|-------------|
| posts | News articles and blog posts |
| categories | Article categories |
| tags | Article tags |
| authors | Content authors (E-E-A-T) |
| users | System users |
| media | Uploaded media files |
| banners | Banner advertisements |
| dictionaries | Dictionary terms |
| pagecontents | Static page content |
| settings | Application settings |
| redirects | SEO redirects |
| seoscores | SEO scores for posts |
| seologs | SEO operation logs |
| indexstatuses | Google index status |
| keywords | SEO keywords |
| activitylogs | User activity logs |
| analytics | Page analytics |

---

## 2. Get Collection Detail API

Lấy schema chi tiết của một collection.

### Endpoint

```
GET /api/schema/tables/:table_name
```

### Response

```json
{
  "success": true,
  "data": {
    "name": "posts",
    "columns": [
      {
        "name": "_id",
        "type": "OBJECTID",
        "primary_key": true,
        "nullable": false
      },
      {
        "name": "title",
        "type": "VARCHAR(200)",
        "primary_key": false,
        "nullable": false
      },
      {
        "name": "category_id",
        "type": "OBJECTID",
        "primary_key": false,
        "nullable": true,
        "foreign_key": "categories._id"
      }
    ],
    "relationships": [
      {
        "field": "category_id",
        "references": "categories",
        "type": "many_to_one"
      }
    ],
    "indexes": [
      {
        "name": "index_0",
        "fields": ["slug"]
      }
    ]
  }
}
```

---

## 3. Execute Query API

Thực thi MongoDB query với security constraints.

### Endpoint

```
POST /api/query/execute
```

### Request Body

```typescript
{
  collection: string;           // Required - Collection name
  operation?: QueryOperation;   // Optional - Default: 'find'
  filter?: object;              // Optional - MongoDB filter
  projection?: object;          // Optional - Fields to include/exclude
  sort?: object;                // Optional - Sort order
  limit?: number;               // Optional - Max 1000, default 100
  skip?: number;                // Optional - Pagination offset
  timeout?: number;             // Optional - Max 30 seconds
  keyword?: string;             // Optional - Auto-builds $regex filter
  pipeline?: object[];          // Required for 'aggregate' operation
  field?: string;               // Required for 'distinct' operation
}
```

### Supported Operations

| Operation | Description | Required Fields |
|-----------|-------------|-----------------|
| `find` | Find multiple documents | - |
| `find_one` | Find single document | - |
| `aggregate` | Aggregation pipeline | `pipeline` |
| `count` | Count documents | - |
| `distinct` | Get distinct values | `field` |

### Response

```json
{
  "success": true,
  "data": [...],
  "columns": ["_id", "title", "status"],
  "count": 10,
  "execution_time_ms": 15
}
```

---

## 4. Query Examples

### 4.1 Find with Filter

```json
{
  "collection": "posts",
  "operation": "find",
  "filter": { "status": "published" },
  "projection": { "title": 1, "slug": 1, "created_at": 1 },
  "sort": { "created_at": -1 },
  "limit": 20
}
```

### 4.2 Keyword Search

Auto-builds `$regex` filter trên các searchable fields.

```json
{
  "collection": "posts",
  "operation": "find",
  "keyword": "AI"
}
```

Equivalent to:
```json
{
  "filter": {
    "$or": [
      { "title": { "$regex": "AI", "$options": "i" } },
      { "content": { "$regex": "AI", "$options": "i" } },
      { "excerpt": { "$regex": "AI", "$options": "i" } },
      { "slug": { "$regex": "AI", "$options": "i" } }
    ]
  }
}
```

### 4.3 Aggregate - Count by Category

```json
{
  "collection": "posts",
  "operation": "aggregate",
  "pipeline": [
    { "$match": { "status": "published" } },
    { "$group": { "_id": "$category_id", "count": { "$sum": 1 } } },
    { "$sort": { "count": -1 } }
  ]
}
```

### 4.4 Count Documents

```json
{
  "collection": "posts",
  "operation": "count",
  "filter": { "status": "published" }
}
```

Response:
```json
{
  "success": true,
  "data": [{ "count": 150 }],
  "columns": ["count"],
  "count": 1
}
```

### 4.5 Distinct Values

```json
{
  "collection": "posts",
  "operation": "distinct",
  "field": "status"
}
```

Response:
```json
{
  "success": true,
  "data": [
    { "status": "draft" },
    { "status": "published" },
    { "status": "archived" }
  ],
  "columns": ["status"],
  "count": 3
}
```

### 4.6 Find One

```json
{
  "collection": "posts",
  "operation": "find_one",
  "filter": { "slug": "my-article" }
}
```

---

## 5. Security Constraints

### 5.1 Query Limits

| Constraint | Value |
|------------|-------|
| Max documents | 1000 |
| Default documents | 100 |
| Max timeout | 30 seconds |
| Default timeout | 30 seconds |

### 5.2 Blocked Filter Operators

Only these operators are allowed in filters:

| Allowed | Description |
|---------|-------------|
| `$eq` | Equal |
| `$ne` | Not equal |
| `$gt` | Greater than |
| `$gte` | Greater than or equal |
| `$lt` | Less than |
| `$lte` | Less than or equal |
| `$in` | In array |
| `$nin` | Not in array |
| `$exists` | Field exists |
| `$regex` | Regular expression |
| `$and` | Logical AND |
| `$or` | Logical OR |

**Blocked operators:** All others including `$where`, `$expr`, `$text`, etc.

### 5.3 Blocked Pipeline Stages

| Blocked Stage | Reason |
|---------------|--------|
| `$merge` | Write operation |
| `$out` | Write operation |

### 5.4 Blocked Operators in Pipeline

| Blocked Operator | Reason |
|------------------|--------|
| `$function` | Code execution |
| `$accumulator` | Code execution |
| `$where` | Code execution |

**Note:** These operators are blocked recursively - they cannot be nested inside other operators.

### 5.5 Collection Whitelist

Only collections listed in "Allowed Collections" section can be queried.

---

## 6. Searchable Fields by Collection

| Collection | Searchable Fields |
|------------|-------------------|
| posts | title, content, excerpt, slug |
| categories | name, slug, description |
| tags | name, slug |
| authors | name, bio, slug |
| users | email, name |
| media | title, alt_text, filename |
| banners | title, description |
| dictionaries | word, definition |
| pagecontents | title, content, slug |
| keywords | keyword |

---

## 7. Error Responses

### 400 Bad Request

```json
{
  "success": false,
  "error": "Collection name is required"
}
```

```json
{
  "success": false,
  "error": "Operation must be one of: find, find_one, aggregate, count, distinct"
}
```

```json
{
  "success": false,
  "error": "Operator '$where' not allowed"
}
```

### 403 Forbidden

```json
{
  "success": false,
  "error": "Collection 'system.users' not allowed"
}
```

```json
{
  "success": false,
  "error": "Pipeline stage '$merge' not allowed (write operation)"
}
```

### 401 Unauthorized

```json
{
  "success": false,
  "error": "Authentication required"
}
```

---

## 8. Service Account

### Token Info (365 days)

```
Email: seo-agent@system.internal
Role: admin
Expires: 2027-01-15
```

### Generate New Token

```bash
node scripts/generate-service-token.js
```

---

## 9. cURL Examples

### List Tables

```bash
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:5445/api/schema/tables
```

### Execute Query

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"collection":"posts","operation":"find","limit":10}' \
  http://localhost:5445/api/query/execute
```

### Keyword Search

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"collection":"posts","keyword":"AI"}' \
  http://localhost:5445/api/query/execute
```

### Aggregate

```bash
curl -X POST \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection":"posts",
    "operation":"aggregate",
    "pipeline":[
      {"$group":{"_id":"$status","count":{"$sum":1}}}
    ]
  }' \
  http://localhost:5445/api/query/execute
```

---

## 10. Implementation Files

| File | Description |
|------|-------------|
| `src/dtos/schema.dto.ts` | DTOs, constants, types |
| `src/services/schema.service.ts` | Business logic |
| `src/controllers/schema-controller.ts` | Request handlers |
| `src/routes/schema-routes.ts` | Route definitions |
| `scripts/generate-service-token.js` | Token generator |
