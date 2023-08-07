import { Networks } from "stellar-sdk";
import { Networks as SorobanNetworks } from "soroban-client";

const NETWORK = {
  available: {
    futurenet: {
      horizonURL: "https://horizon-futurenet.stellar.org",
      networkPassphrase: SorobanNetworks.FUTURENET,
    },
    test: {
      horizonURL: "https://horizon-testnet.stellar.org",
      networkPassphrase: Networks.TESTNET,
    },
    public: {
      horizonURL: "https://horizon.stellar.org",
      networkPassphrase: Networks.PUBLIC,
    },
    bullionFx: {
      horizonURL: "https://stellar.bullionfx.com",
      networkPassphrase: Networks.BULLION,
    },
  },
  defaultName: "test",
};
export default NETWORK;
