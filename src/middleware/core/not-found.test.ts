import { describe, expect, it } from "bun:test";
import { createNotFoundResponse } from "./not-found";

describe("createNotFoundResponse", () => {
  it("returns 404 status", () => {
    const response = createNotFoundResponse("/api/users");
    expect(response.status).toBe(404);
  });

  it("includes path in message", () => {
    const response = createNotFoundResponse("/api/users/123");
    expect(response.body.message).toBe("Not Found: /api/users/123");
  });

  it("handles root path", () => {
    const response = createNotFoundResponse("/");
    expect(response.body.message).toBe("Not Found: /");
  });

  it("handles empty path", () => {
    const response = createNotFoundResponse("");
    expect(response.body.message).toBe("Not Found: ");
  });

  it("handles paths with query strings", () => {
    const response = createNotFoundResponse("/api/search?q=test");
    expect(response.body.message).toBe("Not Found: /api/search?q=test");
  });
});
