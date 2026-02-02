import { describe, expect, it } from "bun:test";
import type { StandardSchemaV1 } from "@standard-schema/spec";
import { formatIssues, formatIssuesAsObject } from "./format-issues";

describe("formatIssues", () => {
  it("should format issues without path", () => {
    const issues: StandardSchemaV1.Issue[] = [{ message: "Required" }];

    const result = formatIssues(issues);

    expect(result).toEqual([{ message: "Required", path: undefined }]);
  });

  it("should format issues with string path segments", () => {
    const issues: StandardSchemaV1.Issue[] = [
      { message: "Invalid email", path: ["user", "email"] },
    ];

    const result = formatIssues(issues);

    expect(result).toEqual([{ message: "Invalid email", path: "user.email" }]);
  });

  it("should format issues with object path segments", () => {
    const issues: StandardSchemaV1.Issue[] = [
      { message: "Too short", path: [{ key: "items" }, { key: 0 }] },
    ];

    const result = formatIssues(issues);

    expect(result).toEqual([{ message: "Too short", path: "items.0" }]);
  });

  it("should handle empty path array", () => {
    const issues: StandardSchemaV1.Issue[] = [{ message: "Error", path: [] }];

    const result = formatIssues(issues);

    expect(result).toEqual([{ message: "Error", path: undefined }]);
  });

  it("should format multiple issues", () => {
    const issues: StandardSchemaV1.Issue[] = [
      { message: "Required", path: ["name"] },
      { message: "Invalid", path: ["email"] },
    ];

    const result = formatIssues(issues);

    expect(result).toEqual([
      { message: "Required", path: "name" },
      { message: "Invalid", path: "email" },
    ]);
  });
});

describe("formatIssuesAsObject", () => {
  it("should group issues by path", () => {
    const issues: StandardSchemaV1.Issue[] = [
      { message: "Required", path: ["name"] },
      { message: "Too short", path: ["name"] },
      { message: "Invalid", path: ["email"] },
    ];

    const result = formatIssuesAsObject(issues);

    expect(result).toEqual({
      name: ["Required", "Too short"],
      email: ["Invalid"],
    });
  });

  it("should use _root for issues without path", () => {
    const issues: StandardSchemaV1.Issue[] = [
      { message: "Root error" },
      { message: "Another root error" },
    ];

    const result = formatIssuesAsObject(issues);

    expect(result).toEqual({
      _root: ["Root error", "Another root error"],
    });
  });

  it("should handle nested paths", () => {
    const issues: StandardSchemaV1.Issue[] = [
      { message: "Invalid", path: ["user", "address", "zip"] },
    ];

    const result = formatIssuesAsObject(issues);

    expect(result).toEqual({
      "user.address.zip": ["Invalid"],
    });
  });

  it("should return empty object for empty issues array", () => {
    const result = formatIssuesAsObject([]);

    expect(result).toEqual({});
  });
});
