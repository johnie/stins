import type { StandardSchemaV1 } from "@standard-schema/spec";

export interface ValidationSuccess<T> {
  success: true;
  data: T;
}

export interface ValidationFailure {
  success: false;
  issues: readonly StandardSchemaV1.Issue[];
}

export type ValidationResult<T> = ValidationSuccess<T> | ValidationFailure;

export async function validate<T extends StandardSchemaV1>(
  schema: T,
  value: unknown
): Promise<ValidationResult<StandardSchemaV1.InferOutput<T>>> {
  const result = schema["~standard"].validate(value);

  if (result instanceof Promise) {
    const awaited = await result;
    if (awaited.issues) {
      return { success: false, issues: awaited.issues };
    }
    return { success: true, data: awaited.value };
  }

  if (result.issues) {
    return { success: false, issues: result.issues };
  }
  return { success: true, data: result.value };
}

export function validateSync<T extends StandardSchemaV1>(
  schema: T,
  value: unknown
): ValidationResult<StandardSchemaV1.InferOutput<T>> {
  const result = schema["~standard"].validate(value);

  if (result instanceof Promise) {
    throw new Error(
      "Schema validation is async. Use validate() instead of validateSync()."
    );
  }

  if (result.issues) {
    return { success: false, issues: result.issues };
  }
  return { success: true, data: result.value };
}
