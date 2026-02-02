import type { StandardSchemaV1 } from "@standard-schema/spec";
import type { FormattedIssue } from "@/validation";

/**
 * Standard response body for middleware responses
 */
export interface MiddlewareResponseBody {
  message: string;
  errors?: FormattedIssue[];
  stack?: string;
}

/**
 * Framework-agnostic response structure
 */
export interface MiddlewareResponse {
  status: number;
  body: MiddlewareResponseBody;
}

/**
 * Options for error handling
 */
export interface ErrorHandlerOptions {
  /**
   * Whether to include stack traces in error responses
   * @default false in production, true in development
   */
  includeStack?: boolean;
  /**
   * Custom status code for errors (defaults to 500)
   */
  defaultStatus?: number;
}

/**
 * Options for validation middleware
 */
export interface ValidationOptions {
  /**
   * HTTP status code for validation errors
   * @default 400
   */
  status?: number;
}

/**
 * Successful validation result
 */
export interface ValidationResponseSuccess<T> {
  success: true;
  data: T;
}

/**
 * Failed validation result with prepared response
 */
export interface ValidationResponseFailure {
  success: false;
  status: number;
  body: MiddlewareResponseBody;
}

/**
 * Result from validateRequest - either success with data or failure with response
 */
export type ValidationResponse<T> =
  | ValidationResponseSuccess<T>
  | ValidationResponseFailure;

/**
 * Schema type for validation (Standard Schema)
 */
export type AnySchema = StandardSchemaV1<unknown, unknown>;
