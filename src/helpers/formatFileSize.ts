export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    const formatted = kb.toFixed(kb < 10 ? 2 : 1);
    return `${formatted.replace(/\.0+$/, "")} KB`;
  }

  const mb = kb / 1024;
  if (mb < 1024) {
    const formatted = mb.toFixed(mb < 10 ? 2 : 1);
    return `${formatted.replace(/\.0+$/, "")} MB`;
  }

  const gb = mb / 1024;
  const formatted = gb.toFixed(gb < 10 ? 2 : 1);
  return `${formatted.replace(/\.0+$/, "")} GB`;
};
