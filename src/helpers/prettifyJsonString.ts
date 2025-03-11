import { stringify } from "lossless-json";
import { parseToLosslessJson } from "@/helpers/parseToLosslessJson";

export const prettifyJsonString = (jsonString: string): string => {
  try {
    const parsedJson = parseToLosslessJson(jsonString);
    return stringify(parsedJson, null, 2) || "";
  } catch (e) {
    return jsonString;
  }
};
