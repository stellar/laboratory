import { parse, stringify } from "zustand-querystring";

export const apiExplorerShareableUrl = () => {
  const { origin, pathname, search } = window.location;

  // Removing extra chars
  const trimmedSearch = search.substring(3);
  const searchParams = Object.entries(parse(trimmedSearch) || {}).reduce(
    (res, cur) => {
      const [key, value] = cur;

      // For API Explorer shareable URL we only need to keep network and
      // endpoints params
      if (["network", "endpoints"].includes(key)) {
        return { ...res, [key]: value };
      }

      return res;
    },
    {},
  );

  return `${origin}${pathname}?$=${stringify(searchParams)};;`;
};
