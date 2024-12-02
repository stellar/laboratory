export const SAVED_ACCOUNT_1 =
  "GA46LGGOLXJY5OSX6N4LHV4MWDFXNGLK76I4NDNKKYAXRRSKI5AJGMXG";
export const SAVED_ACCOUNT_1_SECRET =
  "SADVGAH3VA3NGZ5VLX2ZICV7JQAINB2ZJZYOPMBXUNI3YRLGWLOA2OFY";
export const SAVED_ACCOUNT_2 =
  "GD4F2N2OM2IM4MI6F6J5GVENQLNRVCYEE6XFN36MJOU5MOVFUYYSPBYG";
export const SAVED_ACCOUNT_2_SECRET =
  "SDVMTXXSUJG6GKFCETCKFV6FCGE7C5FYKBCV4AMD4N3SRYCDSA53KEG4";

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
