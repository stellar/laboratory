// Primitive Definition DataUrl comes from
// https://github.com/stellar/js-stellar-sdk/blob/master/src/contract/spec.ts#L159-L164
export const getDataUrlError = (value: string, isRequired?: boolean) => {
  if (!value) {
    if (isRequired) {
      return "This field is required.";
    } else {
      return false;
    }
  }
  // Check if value is a string
  if (typeof value !== "string") {
    return "Value must be a string";
  }

  // Check pattern for base64 data URL
  const dataUrlPattern =
    /^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/;
  if (!dataUrlPattern.test(value)) {
    return "Value must be a valid base64 encoded string";
  }

  return false;
};
