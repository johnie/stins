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
  ValidationOptions,
} from "../types";

/**
 * Hono Context type (minimal interface)
 */
interface HonoContext {
  req: {
    path: string;
  };
  json: (data: unknown, status?: number) => Response;
}

/**
 * Creates a Hono-compatible 404 not found handler
 *
 * @returns A Hono not found handler function
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { notFound } from "stins/middleware/hono";
 *
 * const app = new Hono();
 * app.notFound(notFound());
 * ```
 */
export function notFound(): (c: HonoContext) => Response {
  return (c: HonoContext): Response => {
    const response = createNotFoundResponse(c.req.path);
    return c.json(response.body, response.status);
  };
}

/**
 * Creates a Hono-compatible error handler
 *
 * @param options - Optional error handling configuration
 * @returns A Hono error handler function
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { onError } from "stins/middleware/hono";
 *
 * const app = new Hono();
 * app.onError(onError());
 *
 * // With stack traces in development
 * app.onError(onError({ includeStack: true }));
 * ```
 */
export function onError(
  options: ErrorHandlerOptions = {}
): (error: Error, c: HonoContext) => Response {
  return (error: Error, c: HonoContext): Response => {
    const response = createErrorResponse(error, options);
    return c.json(response.body, response.status);
  };
}

/**
 * Creates a Hono validation hook for use with Hono's hook system
 *
 * @param schema - The Standard Schema to validate against
 * @param options - Optional validation configuration
 * @returns A validation hook function
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { validator } from "hono/validator";
 * import { validationHook } from "stins/middleware/hono";
 *
 * const app = new Hono();
 * app.post(
 *   "/users",
 *   validator("json", (value, c) => {
 *     const result = validationHookSync(userSchema)(value, c);
 *     if (result instanceof Response) return result;
 *     return result;
 *   }),
 *   (c) => { ... }
 * );
 * ```
 */
export function validationHook<T extends AnySchema>(
  schema: T,
  options: ValidationOptions = {}
): (
  value: unknown,
  c: HonoContext
) => Promise<StandardSchemaV1.InferOutput<T> | Response> {
  return async (
    value: unknown,
    c: HonoContext
  ): Promise<StandardSchemaV1.InferOutput<T> | Response> => {
    const result = await validateRequest(schema, value, options);
    if (!result.success) {
      return c.json(result.body, result.status);
    }
    return result.data;
  };
}

/**
 * Creates a synchronous Hono validation hook
 *
 * @param schema - The Standard Schema to validate against
 * @param options - Optional validation configuration
 * @returns A synchronous validation hook function
 *
 * @example
 * ```ts
 * import { Hono } from "hono";
 * import { validator } from "hono/validator";
 * import { validationHookSync } from "stins/middleware/hono";
 *
 * const app = new Hono();
 * app.post(
 *   "/users",
 *   validator("json", validationHookSync(userSchema)),
 *   (c) => { ... }
 * );
 * ```
 */
export function validationHookSync<T extends AnySchema>(
  schema: T,
  options: ValidationOptions = {}
): (
  value: unknown,
  c: HonoContext
) => StandardSchemaV1.InferOutput<T> | Response {
  return (
    value: unknown,
    c: HonoContext
  ): StandardSchemaV1.InferOutput<T> | Response => {
    const result = validateRequestSync(schema, value, options);
    if (!result.success) {
      return c.json(result.body, result.status);
    }
    return result.data;
  };
}
