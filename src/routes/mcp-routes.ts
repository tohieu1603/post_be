/**
 * MCP Routes - Tích hợp Model Context Protocol vào Express server
 *
 * Endpoint: /api/mcp
 * Cho phép AI agents kết nối và sử dụng tools qua HTTP
 */

import { Router, Request, Response } from 'express';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';

// Import tool registration functions
import {
  registerPostTools,
  registerCategoryTools,
  registerTagTools,
  registerAuthorTools,
} from '../mcp/tools';

// Import services
import { postService } from '../services/post.service';
import { categoryService } from '../services/category.service';
import { TagService } from '../services/tag.service';
import { authorService } from '../services/author.service';

const router = Router();
const tagService = new TagService();

// Create MCP Server instance
const mcpServer = new McpServer({
  name: 'managepost-mcp-server',
  version: '1.0.0',
});

// Register all tools (modular)
registerPostTools(mcpServer, postService);
registerCategoryTools(mcpServer, categoryService);
registerTagTools(mcpServer, tagService);
registerAuthorTools(mcpServer, authorService);

// Tool list for documentation
const TOOL_LIST = [
  // Post (3)
  'get_posts', 'create_post', 'update_post_status',
  // Category (9)
  'get_categories', 'get_category_tree', 'get_category_dropdown',
  'get_category_by_id', 'get_category_by_slug', 'create_category',
  'update_category', 'delete_category', 'toggle_category_active',
  // Tag (2)
  'create_tag', 'toggle_tag_active',
  // Author (4)
  'get_author_by_id', 'create_author', 'update_author', 'toggle_author_featured',
];

/**
 * GET /api/mcp - Thông tin MCP server
 */
router.get('/', (_req: Request, res: Response) => {
  res.json({
    name: 'ManagePost MCP Server',
    version: '1.0.0',
    protocol: 'MCP 2025-11-25',
    endpoint: '/api/mcp',
    totalTools: TOOL_LIST.length,
    tools: TOOL_LIST,
    documentation: 'Kết nối agents qua HTTP POST đến /api/mcp với MCP protocol',
  });
});

/**
 * POST /api/mcp - MCP protocol endpoint
 */
router.post('/', async (req: Request, res: Response) => {
  try {
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => `session-${Date.now()}`,
    });

    await mcpServer.connect(transport);
    await transport.handleRequest(req, res);
  } catch (error) {
    console.error('[MCP] Error:', error);
    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
      },
    });
  }
});

export default router;
