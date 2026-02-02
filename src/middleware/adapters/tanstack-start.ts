import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
  createErrorResponse,
  validateRequest,
  validateRequestSync,
} from "../core";
import type {
  AnySchema,
  ErrorHandlerOptions,
  MiddlewareResponseBody,
  ValidationOptions,
  ValidationResponse,
} from "../types";

/**
 * TanStack Start middleware context type
 */
interface MiddlewareContext<TContext = Record<string, unknown>> {
  next: <T extends Record<string, unknown>>(opts?: {
    context?: T;
  }) => Promise<{ context: TContext & T }>;
  context: TContext;
}

/**
 * TanStack Start middleware shape
 */
interface TanStackMiddleware<TInput = unknown, TOutput = unknown> {
  server: (ctx: MiddlewareContext<TInput>) => Promise<{ context: TOutput }>;
}

/**
 * Error thrown by TanStack Start middleware
 */
export class TanStackStartError extends Error {
  status: number;
  body: MiddlewareResponseBody;

  constructor(status: number, body: MiddlewareResponseBody) {
    super(body.message);
    this.name = "TanStackStartError";
    this.status = status;
    this.body = body;
  }
}

/**
 * Creates a TanStack Start validation middleware
 *
 * @param schema - The Standard Schema to validate against
 * @param options - Optional validation configuration
 * @returns A TanStack Start middleware object
 *
 * @example
 * ```ts
 * import { createMiddleware, createServerFn } from "@tanstack/react-start";
 * import { createValidationMiddleware } from "stins/middleware/tanstack-start";
 *
 * const validateUser = createValidationMiddleware(userSchema);
 *
 * const myServerFn = createServerFn({ method: "POST" })
 *   .middleware([validateUser])
 *   .handler(async ({ context }) => {
 *     // context.validatedData is typed as the schema output
 *     return { user: context.validatedData };
 *   });
 * ```
 */
export function createValidationMiddleware<T extends AnySchema>(
  schema: T,
  options: ValidationOptions = {}
): TanStackMiddleware<
  { data?: unknown; input?: unknown },
  { validatedData: StandardSchemaV1.InferOutput<T> }
> {
  return {
    server: async ({ next, context }) => {
      const data = context.data ?? context.input;
      const result = await validateRequest(schema, data, options);
      if (!result.success) {
        throw new TanStackStartError(result.status, result.body);
      }
      return next({ context: { validatedData: result.data } });
    },
  };
}

/**
 * Creates a TanStack Start error handling middleware
 *
 * @param options - Optional error handling configuration
 * @returns A TanStack Start middleware object
 *
 * @example
 * ```ts
 * import { createServerFn } from "@tanstack/react-start";
 * import { createErrorMiddleware } from "stins/middleware/tanstack-start";
 *
 * const errorHandler = createErrorMiddleware({ includeStack: true });
 *
 * const myServerFn = createServerFn({ method: "POST" })
 *   .middleware([errorHandler])
 *   .handler(async () => {
 *     // Errors will be caught and formatted
 *   });
 * ```
 */
export function createErrorMiddleware(
  options: ErrorHandlerOptions = {}
): TanStackMiddleware {
  return {
    server: async ({ next }) => {
      try {
        return await next();
      } catch (error) {
        const response = createErrorResponse(error, options);
        throw new TanStackStartError(response.status, response.body);
      }
    },
  };
}

/**
 * Validates data against a Standard Schema (async)
 *
 * Use this for direct validation in handlers when you need more control
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Validation result with either data or prepared error response
 *
 * @example
 * ```ts
 * import { createServerFn } from "@tanstack/react-start";
 * import { validateBody } from "stins/middleware/tanstack-start";
 *
 * const myServerFn = createServerFn({ method: "POST" })
 *   .handler(async ({ data }) => {
 *     const result = await validateBody(userSchema, data);
 *     if (!result.success) {
 *       throw new TanStackStartError(result.status, result.body);
 *     }
 *     // result.data is typed
 *     return { user: result.data };
 *   });
 * ```
 */
export function validateBody<T extends AnySchema>(
  schema: T,
  data: unknown,
  options: ValidationOptions = {}
): Promise<ValidationResponse<StandardSchemaV1.InferOutput<T>>> {
  return validateRequest(schema, data, options);
}

/**
 * Validates data against a Standard Schema (sync)
 *
 * Use this for direct validation in handlers with synchronous schemas
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Validation result with either data or prepared error response
 * @throws If the schema validation is asynchronous
 *
 * @example
 * ```ts
 * import { createServerFn } from "@tanstack/react-start";
 * import { validateBodySync } from "stins/middleware/tanstack-start";
 *
 * const myServerFn = createServerFn({ method: "POST" })
 *   .handler(async ({ data }) => {
 *     const result = validateBodySync(userSchema, data);
 *     if (!result.success) {
 *       throw new TanStackStartError(result.status, result.body);
 *     }
 *     return { user: result.data };
 *   });
 * ```
 */
export function validateBodySync<T extends AnySchema>(
  schema: T,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResponse<StandardSchemaV1.InferOutput<T>> {
  return validateRequestSync(schema, data, options);
}
