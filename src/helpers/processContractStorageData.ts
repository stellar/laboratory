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

  // Sort
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

  // Filter
  const keyFilters = filters.key;
  const valueFilters = filters.value;

  if (keyFilters.length > 0 || valueFilters.length > 0) {
    sortedData = sortedData.filter((s) => {
      let hasKeyFilter = false;
      let hasValueFilter = false;

      // Key
      if (s.keyJson && Array.isArray(s.keyJson)) {
        const sFilter = s.keyJson[0];

        hasKeyFilter = keyFilters.includes(sFilter);
      }

      // Value
      if (s.valueJson && typeof s.valueJson === "object") {
        const vFilters = Object.keys(s.valueJson);

        valueFilters.forEach((v) => {
          if (vFilters.includes(v)) {
            hasValueFilter = true;
          }
        });
      }

      return hasKeyFilter || hasValueFilter;
    });
  }

  return sortedData as ContractStorageProcessedItem<T>[];
};
