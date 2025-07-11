// Regex explained: https://regexr.com/4v6jg
export const trim = (str: string, c: string = "\\s") => {
  // Only allow safe, alphanumeric characters or \s for whitespace.
  if (!/^[a-zA-Z0-9\s]$/.test(c) && c !== "\\s") {
    throw new Error("Invalid trim character");
  }
  // Use a hardcoded regex with validated character.
  const pattern =
    c === "\\s"
      ? // whitespace trim
        /^\s*([\s\S]*?)\s*$/
      : // single character trim
        new RegExp(`^${c}*([\\s\\S]*?)${c}*$`);

  return str.replace(pattern, "$1");
};
