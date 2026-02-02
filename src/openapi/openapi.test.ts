import { describe, expect, it } from "bun:test";
import {
  jsonContent,
  jsonContentOneOf,
  jsonContentRequired,
  oneOf,
} from "./helpers";

describe("jsonContent", () => {
  it("should wrap schema in content structure", () => {
    const schema = { type: "string" };

    const result = jsonContent(schema, "A string response");

    expect(result).toEqual({
      content: {
        "application/json": {
          schema: { type: "string" },
        },
      },
      description: "A string response",
    });
  });

  it("should work with complex schemas", () => {
    const schema = {
      type: "object",
      properties: {
        id: { type: "number" },
        name: { type: "string" },
      },
      required: ["id", "name"],
    };

    const result = jsonContent(schema, "User object");

    expect(result.content["application/json"].schema).toEqual(schema);
    expect(result.description).toBe("User object");
  });
});

describe("jsonContentRequired", () => {
  it("should add required: true to result", () => {
    const schema = { type: "string" };

    const result = jsonContentRequired(schema, "Required body");

    expect(result).toEqual({
      content: {
        "application/json": {
          schema: { type: "string" },
        },
      },
      description: "Required body",
      required: true,
    });
  });
});

describe("oneOf", () => {
  it("should wrap schemas in oneOf structure", () => {
    const schemas = [{ type: "string" }, { type: "number" }];

    const result = oneOf(schemas);

    expect(result).toEqual({
      oneOf: [{ type: "string" }, { type: "number" }],
    });
  });
});

describe("jsonContentOneOf", () => {
  it("should combine oneOf with jsonContent structure", () => {
    const schemas = [
      { type: "object", properties: { success: { type: "boolean" } } },
      { type: "object", properties: { error: { type: "string" } } },
    ];

    const result = jsonContentOneOf(schemas, "Success or error response");

    expect(result).toEqual({
      content: {
        "application/json": {
          schema: {
            oneOf: schemas,
          },
        },
      },
      description: "Success or error response",
    });
  });
});
