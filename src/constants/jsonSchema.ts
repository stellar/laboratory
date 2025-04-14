import type { JSONSchema7Definition } from "json-schema";

import { TxnOperation } from "@/types/types";

export const INITIAL_OPERATION: TxnOperation = {
  operation_type: "",
  params: [],
};

export type DereferencedSchemaType = {
  name: string;
  description: string;
  properties: Record<string, JSONSchema7Definition>;
  required: string[];
  additionalProperties: JSONSchema7Definition | DereferencedSchemaType;
  type: string;
};

export const INITIAL_ARRAY_ITEM = {
  name: "",
  description: "",
  properties: {},
  required: [],
  additionalProperties: {},
};
