import { parse, stringify } from "zustand-querystring";

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

  // Removing extra chars
  const trimmedSearch = search.substring(3);
  const searchParams = Object.entries(parse(trimmedSearch) || {}).reduce(
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
