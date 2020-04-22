import { Networks } from 'stellar-sdk';

const NETWORK = {
  available: {
    test: {
      horizonURL: 'https://horizon-testnet.stellar.org',
      networkPassphrase: Networks.TESTNET
    },
    public: {
      horizonURL: 'https://horizon.stellar.org',
      networkPassphrase: Networks.PUBLIC
    }
  },
  defaultName: 'test',
};
export default NETWORK;
