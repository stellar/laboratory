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
      ],
    },
  ],
};
