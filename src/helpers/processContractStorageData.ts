import {
  AnyObject,
  ContractStorageProcessedItem,
  SortDirection,
} from "@/types/types";

export const processContractStorageData = <T extends AnyObject>({
  data,
  sortById,
  sortByDir,
  filters,
}: {
  data: T[];
  sortById: string | undefined;
  sortByDir: SortDirection;
  filters: { [key: string]: string[] };
}): ContractStorageProcessedItem<T>[] => {
  let sortedData = [...data];

  // ===========================================================================
  // Sort
  // ===========================================================================
  if (sortById) {
    // Asc
    if (sortByDir === "asc") {
      sortedData = sortedData.sort((a: any, b: any) =>
        a[sortById] > b[sortById] ? 1 : -1,
      );
    }

    // Desc
    if (sortByDir === "desc") {
      sortedData = sortedData.sort((a: any, b: any) =>
        a[sortById] > b[sortById] ? -1 : 1,
      );
    }
  }

  // ===========================================================================
  // Filter
  // ===========================================================================
  const keyFilters = filters.key;
  const valueFilters = filters.value;

  // Filter by key first
  if (keyFilters.length > 0) {
    sortedData = sortedData.filter((s) => {
      if (s.keyJson && Array.isArray(s.keyJson)) {
        // Key value should have only one key
        const sFilter = s.keyJson[0];

        // Has to match all selected key filters
        // Exits early if something doesn't match
        return keyFilters.every((v) => v === sFilter);
      } else {
        return false;
      }
    });
  }

  // Then filter by value
  if (valueFilters.length > 0) {
    sortedData = sortedData.filter((s) => {
      if (s.valueJson && typeof s.valueJson === "object") {
        const vFilters = Object.keys(s.valueJson);

        // Has to match all selected value filters
        // Exits early if something doesn't match
        return valueFilters.every((v) => vFilters.includes(v));
      } else {
        return false;
      }
    });
  }

  // ===========================================================================
  // Result
  // ===========================================================================
  return sortedData as ContractStorageProcessedItem<T>[];
};
