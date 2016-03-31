const NETWORK = {
  available: {
    test: {
      url: 'https://horizon-testnet.stellar.org',
      useNetworkFunc: 'useTestNetwork',
    },
    public: {
      url: 'https://horizon.stellar.org',
      useNetworkFunc: 'usePublicNetwork',
    }
  },
  defaultName: 'test',
};
export default NETWORK;