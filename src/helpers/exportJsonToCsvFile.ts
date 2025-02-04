import { unparse } from "papaparse";
import { AnyObject } from "@/types/types";

export const exportJsonToCsvFile = (
  jsonArray: AnyObject[],
  fileName: string,
) => {
  // Create CSV blob
  const csvBlob = new Blob([unparse(jsonArray)], { type: "text/csv" });

  // Create a link element and trigger a download
  const link = document.createElement("a");
  link.href = URL.createObjectURL(csvBlob);
  link.setAttribute("download", fileName);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
