import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
  createErrorResponse,
  createNotFoundResponse,
  validateRequest,
  validateRequestSync,
} from "../core";
import type {
  AnySchema,
  ErrorHandlerOptions,
  MiddlewareResponse,
  ValidationOptions,
} from "../types";

/**
 * H3 Event type (minimal interface)
 */
interface H3Event {
  path: string;
}

/**
 * Creates an H3-compatible 404 not found handler
 *
 * @returns An H3 handler function that returns a not found response
 *
 * @example
 * ```ts
 * import { createApp, eventHandler } from "h3";
 * import { notFound } from "stins/middleware/h3";
 *
 * const app = createApp();
 * // Use with createError for proper H3 error handling
 * app.use(eventHandler((event) => {
 *   const response = notFound()(event);
 *   throw createError({ statusCode: response.status, data: response.body });
 * }));
 * ```
 */
export function notFound(): (event: H3Event) => MiddlewareResponse {
  return (event: H3Event): MiddlewareResponse => {
    return createNotFoundResponse(event.path);
  };
}

/**
 * Creates an H3-compatible error handler
 *
 * @param options - Optional error handling configuration
 * @returns An H3 error handler function
 *
 * @example
 * ```ts
 * import { createApp, createError } from "h3";
 * import { onError } from "stins/middleware/h3";
 *
 * const app = createApp({
 *   onError: (error, event) => {
 *     const response = onError()(error);
 *     return response.body;
 *   }
 * });
 * ```
 */
export function onError(
  options: ErrorHandlerOptions = {}
): (error: Error) => MiddlewareResponse {
  return (error: Error): MiddlewareResponse => {
    return createErrorResponse(error, options);
  };
}

/**
 * Validates data and returns either the validated data or throws an H3 error
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate (typically from readBody)
 * @param options - Optional validation configuration
 * @returns The validated data
 * @throws Object with statusCode and data for H3's createError
 *
 * @example
 * ```ts
 * import { createApp, eventHandler, readBody, createError } from "h3";
 * import { validateBody } from "stins/middleware/h3";
 *
 * app.use("/users", eventHandler(async (event) => {
 *   const body = await readBody(event);
 *   const result = await validateBody(userSchema, body);
 *   if (!result.success) {
 *     throw createError({ statusCode: result.status, data: result.body });
 *   }
 *   // result.data is validated
 * }));
 * ```
 */
export async function validateBody<T extends AnySchema>(
  schema: T,
  data: unknown,
  options: ValidationOptions = {}
): Promise<
  | { success: true; data: StandardSchemaV1.InferOutput<T> }
  | { success: false; status: number; body: MiddlewareResponse["body"] }
> {
  return await validateRequest(schema, data, options);
}

/**
 * Synchronously validates data
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Validation result with data or error response
 *
 * @example
 * ```ts
 * import { eventHandler, readBody, createError } from "h3";
 * import { validateBodySync } from "stins/middleware/h3";
 *
 * eventHandler((event) => {
 *   const body = getQuery(event);
 *   const result = validateBodySync(querySchema, body);
 *   if (!result.success) {
 *     throw createError({ statusCode: result.status, data: result.body });
 *   }
 *   // result.data is validated
 * });
 * ```
 */
export function validateBodySync<T extends AnySchema>(
  schema: T,
  data: unknown,
  options: ValidationOptions = {}
):
  | { success: true; data: StandardSchemaV1.InferOutput<T> }
  | { success: false; status: number; body: MiddlewareResponse["body"] } {
  return validateRequestSync(schema, data, options);
}
