import { STELLAR_EXPERT } from "@/constants/settings";
import { NetworkType } from "@/types/types";

export const stellarExpertTransactionLink = (
  txHash: string,
  networkId: NetworkType,
) => {
  // Not supported networks
  if (["futurenet", "custom"].includes(networkId)) {
    return "";
  }

  const network = networkId === "mainnet" ? "public" : "testnet";

  return `${STELLAR_EXPERT}/${network}/tx/${txHash}`;
};
