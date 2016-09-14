import {Network, Networks} from 'stellar-sdk';

const NETWORK = {
  available: {
    test: {
      url: 'https://horizon-testnet.stellar.org',
      networkObj: new Network(Networks.TESTNET),
    },
    public: {
      url: 'https://horizon.stellar.org',
      networkObj: new Network(Networks.PUBLIC),
    }
  },
  defaultName: 'test',
};
export default NETWORK;
