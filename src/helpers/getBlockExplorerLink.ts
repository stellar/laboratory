export type BlockExplorer = "stellar.expert" | "stellarchain.io";

export const getBlockExplorerLink = (explorer: BlockExplorer) => {
  switch (explorer) {
    case "stellar.expert": {
      return {
        mainnet: "https://stellar.expert/explorer/public",
        testnet: "https://stellar.expert/explorer/testnet",
        futurenet: "",
        custom: "",
      };
    }
    case "stellarchain.io":
      return {
        mainnet: "https://stellarchain.io",
        testnet: "https://testnet.stellarchain.io",
        futurenet: "",
        custom: "",
      };
    // defaults to stellar.expert
    default:
      return {
        mainnet: "https://stellar.expert/explorer/public",
        testnet: "https://stellar.expert/explorer/testnet",
        futurenet: "",
        custom: "",
      };
  }
};
