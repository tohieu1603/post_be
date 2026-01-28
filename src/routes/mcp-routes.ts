/**
 * MCP Routes - Tích hợp Model Context Protocol vào Express server
 *
 * Endpoint: /api/mcp
 * Cho phép AI agents kết nối và sử dụng tools qua HTTP
 */

import { Router, Request, Response } from 'express';
import { randomUUID } from 'crypto';
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

// Logging helper
const log = (message: string, data?: unknown) => {
  const timestamp = new Date().toISOString();
  console.log(`[MCP ${timestamp}] ${message}`, data ? JSON.stringify(data) : '');
};

// Create MCP Server instance
const mcpServer = new McpServer({
  name: 'managepost-mcp-server',
  version: '1.0.0',
});

log('MCP Server initialized', { tools: 20 });

// Register all tools (modular)
registerPostTools(mcpServer, postService);
registerCategoryTools(mcpServer, categoryService);
registerTagTools(mcpServer, tagService);
registerAuthorTools(mcpServer, authorService);

// Session management - store transports by session ID
interface SessionData {
  transport: StreamableHTTPServerTransport;
  createdAt: number;
  lastUsed: number;
}
const sessions = new Map<string, SessionData>();

// Session timeout (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Cleanup expired sessions every 5 minutes
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  for (const [sessionId, session] of sessions.entries()) {
    if (now - session.lastUsed > SESSION_TIMEOUT) {
      sessions.delete(sessionId);
      cleaned++;
    }
  }
  if (cleaned > 0) {
    log('Sessions cleaned', { cleaned, remaining: sessions.size });
  }
}, 5 * 60 * 1000);

// Tool list for documentation
const TOOL_LIST = [
  // Post (3)
  'get_posts', 'create_post', 'update_post_status',
  // Category (9)
  'get_categories', 'get_category_tree', 'get_category_dropdown',
  'get_category_by_id', 'get_category_by_slug', 'create_category',
  'update_category', 'delete_category', 'toggle_category_active',
  // Tag (3)
  'get_tags', 'create_tag', 'toggle_tag_active',
  // Author (5)
  'get_authors', 'get_author_by_id', 'create_author', 'update_author', 'toggle_author_featured',
];

/**
 * GET /api/mcp - Thông tin MCP server
 */
router.get('/', (req: Request, res: Response) => {
  const clientIp = req.ip || req.socket.remoteAddress;
  log('INFO request', { ip: clientIp, userAgent: req.headers['user-agent'] });

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
  const clientIp = req.ip || req.socket.remoteAddress;
  const startTime = Date.now();

  // Get existing session ID from header
  const existingSessionId = req.headers['mcp-session-id'] as string;

  log('REQUEST received', {
    ip: clientIp,
    existingSessionId: existingSessionId || 'none',
    activeSessions: sessions.size,
  });

  try {
    let transport: StreamableHTTPServerTransport;
    let sessionId: string;
    let isNewSession = false;

    if (existingSessionId && sessions.has(existingSessionId)) {
      // Reuse existing session
      const session = sessions.get(existingSessionId)!;
      transport = session.transport;
      sessionId = existingSessionId;
      session.lastUsed = Date.now();
      log('SESSION reused', { sessionId });
    } else {
      // Create new session
      sessionId = randomUUID();
      isNewSession = true;

      transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: () => sessionId,
      });

      // Store session
      sessions.set(sessionId, {
        transport,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });

      // Connect mcpServer with new transport
      await mcpServer.connect(transport);

      log('SESSION created', { sessionId, totalSessions: sessions.size });
    }

    // Handle the request
    await transport.handleRequest(req, res);

    const duration = Date.now() - startTime;
    log('REQUEST completed', { sessionId, duration: `${duration}ms`, isNewSession });
  } catch (error) {
    const duration = Date.now() - startTime;
    log('REQUEST failed', {
      duration: `${duration}ms`,
      error: error instanceof Error ? error.message : 'Unknown error',
    });

    res.status(500).json({
      jsonrpc: '2.0',
      error: {
        code: -32603,
        message: error instanceof Error ? error.message : 'Internal error',
      },
    });
  }
});

/**
 * DELETE /api/mcp - Close session
 */
router.delete('/', (req: Request, res: Response) => {
  const sessionId = req.headers['mcp-session-id'] as string;

  if (sessionId && sessions.has(sessionId)) {
    sessions.delete(sessionId);
    log('SESSION closed', { sessionId });
    res.status(200).json({ success: true, message: 'Session closed' });
  } else {
    res.status(404).json({ success: false, message: 'Session not found' });
  }
});

export default router;
