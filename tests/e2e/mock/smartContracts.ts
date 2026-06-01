import { SAVED_ACCOUNT_1 } from "./localStorage";

export const MOCK_CONTRACT_ID =
  "CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S";
export const MOCK_CONTRACT_INFO_RESPONSE_SUCCESS = {
  contract: MOCK_CONTRACT_ID,
  account: MOCK_CONTRACT_ID,
  created: 1731402776,
  creator: SAVED_ACCOUNT_1,
  payments: 300,
  trades: 0,
  wasm: "a0db88b6da6f83bf1c2c8fafcc8fa9cf9d2abc7f8507d831d086aa2c6ad5fc1b",
  storage_entries: 10,
  validation: {
    status: "verified_build",
    repository: "https://github.com/test-org/test-repo",
    commit: "391f37e39a849ddf7543a5d7f1488e055811cb68",
    ts: 1731402776,
  },
};
export const MOCK_CONTRACT_INFO_CONTRACT_TYPE_SUCCESS = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    entries: [
      {
        key: "AAAABgAAAAFNF3bsfk81mNAeWgYbRwNmWHwUfY/TjKFsDjCOwpVi0AAAABQAAAAB",
        xdr: "AAAABgAAAAAAAAABTRd27H5PNZjQHloGG0cDZlh8FH2P04yhbA4wjsKVYtAAAAAUAAAAAQAAABMAAAAAoNuIttpvg78cLI+vzI+pz50qvH+FB9gx0IaqLGrV/BsAAAABAAAAAwAAAA8AAAAITUVUQURBVEEAAAARAAAAAQAAAAMAAAAPAAAACGRlY2ltYWxzAAAAAwAAAAcAAAAPAAAABG5hbWUAAAAOAAAAClRlc3QgVG9rZW4AAAAAAA8AAAAGc3ltYm9sAAAAAAAOAAAAAlRUAAAAAAAQAAAAAQAAAAEAAAAPAAAABU93bmVyAAAAAAAAEgAAAAAAAAAA61JcZT1z2tHkfuOqHc+kAPOXo4xTCfiOCyOIsjoLxpMAAAAQAAAAAQAAAAEAAAAPAAAAC1RvdGFsU3VwcGx5AAAAAAoAAAAAAAAAAAAAAAC1WmRA",
        lastModifiedLedgerSeq: 245559,
        liveUntilLedgerSeq: 366382,
        extXdr: "AAAAAA==",
      },
    ],
    latestLedger: 245589,
  },
};
export const MOCK_CONTRACT_INFO_CONTRACT_TYPE_FAILURE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    entries: [],
    latestLedger: 245589,
  },
};

// A Stellar Asset Contract (SAC) contract id matching the executable XDR below
export const MOCK_SAC_CONTRACT_ID =
  "CAQP53Z2GMZ6WVOKJWXMCVDLZYJ7GYVMWPAMWACPLEZRF2UEZW3B636S";

// getLedgerEntries response whose val decodes to a ContractData entry with
// executable type contractExecutableStellarAsset (a SAC). Generated via the
// Stellar SDK from MOCK_SAC_CONTRACT_ID; tests rely on the resulting
// contractType so they can exercise the SAC-spec path in the Invoke contract
// tab without going through wasm decoding.
export const MOCK_SAC_CONTRACT_TYPE_RESPONSE = {
  jsonrpc: "2.0",
  id: 1,
  result: {
    entries: [
      {
        key: "AAAABgAAAAEg/u86MzPrVcpNrsFUa84T82Kss8DLAE9ZMxLqhM22HwAAABQAAAAB",
        xdr: "AAAABgAAAAAAAAABIP7vOjMz61XKTa7BVGvOE/NirLPAywBPWTMS6oTNth8AAAAUAAAAAQAAABMAAAABAAAAAA==",
        lastModifiedLedgerSeq: 245559,
        liveUntilLedgerSeq: 366382,
        extXdr: "AAAAAA==",
      },
    ],
    latestLedger: 245589,
  },
};
