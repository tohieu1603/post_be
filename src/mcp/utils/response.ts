/**
 * MCP Response Utilities
 *
 * Helper functions for formatting MCP tool responses
 */

/**
 * Create a success response for MCP tools
 */
export function successResponse(
  data: unknown,
  message?: string
): { content: Array<{ type: 'text'; text: string }> } {
  const response = {
    success: true,
    message: message || 'Thành công',
    data,
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
 * Create an error response for MCP tools
 */
export function errorResponse(
  error: unknown
): { content: Array<{ type: 'text'; text: string }> } {
  const errorMessage = error instanceof Error ? error.message : 'Đã xảy ra lỗi không xác định';

  const response = {
    success: false,
    error: errorMessage,
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
