import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";

import { isAsset } from "@/helpers/callStackTrace/isAsset";

/**
 * Formats an asset string for display by shortening its issuer
 * (`code:GABC...XYZ`). Non-asset values are returned unchanged.
 *
 * Only used by the CallStackTrace component.
 *
 * @param value - The value to format.
 * @returns The asset string with a shortened issuer, or the original value.
 */
export const renderAssetString = (value: string) => {
  if (isAsset(value)) {
    const [code, issuer] = value.split(":");

    return `${code}:${shortenStellarAddress(issuer)}`;
  }

  return value;
};
