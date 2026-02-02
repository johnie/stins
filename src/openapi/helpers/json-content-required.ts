import type { AnyJSONSchema } from "@/types";
import type { JsonContentOptions, JsonContentResult } from "./json-content";

export type JsonContentRequiredResult<TSchema extends AnyJSONSchema> =
  JsonContentResult<TSchema> & {
    required: true;
  };

export function jsonContentRequired<TSchema extends AnyJSONSchema>(
  schema: TSchema,
  description: string,
  _options?: JsonContentOptions
): JsonContentRequiredResult<TSchema> {
  return {
    content: {
      "application/json": {
        schema,
      },
    },
    description,
    required: true,
  };
}
