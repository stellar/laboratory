export const SAVED_ACCOUNT_1 =
  "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG";
export const SAVED_ACCOUNT_1_SECRET =
  "SADVGAH3VA3NGZ5VLX2ZICV7JQAINB2ZJZYOPMBXUNI3YRLGWLOA2OFY";
export const SAVED_ACCOUNT_1_RECOVERY_PHRASE =
  "test rare garbage cruise castle brand call topic bind bar test1 borrow garden jar melt island museum number test2 night final sleep avoid recycle";
export const SAVED_ACCOUNT_2 =
  "GC5TQ7TXKHGE5JQMZPYV5KBSQ67X6PYQVU5QN7JRGWCHRA227UFPZ6LD";
export const SAVED_ACCOUNT_2_SECRET =
  "SCPPMMBZBQGTGQKIPGFJDOHOPGK7SXZJGMYF76PFHF2PBLY2RWGZNSVV";
export const SAVED_CONTRACT_1 =
  "CA7EJMAZFK3JKYRSSPK5FNEMJ3A77NQT6AA4ZGLA7J25CFR7A26ADQQB";
export const SAVED_CONTRACT_2 =
  "CBASD23H3XLX3OVJPKN7Z5UIQLKJFA45HD5UOJTFUHL43NKBHJY3JMUQ";

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
    recoveryPhrase: SAVED_ACCOUNT_1_RECOVERY_PHRASE,
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

const SAVED_TRANSACTIONS = [
  {
    timestamp: 1733259519949,
    network: { id: "testnet", label: "Testnet" },
    name: "Submit Create Account Tx",
    xdr: "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAD4XTdOZpDOMR4vk9NUjYLbGosEJ65W78xLqdY6paYxJwAAAAJUC+QAAAAAAAAAAAFKR0CTAAAAQOvPXZdv0dUdcNAY26wVnVAUjyGRd8yrxDeUO2qaP9XF9Ws2qaCnAnfdoCzp6hk5CHwA/EiA+aJGwnMMxUjoxQw=",
    page: "submit",
    shareableUrl:
      "https://lab.stellar.org/transaction/submit?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&xdr$blob=AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq//5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAD4XTdOZpDOMR4vk9NUjYLbGosEJ65W78xLqdY6paYxJwAAAAJUC+QAAAAAAAAAAAFKR0CTAAAAQOvPXZdv0dUdcNAY26wVnVAUjyGRd8yrxDeUO2qaP9XF9Ws2qaCnAnfdoCzp6hk5CHwA//EiA+aJGwnMMxUjoxQw=;;",
  },
  {
    timestamp: 1733259577781,
    network: { id: "testnet", label: "Testnet" },
    name: "Create Account + Payment Tx",
    xdr: "AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq/5HGjapWAXjGSkdAkwAAAMgADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAD4XTdOZpDOMR4vk9NUjYLbGosEJ65W78xLqdY6paYxJwAAAAJUC+QAAAAAAAAAAAEAAAAA+F03TmaQzjEeL5PTVI2C2xqLBCeuVu/MS6nWOqWmMScAAAAAAAAAADuaygAAAAAAAAAAAA==",
    page: "build",
    shareableUrl:
      "https://lab.stellar.org/transaction/build?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$build$params$source_account=GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG&seq_num=3668692344766465;&operations@$operation_type=create_account&params$destination=GD4F2N2OM2IM4MI6F6J5GVENQLNRVCYEE6XFN36MJOU5MOVFUYYSPBYG&starting_balance=1000;&source_account=;&$operation_type=payment&params$destination=GD4F2N2OM2IM4MI6F6J5GVENQLNRVCYEE6XFN36MJOU5MOVFUYYSPBYG&asset$code=&issuer=&type=native;&amount=100;&source_account=;;&isValid$params:true&operations:true;;&sign$activeView=overview&importXdr=AAAAAgAAAAA55ZjOXdOOulfzeLPXjLDLdplq//5HGjapWAXjGSkdAkwAAAGQADQioAAAAAQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAD4XTdOZpDOMR4vk9NUjYLbGosEJ65W78xLqdY6paYxJwAAAAJUC+QAAAAAAAAAAAA=;;",
    params: {
      source_account:
        "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG",
      fee: "100",
      seq_num: "3668692344766465",
      cond: { time: { min_time: "", max_time: "" } },
      memo: {},
    },
    operations: [
      {
        operation_type: "create_account",
        params: {
          destination:
            "GD4F2N2OM2IM4MI6F6J5GVENQLNRVCYEE6XFN36MJOU5MOVFUYYSPBYG",
          starting_balance: "1000",
        },
        source_account: "",
      },
      {
        operation_type: "payment",
        params: {
          destination:
            "GD4F2N2OM2IM4MI6F6J5GVENQLNRVCYEE6XFN36MJOU5MOVFUYYSPBYG",
          asset: { code: "", issuer: "", type: "native" },
          amount: "100",
        },
        source_account: "",
      },
    ],
  },
  // Soroban Transaction
  {
    timestamp: 1737143650128,
    network: { id: "testnet", label: "Testnet" },
    name: "Extend to TTL",
    xdr: "AAAAAgAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAtwUABiLjAAAAGQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGQAAAAAAAHUwAAAAAQAAAAAAAAABAAAABgAAAAEg/u86MzPrVcpNrsFUa84T82Kss8DLAE9ZMxLqhM22HwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtqEAAAAA",
    page: "build",
    shareableUrl:
      "http://localhost:3000/transaction/build?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&transaction$build$params$source_account=GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG&seq_num=1727208213184537;&operations@$operation_type=payment&params$destination=GAQ6LVQXNRX26CBIKCYGGGD6B4SNQACTJ46QMHS4Q5S52UHZW76XJJPJ&asset$code=&issuer=&type=native;&amount=5;&source_account=;;&isValid$params:true&operations:true;&soroban$operation$operation_type=extend_footprint_ttl&params$durability=persistent&contract=CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S&key_xdr=AAAAEAAAAAEAAAACAAAADwAAAAdDb3VudGVyAAAAABIAAAAAAAAAAH5MvQcuICNqcxGfJ6rKFvwi77h3WDZ2XVzA+LVRkCKD&extend_ttl_to=30000&resource_fee=46753;;",
    params: {
      source_account:
        "GB7EZPIHFYQCG2TTCGPSPKWKC36CF35YO5MDM5S5LTAPRNKRSARIHWGG",
      fee: "100",
      seq_num: "1727208213184537",
      cond: { time: { min_time: "", max_time: "" } },
      memo: {},
    },
    operations: [
      {
        operation_type: "extend_footprint_ttl",
        params: {
          durability: "persistent",
          contract: "CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S",
          key_xdr:
            "AAAAEAAAAAEAAAACAAAADwAAAAdDb3VudGVyAAAAABIAAAAAAAAAAH5MvQcuICNqcxGfJ6rKFvwi77h3WDZ2XVzA+LVRkCKD",
          extend_ttl_to: "30000",
          resource_fee: "46753",
        },
        source_account: "",
      },
    ],
  },
  {
    timestamp: 1737148428325,
    network: { id: "testnet", label: "Testnet" },
    name: "Extend TTL",
    xdr: "AAAAAgAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAtwUABiLjAAAAGQAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAGQAAAAAAAHUwAAAAAQAAAAAAAAABAAAABgAAAAEg/u86MzPrVcpNrsFUa84T82Kss8DLAE9ZMxLqhM22HwAAABAAAAABAAAAAgAAAA8AAAAHQ291bnRlcgAAAAASAAAAAAAAAAB+TL0HLiAjanMRnyeqyhb8Iu+4d1g2dl1cwPi1UZAigwAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAtqEAAAABUZAigwAAAEADYbntiznotYPblvJQ35DiGEpMTQU9jCYANxV18VVGV6zDFSjB+qK++dF656Pr4oMTpyBVvE15YSo6ITxR5DoE",
    page: "submit",
    shareableUrl: "http://localhost:3000/transaction/submit?$=;;",
  },
];

const SAVED_CONTRACT_IDS = [
  {
    timestamp: 1746637724982,
    network: { id: "testnet", label: "Testnet" },
    name: "Contract 1",
    contractId: SAVED_CONTRACT_1,
    shareableUrl: `http://localhost:3000/smart-contracts/contract-explorer?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&smartContracts$explorer$contractId=${SAVED_CONTRACT_1};;`,
  },
  {
    timestamp: 1746637746246,
    network: { id: "testnet", label: "Testnet" },
    name: "Contract 2",
    contractId: SAVED_CONTRACT_2,
    shareableUrl: `http://localhost:3000/smart-contracts/contract-explorer?$=network$id=testnet&label=Testnet&horizonUrl=https:////horizon-testnet.stellar.org&rpcUrl=https:////soroban-testnet.stellar.org&passphrase=Test%20SDF%20Network%20/;%20September%202015;&smartContracts$explorer$contractId=${SAVED_CONTRACT_2};;`,
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
        {
          name: "stellar_lab_saved_transactions",
          value: JSON.stringify(SAVED_TRANSACTIONS),
        },
        {
          name: "stellar_lab_saved_contract_ids",
          value: JSON.stringify(SAVED_CONTRACT_IDS),
        },
      ],
    },
  ],
};
