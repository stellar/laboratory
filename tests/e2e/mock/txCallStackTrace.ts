import { DiagnosticEventJson } from "@/helpers/formatDiagnosticEvents";
import { AnyObject } from "@/types/types";

/**
 * Mock `getTransaction` RPC responses for the Call stack trace tab e2e tests.
 *
 * The `diagnosticEventsJson` payloads below are hand-trimmed slices modelled on
 * real diagnostic-event output. Each one is the smallest sequence that triggers
 * the behavior under test (empty / success / partial-fail / all-fail / long
 * params), so the fixtures stay small and each maps clearly to one assertion.
 */

// Representative strkeys (valid format) reused across fixtures.
const ACCOUNT_G = "GBCPQMFNL6VMHHF4QGDAEXXTVUV3MXOVSQWLBETNRJTKPMB7QTOFFCG5";
const CONTRACT_C = "CAM7DY53G63XA4AJRS24Z6VFYAFSSF76C3RZ45BE5YU3FQS5255OOABP";
const CONTRACT_C2 = "CAS3J7GYLGXMF6TDJBBYYSE3HQ6BBSMLNUQ34T6TZMYMW2EVH34XOWMA";
const FN_HASH =
  "19f1e3bb37b77070098cb5ccfaa5c00b2917fe16e39e7424ee29b2c25dd77ae7";

// A minimal Soroban (invoke_host_function) envelope so the dashboard treats the
// loaded transaction as a Soroban tx and renders the Call stack trace tab.
const baseResult = {
  latestLedger: 59816335,
  latestLedgerCloseTime: "1762960737",
  oldestLedger: 59695376,
  oldestLedgerCloseTime: "1762261943",
  status: "SUCCESS",
  applicationOrder: 1,
  feeBump: false,
  envelopeJson: {
    tx: {
      tx: {
        source_account: ACCOUNT_G,
        fee: 100,
        seq_num: "1",
        cond: "none",
        memo: "none",
        operations: [
          {
            source_account: null,
            body: {
              invoke_host_function: {
                host_function: {
                  invoke_contract: {
                    contract_address: CONTRACT_C,
                    function_name: "swap",
                    args: [],
                  },
                },
                auth: [],
              },
            },
          },
        ],
        ext: "v0",
      },
      signatures: [],
    },
  },
  resultJson: {},
  resultMetaJson: [],
};

/**
 * Wraps a `diagnosticEventsJson` payload in a full `getTransaction` response,
 * giving each fixture a unique `txHash` (the dashboard reads it back when the
 * "Load transaction" button is clicked).
 */
const makeResponse = (
  txHash: string,
  diagnosticEventsJson: DiagnosticEventJson[],
) => ({
  jsonrpc: "2.0",
  id: 1,
  result: {
    ...baseResult,
    txHash,
    diagnosticEventsJson,
  },
});

// A diagnostic fn_call event. Defaults to a successful contract call.
const fnCall = ({
  name,
  data,
  contractId = null,
  isSuccess = true,
}: {
  name: string;
  data: AnyObject | string;
  contractId?: string | null;
  isSuccess?: boolean;
}): DiagnosticEventJson => ({
  in_successful_contract_call: isSuccess,
  event: {
    ext: "v0",
    contract_id: contractId,
    type_: "diagnostic",
    body: {
      v0: {
        topics: [{ symbol: "fn_call" }, { bytes: FN_HASH }, { symbol: name }],
        data,
      },
    },
  },
});

// A diagnostic fn_return event closing a previously opened fn_call.
const fnReturn = ({
  name,
  data,
  contractId = null,
}: {
  name: string;
  data: AnyObject | string;
  contractId?: string | null;
}): DiagnosticEventJson => ({
  in_successful_contract_call: true,
  event: {
    ext: "v0",
    contract_id: contractId,
    type_: "diagnostic",
    body: {
      v0: {
        topics: [{ symbol: "fn_return" }, { symbol: name }],
        data,
      },
    },
  },
});

// =============================================================================
// Fixtures
// =============================================================================

// Empty: no diagnostic events -> empty-state message.
export const CST_EMPTY = makeResponse(
  "aaaa000000000000000000000000000000000000000000000000000000000001",
  [],
);

// Success: a top-level call with one nested call (chevron expand/collapse),
// an account address param (stellar.expert account link) and a nested call on
// a contract (contract-explorer link). All calls succeed -> no alert.
export const CST_SUCCESS = makeResponse(
  "aaaa000000000000000000000000000000000000000000000000000000000002",
  [
    fnCall({
      name: "swap",
      contractId: null,
      data: { vec: [{ address: ACCOUNT_G }, { i128: "100" }] },
    }),
    fnCall({
      name: "transfer",
      contractId: CONTRACT_C,
      data: { vec: [{ i128: "50" }] },
    }),
    fnReturn({ name: "transfer", data: "void" }),
    fnReturn({ name: "swap", data: { i128: "150" } }),
  ],
);

// Partial failure: one successful call, one failed nested call ->
// errorLevel "some" -> yellow "Transaction partially failed" alert.
export const CST_PARTIAL_FAIL = makeResponse(
  "aaaa000000000000000000000000000000000000000000000000000000000003",
  [
    fnCall({ name: "outer", data: { vec: [{ i128: "1" }] } }),
    fnCall({
      name: "inner",
      contractId: CONTRACT_C,
      data: { vec: [{ i128: "2" }] },
      isSuccess: false,
    }),
  ],
);

// All failed: every call fails -> errorLevel "all" ->
// red "Transaction failed" alert.
export const CST_ALL_FAIL = makeResponse(
  "aaaa000000000000000000000000000000000000000000000000000000000004",
  [
    fnCall({ name: "outer", data: { vec: [{ i128: "1" }] }, isSuccess: false }),
    fnCall({
      name: "inner",
      contractId: CONTRACT_C,
      data: { vec: [{ i128: "2" }] },
      isSuccess: false,
    }),
  ],
);

// Long params: a single call whose params vec holds 7 primitive values. The
// collapsed-params view truncates to 4 primitives and appends an ellipsis.
export const CST_LONG_PARAMS = makeResponse(
  "aaaa000000000000000000000000000000000000000000000000000000000005",
  [
    fnCall({
      name: "remove_liquidity",
      data: {
        vec: [
          { address: CONTRACT_C2 },
          { address: CONTRACT_C },
          { i128: "3920309" },
          { i128: "5000000" },
          { i128: "1000000" },
          { address: ACCOUNT_G },
          { u64: "1767119444" },
        ],
      },
    }),
  ],
);
