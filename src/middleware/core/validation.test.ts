import { describe, expect, it } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { validateRequest, validateRequestSync } from "./validation";

const createMockSchema = <T>(
  validator: (
    value: unknown
  ) => StandardSchemaV1.Result<T> | Promise<StandardSchemaV1.Result<T>>
): StandardSchemaV1<unknown, T> => ({
  "~standard": {
    version: 1,
    vendor: "test",
    validate: validator,
  },
});

const syncSchema = createMockSchema<{ name: string }>((value) => {
  if (
    typeof value === "object" &&
    value !== null &&
    "name" in value &&
    typeof value.name === "string"
  ) {
    return { value: value as { name: string } };
  }
  return {
    issues: [{ message: "Invalid name", path: ["name"] }],
  };
});

const asyncSchema = createMockSchema<{ email: string }>(async (value) => {
  await Promise.resolve();
  if (
    typeof value === "object" &&
    value !== null &&
    "email" in value &&
    typeof value.email === "string" &&
    value.email.includes("@")
  ) {
    return { value: value as { email: string } };
  }
  return {
    issues: [{ message: "Invalid email", path: ["email"] }],
  };
});

describe("validateRequest", () => {
  it("returns success with valid data", async () => {
    const result = await validateRequest(syncSchema, { name: "John" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John" });
    }
  });

  it("returns failure with invalid data", async () => {
    const result = await validateRequest(syncSchema, { name: 123 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Validation failed");
      expect(result.body.errors).toHaveLength(1);
      expect(result.body.errors?.[0]?.message).toBe("Invalid name");
    }
  });

  it("handles async schemas", async () => {
    const result = await validateRequest(asyncSchema, {
      email: "test@example.com",
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ email: "test@example.com" });
    }
  });

  it("handles async schema validation failure", async () => {
    const result = await validateRequest(asyncSchema, { email: "invalid" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.body.errors?.[0]?.message).toBe("Invalid email");
    }
  });

  it("allows custom status code", async () => {
    const result = await validateRequest(
      syncSchema,
      { name: 123 },
      { status: 422 }
    );
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(422);
    }
  });
});

describe("validateRequestSync", () => {
  it("returns success with valid data", () => {
    const result = validateRequestSync(syncSchema, { name: "Jane" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "Jane" });
    }
  });

  it("returns failure with invalid data", () => {
    const result = validateRequestSync(syncSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Validation failed");
    }
  });

  it("throws on async schema", () => {
    expect(() => {
      validateRequestSync(asyncSchema, { email: "test@example.com" });
    }).toThrow(
      "Schema validation is async. Use validateRequest() instead of validateRequestSync()."
    );
  });

  it("allows custom status code", () => {
    const result = validateRequestSync(syncSchema, {}, { status: 422 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(422);
    }
  });
});
