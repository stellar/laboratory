import { parse } from "lossless-json";
import * as StellarXdr from "@/helpers/StellarXdr";
import {
  AnyObject,
  ContractStorageProcessedItem,
  SortDirection,
} from "@/types/types";

export const processContractStorageData = <T extends AnyObject>({
  data,
  sortById,
  sortByDir,
}: {
  data: T[];
  sortById: string | undefined;
  sortByDir: SortDirection;
}): ContractStorageProcessedItem<T>[] => {
  let sortedData = [...data];

  // Decode key and value
  sortedData = sortedData.map((i) => ({
    ...i,
    keyJson: i.key ? decodeScVal(i.key) : undefined,
    valueJson: i.value ? decodeScVal(i.value) : undefined,
  }));

  // Sort
  if (sortById) {
    if (["asc", "desc"].includes(sortByDir)) {
      // Asc
      sortedData = sortedData.sort((a: any, b: any) =>
        a[sortById] > b[sortById] ? 1 : -1,
      );

      // Desc
      if (sortByDir === "desc") {
        sortedData = sortedData.reverse();
      }
    }
  }

  // TODO: Filter

  return sortedData as ContractStorageProcessedItem<T>[];
};

const decodeScVal = (xdrString: string) => {
  try {
    return xdrString
      ? (parse(StellarXdr.decode("ScVal", xdrString)) as AnyObject)
      : null;
  } catch (e) {
    return null;
  }
};
