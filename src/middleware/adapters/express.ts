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
 * Express Request type (minimal interface)
 */
interface ExpressRequest {
  path: string;
  body?: unknown;
}

/**
 * Express Response type (minimal interface)
 */
interface ExpressResponse {
  status: (code: number) => ExpressResponse;
  json: (data: unknown) => void;
}

/**
 * Express Next function type
 */
type ExpressNextFunction = (error?: unknown) => void;

/**
 * Creates an Express-compatible 404 not found middleware
 *
 * @returns An Express middleware function
 *
 * @example
 * ```ts
 * import express from "express";
 * import { notFound } from "stins/middleware/express";
 *
 * const app = express();
 * // Add after all routes
 * app.use(notFound());
 * ```
 */
export function notFound(): (
  req: ExpressRequest,
  res: ExpressResponse
) => void {
  return (req: ExpressRequest, res: ExpressResponse): void => {
    const response = createNotFoundResponse(req.path);
    res.status(response.status).json(response.body);
  };
}

/**
 * Creates an Express-compatible error handler middleware
 *
 * @param options - Optional error handling configuration
 * @returns An Express error middleware function
 *
 * @example
 * ```ts
 * import express from "express";
 * import { onError } from "stins/middleware/express";
 *
 * const app = express();
 * // Add after all routes and middleware
 * app.use(onError());
 *
 * // With stack traces
 * app.use(onError({ includeStack: true }));
 * ```
 */
export function onError(
  options: ErrorHandlerOptions = {}
): (
  error: Error,
  req: ExpressRequest,
  res: ExpressResponse,
  _next: ExpressNextFunction
) => void {
  return (
    error: Error,
    _req: ExpressRequest,
    res: ExpressResponse,
    _next: ExpressNextFunction
  ): void => {
    const response = createErrorResponse(error, options);
    res.status(response.status).json(response.body);
  };
}

/**
 * Creates an Express validation middleware for request body
 *
 * @param schema - The Standard Schema to validate against
 * @param options - Optional validation configuration
 * @returns An Express middleware function
 *
 * @example
 * ```ts
 * import express from "express";
 * import { validateBody } from "stins/middleware/express";
 *
 * const app = express();
 * app.post("/users", validateBody(userSchema), (req, res) => {
 *   // req.body is validated
 * });
 * ```
 */
export function validateBody<T extends AnySchema>(
  schema: T,
  options: ValidationOptions = {}
): (
  req: ExpressRequest & { body: StandardSchemaV1.InferOutput<T> },
  res: ExpressResponse,
  next: ExpressNextFunction
) => Promise<void> {
  return async (
    req: ExpressRequest & { body: StandardSchemaV1.InferOutput<T> },
    res: ExpressResponse,
    next: ExpressNextFunction
  ): Promise<void> => {
    const result = await validateRequest(schema, req.body, options);
    if (!result.success) {
      res.status(result.status).json(result.body);
      return;
    }
    req.body = result.data;
    next();
  };
}

/**
 * Creates a synchronous Express validation middleware for request body
 *
 * @param schema - The Standard Schema to validate against
 * @param options - Optional validation configuration
 * @returns An Express middleware function
 *
 * @example
 * ```ts
 * import express from "express";
 * import { validateBodySync } from "stins/middleware/express";
 *
 * const app = express();
 * app.post("/users", validateBodySync(userSchema), (req, res) => {
 *   // req.body is validated
 * });
 * ```
 */
export function validateBodySync<T extends AnySchema>(
  schema: T,
  options: ValidationOptions = {}
): (
  req: ExpressRequest & { body: StandardSchemaV1.InferOutput<T> },
  res: ExpressResponse,
  next: ExpressNextFunction
) => void {
  return (
    req: ExpressRequest & { body: StandardSchemaV1.InferOutput<T> },
    res: ExpressResponse,
    next: ExpressNextFunction
  ): void => {
    const result = validateRequestSync(schema, req.body, options);
    if (!result.success) {
      res.status(result.status).json(result.body);
      return;
    }
    req.body = result.data;
    next();
  };
}
