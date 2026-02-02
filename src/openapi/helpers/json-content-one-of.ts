import type { AnyJSONSchema } from "../../types";
import type { JsonContentOptions } from "./json-content";
import type { OneOfResult } from "./one-of";

export interface JsonContentOneOfResult<TSchemas extends AnyJSONSchema[]> {
  content: {
    "application/json": {
      schema: OneOfResult<TSchemas>;
    };
  };
  description: string;
}

export function jsonContentOneOf<TSchemas extends AnyJSONSchema[]>(
  schemas: TSchemas,
  description: string,
  _options?: JsonContentOptions
): JsonContentOneOfResult<TSchemas> {
  return {
    content: {
      "application/json": {
        schema: {
          oneOf: schemas,
        },
      },
    },
    description,
  };
}
