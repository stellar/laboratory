import { AssetType } from "@/types/types";

export const assetCode = (
  code: string,
  assetType: AssetType | undefined,
  isRequired?: boolean,
) => {
  if (isRequired && !code) {
    return "Asset code is required.";
  }

  let minLength;
  let maxLength;

  switch (assetType) {
    case "credit_alphanum4":
      minLength = 1;
      maxLength = 4;
      break;
    case "credit_alphanum12":
      minLength = 5;
      maxLength = 12;
      break;
    default:
      minLength = 1;
      maxLength = 12;
  }

  if (!code.match(/^[a-zA-Z0-9]+$/g)) {
    return "Asset code must consist of only letters and numbers.";
  } else if (code.length < minLength || code.length > maxLength) {
    return `Asset code must be between ${minLength} and ${maxLength} characters long.`;
  }

  return false;
};
