export const xdr = (value: string) => {
  if (value.match(/^[-A-Za-z0-9+/=]*$/) === null) {
    return "Input is not valid base64";
  }

  return false;
};
