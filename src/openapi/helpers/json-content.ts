import type { AnyJSONSchema } from "../../types";

export interface JsonContentOptions {
  target?: "openapi-3.0" | "draft-07" | "draft-2020-12";
}

export interface JsonContentResult<TSchema extends AnyJSONSchema> {
  content: {
    "application/json": {
      schema: TSchema;
    };
  };
  description: string;
}

export function jsonContent<TSchema extends AnyJSONSchema>(
  schema: TSchema,
  description: string,
  _options?: JsonContentOptions
): JsonContentResult<TSchema> {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
  };
}
