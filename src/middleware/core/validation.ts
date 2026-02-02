import type { StandardSchemaV1 } from "@standard-schema/spec";
import { BAD_REQUEST } from "../../constants/http-status-codes.js";
import { formatIssues } from "../../validation/index.js";
import type {
  AnySchema,
  ValidationOptions,
  ValidationResponse,
} from "../types";

/**
 * Validates request data against a Standard Schema (async)
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Validation result with either data or prepared error response
 *
 * @example
 * ```ts
 * const result = await validateRequest(userSchema, req.body);
 * if (!result.success) {
 *   return c.json(result.body, result.status);
 * }
 * // result.data is typed correctly
 * ```
 */
export async function validateRequest<T extends AnySchema>(
  schema: T,
  data: unknown,
  options: ValidationOptions = {}
): Promise<ValidationResponse<StandardSchemaV1.InferOutput<T>>> {
  const { status = BAD_REQUEST } = options;

  const result = schema["~standard"].validate(data);
  const awaited = result instanceof Promise ? await result : result;

  if (awaited.issues) {
    return {
      success: false,
      status,
      body: {
        message: "Validation failed",
        errors: formatIssues(awaited.issues),
      },
    };
  }

  return {
    success: true,
    data: awaited.value as StandardSchemaV1.InferOutput<T>,
  };
}

/**
 * Validates request data against a Standard Schema (sync)
 *
 * @param schema - The Standard Schema to validate against
 * @param data - The data to validate
 * @param options - Optional validation configuration
 * @returns Validation result with either data or prepared error response
 * @throws If the schema validation is asynchronous
 *
 * @example
 * ```ts
 * const result = validateRequestSync(userSchema, req.body);
 * if (!result.success) {
 *   return res.status(result.status).json(result.body);
 * }
 * // result.data is typed correctly
 * ```
 */
export function validateRequestSync<T extends AnySchema>(
  schema: T,
  data: unknown,
  options: ValidationOptions = {}
): ValidationResponse<StandardSchemaV1.InferOutput<T>> {
  const { status = BAD_REQUEST } = options;

  const result = schema["~standard"].validate(data);

  if (result instanceof Promise) {
    throw new Error(
      "Schema validation is async. Use validateRequest() instead of validateRequestSync()."
    );
  }

  if (result.issues) {
    return {
      success: false,
      status,
      body: {
        message: "Validation failed",
        errors: formatIssues(result.issues),
      },
    };
  }

  return {
    success: true,
    data: result.value as StandardSchemaV1.InferOutput<T>,
  };
}
