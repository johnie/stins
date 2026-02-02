// Types

// Adapters
export {
  elysiaMiddleware,
  expressMiddleware,
  h3Middleware,
  honoMiddleware,
  tanstackStartMiddleware,
} from "./adapters";

// Core functions (framework-agnostic)
export {
  createErrorResponse,
  createNotFoundResponse,
  validateRequest,
  validateRequestSync,
} from "./core";
export type {
  AnySchema,
  ErrorHandlerOptions,
  MiddlewareResponse,
  MiddlewareResponseBody,
  ValidationOptions,
  ValidationResponse,
  ValidationResponseFailure,
  ValidationResponseSuccess,
} from "./types";
