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
 * Elysia Context type (minimal interface)
 */
interface ElysiaContext {
  path: string;
  set: {
    status?: number;
  };
}

/**
 * Creates an Elysia-compatible 404 not found handler
 *
 * @returns An Elysia handler function
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { notFound } from "stins/middleware/elysia";
 *
 * const app = new Elysia()
 *   .onError(({ code, path, set }) => {
 *     if (code === "NOT_FOUND") {
 *       return notFound()({ path, set });
 *     }
 *   });
 * ```
 */
export function notFound(): (ctx: ElysiaContext) => MiddlewareResponse["body"] {
  return (ctx: ElysiaContext): MiddlewareResponse["body"] => {
    const response = createNotFoundResponse(ctx.path);
    ctx.set.status = response.status;
    return response.body;
  };
}

/**
 * Creates an Elysia-compatible error handler
 *
 * @param options - Optional error handling configuration
 * @returns An Elysia error handler function
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { onError } from "stins/middleware/elysia";
 *
 * const app = new Elysia()
 *   .onError(({ error, set }) => {
 *     return onError()({ error, set });
 *   });
 * ```
 */
export function onError(
  options: ErrorHandlerOptions = {}
): (ctx: {
  error: Error;
  set: ElysiaContext["set"];
}) => MiddlewareResponse["body"] {
  return (ctx: {
    error: Error;
    set: ElysiaContext["set"];
  }): MiddlewareResponse["body"] => {
    const response = createErrorResponse(ctx.error, options);
    ctx.set.status = response.status;
    return response.body;
  };
}

/**
 * Validates data and returns either the validated data or an error response
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Validation result
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { validateBody } from "stins/middleware/elysia";
 *
 * const app = new Elysia()
 *   .post("/users", async ({ body, set }) => {
 *     const result = await validateBody(userSchema, body);
 *     if (!result.success) {
 *       set.status = result.status;
 *       return result.body;
 *     }
 *     // result.data is validated
 *   });
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
 * @returns Validation result
 *
 * @example
 * ```ts
 * import { Elysia } from "elysia";
 * import { validateBodySync } from "stins/middleware/elysia";
 *
 * const app = new Elysia()
 *   .post("/users", ({ body, set }) => {
 *     const result = validateBodySync(userSchema, body);
 *     if (!result.success) {
 *       set.status = result.status;
 *       return result.body;
 *     }
 *     // result.data is validated
 *   });
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
