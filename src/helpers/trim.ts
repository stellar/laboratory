// Regex explained: https://regexr.com/4v6jg
export const trim = (str: string, c = "\\s") =>
  str.replace(new RegExp(`^([${c}]*)(.*?)([${c}]*)$`), "$2");
