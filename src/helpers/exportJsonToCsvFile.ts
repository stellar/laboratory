import { unparse } from "papaparse";
import { downloadFile } from "@/helpers/downloadFile";
import { AnyObject } from "@/types/types";

export const exportJsonToCsvFile = (
  jsonArray: AnyObject[],
  fileName: string,
) => {
  downloadFile({
    value: unparse(jsonArray),
    fileExtension: "csv",
    fileName,
    fileType: "text/csv",
  });
};
