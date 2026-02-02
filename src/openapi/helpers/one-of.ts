import type { AnyJSONSchema } from "../../types";

export interface OneOfOptions {
  target?: "openapi-3.0" | "draft-07" | "draft-2020-12";
}

export interface OneOfResult<TSchemas extends AnyJSONSchema[]> {
  oneOf: TSchemas;
}

export function oneOf<TSchemas extends AnyJSONSchema[]>(
  schemas: TSchemas,
  _options?: OneOfOptions
): OneOfResult<TSchemas> {
  return {
    oneOf: schemas,
  };
}
