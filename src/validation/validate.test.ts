import { describe, expect, it } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { validate, validateSync } from "./validate";

function createMockSchema<TInput, TOutput = TInput>(config: {
  validate: (
    value: unknown
  ) =>
    | StandardSchemaV1.Result<TOutput>
    | Promise<StandardSchemaV1.Result<TOutput>>;
}): StandardSchemaV1<TInput, TOutput> {
  return {
    "~standard": {
      version: 1,
      vendor: "test",
      validate: config.validate,
    },
  };
}

describe("validate", () => {
  it("should return success for valid sync schema", async () => {
    const schema = createMockSchema<string>({
      validate: (value) => ({ value: value as string }),
    });

    const result = await validate(schema, "hello");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("should return issues for invalid sync schema", async () => {
    const schema = createMockSchema<string>({
      validate: () => ({
        issues: [{ message: "Invalid value" }],
      }),
    });

    const result = await validate(schema, 123);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toHaveLength(1);
      expect(result.issues[0]?.message).toBe("Invalid value");
    }
  });

  it("should handle async validation", async () => {
    const schema = createMockSchema<string>({
      validate: async (value) => {
        await Promise.resolve();
        return { value: value as string };
      },
    });

    const result = await validate(schema, "async-value");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("async-value");
    }
  });

  it("should handle async validation failure", async () => {
    const schema = createMockSchema<string>({
      validate: async () => {
        await Promise.resolve();
        return { issues: [{ message: "Async error" }] };
      },
    });

    const result = await validate(schema, "bad");

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues[0]?.message).toBe("Async error");
    }
  });
});

describe("validateSync", () => {
  it("should return success for valid sync schema", () => {
    const schema = createMockSchema<string>({
      validate: (value) => ({ value: value as string }),
    });

    const result = validateSync(schema, "hello");

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toBe("hello");
    }
  });

  it("should return issues for invalid sync schema", () => {
    const schema = createMockSchema<string>({
      validate: () => ({
        issues: [{ message: "Invalid value" }],
      }),
    });

    const result = validateSync(schema, 123);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.issues).toHaveLength(1);
    }
  });

  it("should throw for async schema", () => {
    const schema = createMockSchema<string>({
      validate: async () => ({ value: "test" }),
    });

    expect(() => validateSync(schema, "test")).toThrow(
      "Schema validation is async. Use validate() instead of validateSync()."
    );
  });
});
