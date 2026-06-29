import { FormattedEventData } from "@/helpers/formatDiagnosticEvents";

/**
 * Converts an arbitrary error value into a `FormattedEventData` tree so it can
 * be rendered with the same primitives as other call-stack values. Arrays map
 * to `vec` nodes, plain objects map to `map` nodes (keyed entries), and
 * everything else becomes an untyped primitive value.
 *
 * Only used by the CallStackTrace component to render `error`-typed values.
 *
 * @param errorValue - The raw error value to convert.
 * @returns The formatted tree, or `null` when the value is null/undefined.
 */
export const toErrorMapData = (
  errorValue: unknown,
): FormattedEventData | null => {
  if (errorValue === null || errorValue === undefined) {
    return null;
  }

  const toErrorNode = (node: unknown): FormattedEventData => {
    if (Array.isArray(node)) {
      return {
        type: "vec",
        value: node.map((item) => toErrorNode(item)),
      };
    }

    if (node && typeof node === "object") {
      return {
        type: "map",
        value: Object.entries(node as Record<string, unknown>).map(
          ([key, detail]) => ({
            key: { type: undefined, value: key },
            val: toErrorNode(detail),
          }),
        ),
      };
    }

    return { type: undefined, value: node };
  };

  return toErrorNode(errorValue);
};
