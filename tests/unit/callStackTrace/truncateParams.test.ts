import { truncateParams } from "../../../src/helpers/callStackTrace/truncateParams";
import { FormattedEventData } from "../../../src/helpers/formatDiagnosticEvents";

const prim = (value: number): FormattedEventData => ({ type: "u32", value });

const vec = (items: FormattedEventData[]): FormattedEventData => ({
  type: "vec",
  value: items,
});

const countEllipsis = (data: unknown): number =>
  (JSON.stringify(data).match(/"ellipsis"/g) || []).length;

describe("truncateParams", () => {
  it("returns all items unchanged when under the limit", () => {
    const input = [prim(1), prim(2)];

    expect(truncateParams(input, 4)).toEqual([prim(1), prim(2)]);
  });

  it("returns exactly maxItems with no ellipsis when at the limit", () => {
    const input = [prim(1), prim(2), prim(3), prim(4)];

    const result = truncateParams(input, 4);

    expect(result).toHaveLength(4);
    expect(countEllipsis(result)).toBe(0);
  });

  it("truncates and appends a single ellipsis node when over the limit", () => {
    const input = [prim(1), prim(2), prim(3), prim(4), prim(5), prim(6)];

    const result = truncateParams(input, 4);

    // 4 kept primitives + 1 ellipsis node
    expect(result).toHaveLength(5);
    expect(result.slice(0, 4)).toEqual([prim(1), prim(2), prim(3), prim(4)]);
    expect(result[4]).toEqual({ type: "ellipsis", value: "..." });
  });

  it("recurses into a nested vec and places the ellipsis inside it", () => {
    const input = [vec([prim(1), prim(2), prim(3), prim(4), prim(5), prim(6)])];

    const result = truncateParams(input, 4);

    expect(result).toHaveLength(1);
    const inner = result[0] as { type: string; value: FormattedEventData[] };
    expect(inner.type).toBe("vec");
    expect(inner.value).toHaveLength(5);
    expect(inner.value[4]).toEqual({ type: "ellipsis", value: "..." });
  });

  it("adds only one ellipsis across multiple truncated containers", () => {
    const six = [prim(1), prim(2), prim(3), prim(4), prim(5), prim(6)];
    const input = [vec(six), vec(six)];

    const result = truncateParams(input, 4);

    expect(countEllipsis(result)).toBe(1);
  });

  it("returns an empty array for empty input", () => {
    expect(truncateParams([], 4)).toEqual([]);
  });
});
