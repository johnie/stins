import { describe, expect, it } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import {
  createErrorMiddleware,
  createValidationMiddleware,
  TanStackStartError,
  validateBody,
  validateBodySync,
} from "./tanstack-start";

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

describe("createValidationMiddleware", () => {
  it("returns middleware with server function", () => {
    const middleware = createValidationMiddleware(syncSchema);
    expect(middleware).toHaveProperty("server");
    expect(typeof middleware.server).toBe("function");
  });

  it("passes validated data via context on success", async () => {
    const middleware = createValidationMiddleware(syncSchema);
    let capturedContext: unknown;

    const mockNext = <T>(opts?: { context?: T }) => {
      capturedContext = opts?.context;
      return Promise.resolve({ context: opts?.context as T });
    };

    await middleware.server({
      next: mockNext,
      context: { data: { name: "John" } },
    });

    expect(capturedContext).toEqual({ validatedData: { name: "John" } });
  });

  it("reads from context.input if context.data is undefined", async () => {
    const middleware = createValidationMiddleware(syncSchema);
    let capturedContext: unknown;

    const mockNext = <T>(opts?: { context?: T }) => {
      capturedContext = opts?.context;
      return Promise.resolve({ context: opts?.context as T });
    };

    await middleware.server({
      next: mockNext,
      context: { input: { name: "Jane" } },
    });

    expect(capturedContext).toEqual({ validatedData: { name: "Jane" } });
  });

  it("throws TanStackStartError on validation failure", async () => {
    const middleware = createValidationMiddleware(syncSchema);

    const mockNext = <T>(opts?: { context?: T }) =>
      Promise.resolve({ context: opts?.context as T });

    try {
      await middleware.server({
        next: mockNext,
        context: { data: { name: 123 } },
      });
      expect(true).toBe(false); // should not reach
    } catch (error) {
      expect(error).toBeInstanceOf(TanStackStartError);
      const err = error as TanStackStartError;
      expect(err.status).toBe(400);
      expect(err.body.message).toBe("Validation failed");
    }
  });

  it("supports custom status code", async () => {
    const middleware = createValidationMiddleware(syncSchema, { status: 422 });

    const mockNext = <T>(opts?: { context?: T }) =>
      Promise.resolve({ context: opts?.context as T });

    try {
      await middleware.server({
        next: mockNext,
        context: { data: {} },
      });
      expect(true).toBe(false);
    } catch (error) {
      const err = error as TanStackStartError;
      expect(err.status).toBe(422);
    }
  });

  it("works with async schemas", async () => {
    const middleware = createValidationMiddleware(asyncSchema);
    let capturedContext: unknown;

    const mockNext = <T>(opts?: { context?: T }) => {
      capturedContext = opts?.context;
      return Promise.resolve({ context: opts?.context as T });
    };

    await middleware.server({
      next: mockNext,
      context: { data: { email: "test@example.com" } },
    });

    expect(capturedContext).toEqual({
      validatedData: { email: "test@example.com" },
    });
  });
});

describe("createErrorMiddleware", () => {
  it("returns middleware with server function", () => {
    const middleware = createErrorMiddleware();
    expect(middleware).toHaveProperty("server");
    expect(typeof middleware.server).toBe("function");
  });

  it("passes through on success", async () => {
    const middleware = createErrorMiddleware();

    const mockNext = () => Promise.resolve({ context: { result: "ok" } });

    const result = await middleware.server({
      next: mockNext,
      context: {},
    });

    expect(result).toEqual({ context: { result: "ok" } });
  });

  it("catches and formats errors", async () => {
    const middleware = createErrorMiddleware();

    const mockNext = () => Promise.reject(new Error("Something went wrong"));

    try {
      await middleware.server({
        next: mockNext,
        context: {},
      });
      expect(true).toBe(false);
    } catch (error) {
      expect(error).toBeInstanceOf(TanStackStartError);
      const err = error as TanStackStartError;
      expect(err.status).toBe(500);
      expect(err.body.message).toBe("Something went wrong");
    }
  });

  it("includes stack trace when configured", async () => {
    const middleware = createErrorMiddleware({ includeStack: true });

    const mockNext = () => Promise.reject(new Error("Test error"));

    try {
      await middleware.server({
        next: mockNext,
        context: {},
      });
      expect(true).toBe(false);
    } catch (error) {
      const err = error as TanStackStartError;
      expect(err.body.stack).toBeDefined();
    }
  });
});

describe("validateBody", () => {
  it("returns success with valid data", async () => {
    const result = await validateBody(syncSchema, { name: "John" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "John" });
    }
  });

  it("returns failure with invalid data", async () => {
    const result = await validateBody(syncSchema, { name: 123 });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(400);
      expect(result.body.message).toBe("Validation failed");
    }
  });

  it("handles async schemas", async () => {
    const result = await validateBody(asyncSchema, { email: "test@test.com" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ email: "test@test.com" });
    }
  });
});

describe("validateBodySync", () => {
  it("returns success with valid data", () => {
    const result = validateBodySync(syncSchema, { name: "Jane" });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ name: "Jane" });
    }
  });

  it("returns failure with invalid data", () => {
    const result = validateBodySync(syncSchema, {});
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.status).toBe(400);
    }
  });

  it("throws on async schema", () => {
    expect(() => {
      validateBodySync(asyncSchema, { email: "test@test.com" });
    }).toThrow(
      "Schema validation is async. Use validateRequest() instead of validateRequestSync()."
    );
  });
});
