export const formatFileSize = (bytes: number) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }

  const kb = bytes / 1024;
  if (kb < 1024) {
    return `${kb.toFixed(kb < 10 ? 2 : 1)} KB`;
  }

  const mb = kb / 1024;
  if (mb < 1024) {
    return `${mb.toFixed(mb < 10 ? 2 : 1)} MB`;
  }

  const gb = mb / 1024;
  return `${gb.toFixed(gb < 10 ? 2 : 1)} GB`;
};
