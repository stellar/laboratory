export const capitalizeString = (text: string) =>
  (text && text[0].toUpperCase() + text.slice(1)) || text;
