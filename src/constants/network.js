import { Networks } from "@stellar/stellar-sdk";

const NETWORK = {
  available: {
    futurenet: {
      horizonURL: "https://horizon-futurenet.stellar.org",
      networkPassphrase: Networks.FUTURENET,
    },
    test: {
      horizonURL: "https://horizon-testnet.stellar.org",
      networkPassphrase: Networks.TESTNET,
    },
    public: {
      horizonURL: "https://horizon.stellar.org",
      networkPassphrase: Networks.PUBLIC,
    },
  },
  defaultName: "test",
};
export default NETWORK;
