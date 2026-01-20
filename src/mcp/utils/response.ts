/**
 * Response utilities for MCP tools
 */

export interface ToolResponse {
  success: boolean;
  data?: unknown;
  message?: string;
  error?: string;
}

/**
 * Format successful response for MCP
 */
export function successResponse(data: unknown, message?: string): { content: Array<{ type: 'text'; text: string }> } {
  const response: ToolResponse = {
    success: true,
    data,
    ...(message && { message }),
  };

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
  };
}

/**
 * Format error response for MCP
 */
export function errorResponse(error: unknown): { content: Array<{ type: 'text'; text: string }> } {
  const message = error instanceof Error ? error.message : String(error);

  const response: ToolResponse = {
    success: false,
    error: message,
  };

  return {
    content: [
      {
        type: 'text' as const,
        text: JSON.stringify(response, null, 2),
      },
    ],
  };
}
