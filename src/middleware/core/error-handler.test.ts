import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { createErrorResponse } from "./error-handler";

describe("createErrorResponse", () => {
  const originalEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalEnv;
  });

  it("returns 500 status by default", () => {
    const response = createErrorResponse(new Error("Test error"));
    expect(response.status).toBe(500);
  });

  it("uses error message from Error objects", () => {
    const response = createErrorResponse(new Error("Something went wrong"));
    expect(response.body.message).toBe("Something went wrong");
  });

  it("uses default message for non-Error objects", () => {
    const response = createErrorResponse("string error");
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("uses default message for null", () => {
    const response = createErrorResponse(null);
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("uses default message for undefined", () => {
    const response = createErrorResponse(undefined);
    expect(response.body.message).toBe("Internal Server Error");
  });

  it("allows custom default status", () => {
    const response = createErrorResponse(new Error("Test"), {
      defaultStatus: 503,
    });
    expect(response.status).toBe(503);
  });

  describe("stack traces", () => {
    beforeEach(() => {
      process.env.NODE_ENV = "production";
    });

    it("excludes stack in production by default", () => {
      const response = createErrorResponse(new Error("Test"));
      expect(response.body.stack).toBeUndefined();
    });

    it("includes stack when explicitly enabled", () => {
      const response = createErrorResponse(new Error("Test"), {
        includeStack: true,
      });
      expect(response.body.stack).toBeDefined();
      expect(response.body.stack).toContain("Error: Test");
    });

    it("excludes stack when explicitly disabled", () => {
      process.env.NODE_ENV = "development";
      const response = createErrorResponse(new Error("Test"), {
        includeStack: false,
      });
      expect(response.body.stack).toBeUndefined();
    });

    it("includes stack in development by default", () => {
      process.env.NODE_ENV = "development";
      const response = createErrorResponse(new Error("Test"));
      expect(response.body.stack).toBeDefined();
    });
  });
});
