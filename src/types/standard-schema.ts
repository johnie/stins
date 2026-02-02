import type { StandardSchemaV1 } from "@standard-schema/spec";

export type {
  StandardSchemaV1,
  StandardSchemaV1 as StandardJSONSchemaV1,
} from "@standard-schema/spec";

export type InferInput<T extends StandardSchemaV1> =
  StandardSchemaV1.InferInput<T>;

export type InferOutput<T extends StandardSchemaV1> =
  StandardSchemaV1.InferOutput<T>;

export type AnyStandardSchema = StandardSchemaV1<unknown, unknown>;

export type AnyJSONSchema = Record<string, unknown>;
