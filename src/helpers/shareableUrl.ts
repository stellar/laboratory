import { parse, stringify } from "zustand-querystring";

export const shareableUrl = (page: "requests" | "transactions") => {
  const { origin, pathname, search } = window.location;
  const pageParam = page === "requests" ? "endpoints" : "transaction";

  // Removing extra chars
  const trimmedSearch = search.substring(3);
  const searchParams = Object.entries(parse(trimmedSearch) || {}).reduce(
    (res, cur) => {
      const [key, value] = cur;

      // For API Explorer or Transaction shareable URL we only need to keep
      // network and endpoints or transaction params
      if (["network", pageParam].includes(key)) {
        return { ...res, [key]: value };
      }

      return res;
    },
    {},
  );

  return `${origin}${pathname}?$=${stringify(searchParams)};;`;
};
