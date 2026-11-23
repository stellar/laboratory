import { sortByNewest } from "@/helpers/sortByNewest";

describe("sortByNewest", () => {
  it("sorts items by timestamp, most recent first", () => {
    const items = [
      { name: "oldest", timestamp: 1 },
      { name: "newest", timestamp: 3 },
      { name: "middle", timestamp: 2 },
    ];

    expect(sortByNewest(items).map((i) => i.name)).toEqual([
      "newest",
      "middle",
      "oldest",
    ]);
  });

  it("does not mutate the original array", () => {
    const items = [{ timestamp: 1 }, { timestamp: 2 }];

    sortByNewest(items);

    expect(items).toEqual([{ timestamp: 1 }, { timestamp: 2 }]);
  });

  it("returns an empty array when given no items", () => {
    expect(sortByNewest([])).toEqual([]);
  });
});
