import { SAVED_ACCOUNT_1 } from "./localStorage";

export const MOCK_CONTRACT_ID =
  "C000NO6F7FRDHSOFQBT2L2UWYIZ2PU76JKVRYAQTG3KZSQLYAOKIF2WB";
export const MOCK_CONTRACT_INFO_RESPONSE_SUCCESS = {
  contract: MOCK_CONTRACT_ID,
  account: MOCK_CONTRACT_ID,
  created: 1731402776,
  creator: SAVED_ACCOUNT_1,
  payments: 300,
  trades: 0,
  wasm: "df88820e231ad8f3027871e5dd3cf45491d7b7735e785731466bfc2946008608",
  storage_entries: 10,
  validation: {
    status: "verified",
    repository: "https://github.com/test-org/test-repo",
    commit: "391f37e39a849ddf7543a5d7f1488e055811cb68",
    ts: 1731402776,
  },
};
