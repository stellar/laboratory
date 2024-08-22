export const getBipPathError = (value: string) => {
  const regexp = /44'\/148'\/(\d+)'/;
  const match = regexp.exec(value);

  if (!(match && match[1].length > 0)) {
    return "Invalid BIP path. Please provide it in format 44'/148'/x'. We call 44'/148'/0' the primary account";
  }

  return false;
};
