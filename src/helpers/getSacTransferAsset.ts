import { Asset } from "@stellar/stellar-sdk";

export type SacTransferAsset = {
  assetCode: string;
  assetIssuer: string;
};

const NO_ASSET: SacTransferAsset = { assetCode: "", assetIssuer: "" };

/**
 * Resolves the classic asset of a `transfer` event, but only when the event
 * was emitted by that asset's Stellar Asset Contract (SAC).
 *
 * A SAC adds the asset as a fourth topic (`sep0011_asset`), either `"native"`
 * or `"CODE:ISSUER"`. Any other contract can put any value in that topic, so
 * the topic is trusted only when `contractId` equals the SAC contract ID
 * derived from that asset and the network passphrase.
 *
 * @param params.contractId - `contract_id` of the event emitter.
 * @param params.assetTopic - String value of `topics[3]`, if any.
 * @param params.networkPassphrase - Passphrase of the current network.
 * @returns `{ assetCode: "XLM", assetIssuer: "native" }` for the native SAC,
 * `{ assetCode, assetIssuer }` for an issued asset's SAC, or empty strings if
 * the emitter is not the SAC of the asset in the topic.
 */
export const getSacTransferAsset = ({
  contractId,
  assetTopic,
  networkPassphrase,
}: {
  contractId: string | null | undefined;
  assetTopic: string | null | undefined;
  networkPassphrase: string | null | undefined;
}): SacTransferAsset => {
  if (!contractId || !assetTopic || !networkPassphrase) {
    return NO_ASSET;
  }

  try {
    if (assetTopic === "native") {
      return Asset.native().contractId(networkPassphrase) === contractId
        ? { assetCode: "XLM", assetIssuer: "native" }
        : NO_ASSET;
    }

    const parts = assetTopic.split(":");

    if (parts.length !== 2) {
      return NO_ASSET;
    }

    const [assetCode, assetIssuer] = parts;

    // Throws if code or issuer is invalid
    const sacId = new Asset(assetCode, assetIssuer).contractId(
      networkPassphrase,
    );

    return sacId === contractId ? { assetCode, assetIssuer } : NO_ASSET;
  } catch {
    return NO_ASSET;
  }
};
