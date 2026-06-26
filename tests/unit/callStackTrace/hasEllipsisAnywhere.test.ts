import { hasEllipsisAnywhere } from "../../../src/helpers/callStackTrace/hasEllipsisAnywhere";

describe("hasEllipsisAnywhere", () => {
  it("returns false for null/undefined input", () => {
    expect(hasEllipsisAnywhere(null)).toBe(false);
    expect(hasEllipsisAnywhere(undefined)).toBe(false);
  });

  it("returns false for non-array input", () => {
    expect(hasEllipsisAnywhere({ type: "ellipsis" })).toBe(false);
    expect(hasEllipsisAnywhere("ellipsis")).toBe(false);
  });

  it("detects an ellipsis node at the top level", () => {
    const data = [{ type: "u32", value: 1 }, { type: "ellipsis", value: "..." }];

    expect(hasEllipsisAnywhere(data)).toBe(true);
  });

  it("detects an ellipsis node nested inside a container value", () => {
    const data = [
      {
        type: "vec",
        value: [{ type: "u32", value: 1 }, { type: "ellipsis", value: "..." }],
      },
    ];

    expect(hasEllipsisAnywhere(data)).toBe(true);
  });

  it("returns false when no ellipsis is present at any depth", () => {
    const data = [
      { type: "u32", value: 1 },
      { type: "vec", value: [{ type: "u32", value: 2 }] },
    ];

    expect(hasEllipsisAnywhere(data)).toBe(false);
  });
});
