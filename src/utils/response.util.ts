import { Response } from 'express';
import { ApiResponse, PaginatedResponse } from '../types';

/**
 * Response utility - Standardized API responses
 */

export function successResponse<T>(res: Response, data: T, message?: string, statusCode = 200): Response {
  const response: ApiResponse<T> = {
    success: true,
    data,
    message,
  };
  return res.status(statusCode).json(response);
}

export function errorResponse(res: Response, error: string, statusCode = 400): Response {
  const response: ApiResponse = {
    success: false,
    error,
  };
  return res.status(statusCode).json(response);
}

export function notFoundResponse(res: Response, entity = 'Resource'): Response {
  return errorResponse(res, `${entity} not found`, 404);
}

export function validationErrorResponse(res: Response, errors: string[]): Response {
  const response: ApiResponse = {
    success: false,
    error: 'Validation failed',
    data: errors,
  };
  return res.status(422).json(response);
}

export function paginatedResponse<T>(
  res: Response,
  data: T[],
  total: number,
  page: number,
  limit: number
): Response {
  const response: PaginatedResponse<T> = {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
  return res.status(200).json(response);
}

export function createdResponse<T>(res: Response, data: T, message = 'Created successfully'): Response {
  return successResponse(res, data, message, 201);
}

export function noContentResponse(res: Response): Response {
  return res.status(204).send();
}
