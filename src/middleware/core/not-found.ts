import { NOT_FOUND } from "@/constants/http-status-codes";
import type { MiddlewareResponse } from "../types";

/**
 * Creates a standardized 404 Not Found response
 *
 * @param path - The path that was not found
 * @returns A framework-agnostic 404 response object
 *
 * @example
 * ```ts
 * const response = createNotFoundResponse("/api/users/123");
 * // { status: 404, body: { message: "Not Found: /api/users/123" } }
 * ```
 */
export function createNotFoundResponse(path: string): MiddlewareResponse {
  return {
    status: NOT_FOUND,
    body: {
      message: `Not Found: ${path}`,
    },
  };
}
