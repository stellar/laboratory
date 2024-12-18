import { STELLAR_EXPERT } from "@/constants/settings";

export type BlockExplorer = "stellar.expert" | "stellarchain.io";

export const getBlockExplorerLink = (explorer: BlockExplorer) => {
  switch (explorer) {
    case "stellarchain.io":
      return {
        mainnet: "https://stellarchain.io",
        testnet: "https://testnet.stellarchain.io",
        futurenet: "",
        custom: "",
      };
    // defaults to stellar.expert
    case "stellar.expert":
    default:
      return {
        mainnet: `${STELLAR_EXPERT}/public`,
        testnet: `${STELLAR_EXPERT}/testnet`,
        futurenet: "",
        custom: "",
      };
  }
};
