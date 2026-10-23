import { stringify } from "zustand-querystring";
import { getQueryStringState } from "@/helpers/getQueryStringState";

export const shareableUrl = (
  type: "requests" | "transactions-build" | "transactions-save",
) => {
  const { origin, pathname, search } = window.location;

  // For API Explorer or Transaction shareable URL we only need to keep
  // network and endpoints, transaction, or xdr params
  const keepParams = ["network"];

  switch (type) {
    case "requests":
      keepParams.push("endpoints");
      break;
    case "transactions-build":
      keepParams.push("transaction");
      break;
    case "transactions-save":
      keepParams.push("xdr");
      break;
    default:
    // Do nothing
  }

  const searchParams = Object.entries(getQueryStringState(search) || {}).reduce(
    (res, cur) => {
      const [key, value] = cur;

      if (keepParams.includes(key)) {
        return { ...res, [key]: value };
      }

      return res;
    },
    {},
  );

  return `${origin}${pathname}?$=${stringify(searchParams)};;`;
};
