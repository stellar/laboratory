import { splitXdrBlocks } from "../../src/helpers/splitXdrBlocks";

describe("splitXdrBlocks", () => {
  it("returns an empty array for empty input", () => {
    expect(splitXdrBlocks("")).toEqual([]);
    expect(splitXdrBlocks("   \n  \n")).toEqual([]);
  });

  it("returns a single block unchanged for one blob", () => {
    const blob = "AAAAAgAAAAA=";
    expect(splitXdrBlocks(blob)).toEqual([blob]);
  });

  it("splits multiple blobs separated by blank lines", () => {
    const input = "AAAA\n\nBBBB\n\nCCCC";
    expect(splitXdrBlocks(input)).toEqual(["AAAA", "BBBB", "CCCC"]);
  });

  it("splits on blank lines that contain whitespace", () => {
    const input = "AAAA\n   \nBBBB";
    expect(splitXdrBlocks(input)).toEqual(["AAAA", "BBBB"]);
  });

  it("drops `//` comment lines, including a leading section header", () => {
    const input = "// contractspecv0\n\nAAAA\n\nBBBB";
    expect(splitXdrBlocks(input)).toEqual(["AAAA", "BBBB"]);
  });

  it("drops a comment line directly above its entry", () => {
    const input = "// contractspecv0\nAAAA\n\nBBBB";
    expect(splitXdrBlocks(input)).toEqual(["AAAA", "BBBB"]);
  });

  it("collapses whitespace inside a block", () => {
    const input = "AA AA\nBB\tBB";
    expect(splitXdrBlocks(input)).toEqual(["AAAABBBB"]);
  });
});
