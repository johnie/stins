import { INTERNAL_SERVER_ERROR } from "../../constants/http-status-codes.js";
import type { ErrorHandlerOptions, MiddlewareResponse } from "../types";

/**
 * Creates a standardized error response
 *
 * @param error - The error to create a response for
 * @param options - Optional configuration for error handling
 * @returns A framework-agnostic error response object
 *
 * @example
 * ```ts
 * const response = createErrorResponse(new Error("Something failed"));
 * // { status: 500, body: { message: "Something failed" } }
 *
 * const response = createErrorResponse(new Error("Oops"), { includeStack: true });
 * // { status: 500, body: { message: "Oops", stack: "Error: Oops\n at ..." } }
 * ```
 */
export function createErrorResponse(
  error: unknown,
  options: ErrorHandlerOptions = {}
): MiddlewareResponse {
  const isDevelopment = process.env.NODE_ENV !== "production";
  const {
    includeStack = isDevelopment,
    defaultStatus = INTERNAL_SERVER_ERROR,
  } = options;

  const isError = error instanceof Error;
  const message = isError ? error.message : "Internal Server Error";
  const stack = isError && includeStack ? error.stack : undefined;

  return {
    status: defaultStatus,
    body: {
      message,
      ...(stack && { stack }),
    },
  };
}
