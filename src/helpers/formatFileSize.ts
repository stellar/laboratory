export const formatFileSize = (
  bytes: number,
  unit: "binary" | "decimal" = "decimal",
) => {
  const divisor = unit === "binary" ? 1024 : 1000;
  const threshold = unit === "binary" ? 1024 : 1000;

  if (bytes < threshold) {
    return `${bytes} B`;
  }

  const kb = bytes / divisor;
  const kbUnit = unit === "binary" ? "KiB" : "KB";
  if (kb < threshold) {
    const formatted = kb.toFixed(kb < 10 ? 2 : 1);
    return `${formatted.replace(/\.0+$/, "")} ${kbUnit}`;
  }

  const mb = kb / divisor;
  const mbUnit = unit === "binary" ? "MiB" : "MB";
  if (mb < threshold) {
    const formatted = mb.toFixed(mb < 10 ? 2 : 1);
    return `${formatted.replace(/\.0+$/, "")} ${mbUnit}`;
  }

  const gb = mb / divisor;
  const gbUnit = unit === "binary" ? "GiB" : "GB";
  const formatted = gb.toFixed(gb < 10 ? 2 : 1);
  return `${formatted.replace(/\.0+$/, "")} ${gbUnit}`;
};
