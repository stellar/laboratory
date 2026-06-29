import { FormattedEventData } from "@/helpers/formatDiagnosticEvents";

/**
 * Truncates a list of formatted function-call params to at most `maxItems`
 * primitive values, recursing into containers (`vec`/`map`). When values are
 * dropped, a single `{ type: "ellipsis", value: "..." }` node is appended to
 * the array where truncation first occurred.
 *
 * Only used by the CallStackTrace component's collapsed-params view.
 *
 * @param data - The formatted params to truncate.
 * @param maxItems - Maximum number of primitive values to keep.
 * @returns The truncated params (possibly containing an ellipsis node).
 */
export const truncateParams = (
  data: FormattedEventData[],
  maxItems: number,
): FormattedEventData[] => {
  let itemCount = 0;
  let ellipsisAdded = false;

  const isContainer = (type: string): boolean => {
    return type === "vec" || type === "map";
  };

  const addEllipsisIfNeeded = (items: any[], wasTruncated: boolean) => {
    if (wasTruncated && !ellipsisAdded && items.length > 0) {
      items.push({ value: "...", type: "ellipsis" });
      ellipsisAdded = true;
    }
  };

  const truncateArray = (items: any[]) => {
    const truncatedArray: any[] = [];
    let wasTruncated = false;

    for (const item of items) {
      if (itemCount >= maxItems) {
        wasTruncated = true;
        break;
      }

      const result = traverse(item);

      if (result !== undefined) {
        truncatedArray.push(result);
      }
    }

    addEllipsisIfNeeded(truncatedArray, wasTruncated);

    return {
      truncatedArray,
      wasTruncated,
    };
  };

  const traverse = (node: any): any => {
    if (
      node &&
      typeof node === "object" &&
      "type" in node &&
      "value" in node
    ) {
      const isContainerType = isContainer(node.type);

      if (!isContainerType) {
        itemCount++;

        if (itemCount > maxItems) {
          return undefined;
        }

        return node;
      }

      if (Array.isArray(node.value)) {
        const { truncatedArray } = truncateArray(node.value);

        if (truncatedArray.length > 0) {
          return { ...node, value: truncatedArray };
        }

        return undefined;
      }

      return node;
    }

    if (Array.isArray(node)) {
      const { truncatedArray } = truncateArray(node);

      return truncatedArray.length > 0 ? truncatedArray : undefined;
    }

    return node;
  };

  const result: FormattedEventData[] | undefined = traverse(data);

  return result || [];
};
