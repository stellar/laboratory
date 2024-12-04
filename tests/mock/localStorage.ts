export const SAVED_ACCOUNT_1 =
  "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG";
export const SAVED_ACCOUNT_1_SECRET =
  "SADVGAH3VA3NGZ5VLX2ZICV7JQAINB2ZJZYOPMBXUNI3YRLGWLOA2OFY";
export const SAVED_ACCOUNT_2 =
  "GC5TQ7TXKHGE5JQMZPYV5KBSQ67X6PYQVU5QN7JRGWCHRA227UFPZ6LD";
export const SAVED_ACCOUNT_2_SECRET =
  "SCPPMMBZBQGTGQKIPGFJDOHOPGK7SXZJGMYF76PFHF2PBLY2RWGZNSVV";

const SAVED_ACCOUNTS = [
  {
    timestamp: 1732287853955,
    network: {
      id: "testnet",
      label: "Testnet",
    },
    name: "Account 1",
    publicKey: SAVED_ACCOUNT_1,
    secretKey: SAVED_ACCOUNT_1_SECRET,
  },
  {
    timestamp: 1731083842367,
    network: {
      id: "testnet",
      label: "Testnet",
    },
    name: "Account 2",
    publicKey: SAVED_ACCOUNT_2,
    secretKey: SAVED_ACCOUNT_2_SECRET,
  },
];

const SAVED_HORIZON_ENDPOINTS = [
  {
    timestamp: 1733173821853,
    network: { id: "testnet", label: "Testnet" },
    name: "Transactions",
    url: "https://horizon-testnet.stellar.org/transactions?limit=5&order=desc",
    method: "GET",
    route: "/endpoints/transactions",
    params: { order: "desc", limit: "5" },
    shareableUrl:
      "https://lab.stellar.org/endpoints/transactions?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&endpoints$params$order=desc&limit=5;;",
  },
  {
    timestamp: 1733233624053,
    network: { id: "testnet", label: "Testnet" },
    name: "Account",
    url: "https://horizon-testnet.stellar.org/accounts/GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
    method: "GET",
    route: "/endpoints/accounts/single",
    params: {
      account_id: "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
    },
    shareableUrl:
      "https://lab.stellar.org/endpoints/accounts/single?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&endpoints$params$account_id=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG;;",
  },
];

const SAVED_RPC_ENDPOINTS = [
  {
    timestamp: 1733173721157,
    network: { id: "testnet", label: "Testnet" },
    name: "Transactions",
    url: "https://soroban-testnet.stellar.org",
    method: "POST",
    route: "/endpoints/rpc/get-transactions",
    params: { startLedger: "1268840", limit: "5" },
    shareableUrl:
      "https://lab.stellar.org/endpoints/rpc/get-transactions?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&endpoints$params$startLedger=1268840&limit=5;;",
    payload: {
      jsonrpc: "2.0",
      id: 8675309,
      method: "getTransactions",
      params: {
        startLedger: 1268840,
        pagination: { limit: 5 },
        xdrFormat: "base64",
      },
    },
    rpcMethod: "getTransactions",
  },
  {
    timestamp: 1733233741685,
    network: { id: "testnet", label: "Testnet" },
    name: "Simulate",
    url: "https://soroban-testnet.stellar.org",
    method: "POST",
    route: "/endpoints/rpc/simulate-transaction",
    params: {
      tx: "AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg/AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb/mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI/rQSgGulcIFmzY0sX4LIxdwCg/3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u/zGi+dcZxbNy/1MV9ipZuflVzLHPKlgs=",
      resourceConfig: "1714814",
    },
    shareableUrl:
      "https://lab.stellar.org/endpoints/rpc/simulate-transaction?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&endpoints$params$tx=AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg//AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb//mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI//rQSgGulcIFmzY0sX4LIxdwCg//3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u//zGi+dcZxbNy//1MV9ipZuflVzLHPKlgs=&resourceConfig=1714814;&saved$activeTab=rpc;;",
    payload: {
      jsonrpc: "2.0",
      id: 8675309,
      method: "simulateTransaction",
      params: {
        transaction:
          "AAAAAgAAAAAYheerp3FCahtW+3qusxzklJhfxMPQJERfPKY0lXnVjQAPQkAADQg/AAAAJAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAABAAAAABB90WssODNIgi6BHveqzxTRmIpvAFRyVNM+Hm2GVuCcAAAAAAAAAADGfZUR9pNoQGv+u6uGjdcwVF3zlb/mjyN53fUCn+iBGQAAABdIdugAAAAAAAAAAAKVedWNAAAAQA8JEfXRL2BLjcYHYX+6Dloij4OIR44zsu6hd9CSI/rQSgGulcIFmzY0sX4LIxdwCg/3UMOfXFEpGxIsDvaJEQuGVuCcAAAAQBYyy1VZl3iPQBI4hyv4e91Xv9KfM54jWWLVoh2HEjTWzPUsTlo6e2u/zGi+dcZxbNy/1MV9ipZuflVzLHPKlgs=",
        resourceConfig: { instructionLeeway: 1714814 },
        xdrFormat: "base64",
      },
    },
    rpcMethod: "simulateTransaction",
  },
];

export const MOCK_LOCAL_STORAGE = {
  cookies: [],
  origins: [
    {
      origin: "http://localhost:3000",
      localStorage: [
        {
          name: "stellar_lab_saved_keypairs",
          value: JSON.stringify(SAVED_ACCOUNTS),
        },
        {
          name: "stellar_lab_saved_horizon_endpoints",
          value: JSON.stringify(SAVED_HORIZON_ENDPOINTS),
        },
        {
          name: "stellar_lab_saved_rpc_endpoints",
          value: JSON.stringify(SAVED_RPC_ENDPOINTS),
        },
      ],
    },
  ],
};
