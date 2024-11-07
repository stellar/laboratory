export const removeLeadingZeroes = (numStr: string) =>
  numStr.replace(/^0+/, "") || "0";
