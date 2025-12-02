import { StrKey } from "@stellar/stellar-sdk";
import { muxedAccount } from "@/helpers/muxedAccount";

export const getMuxedAddressError = (
  muxedAddress: string,
  isRequired?: boolean,
) => {
  if (!muxedAddress) {
    if (isRequired) {
      return "Muxed account address is required.";
    } else {
      return false;
    }
  }

  if (!muxedAddress.startsWith("M")) {
    return "Muxed account address must start with 'M'.";
  }

  if (!StrKey.isValidMed25519PublicKey(muxedAddress)) {
    return "Muxed account address is invalid.";
  }

  const result = muxedAccount.parse({ muxedAddress });

  if (!result.baseAddress) {
    return "Base address could not be found in the muxed account.";
  }

  if (result.error) {
    return result.error;
  }

  return false;
};
