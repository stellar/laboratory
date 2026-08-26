import { getTxResourceBreakdown } from "../../src/helpers/getTxResourceBreakdown";
import { TX_RESPONSE_SOROBAN } from "./mock/txResponse";

const body = {
  v0: {
    topics: [{ symbol: "core_metrics" }, { symbol: "mem_byte" }],
    data: { u64: 1024 },
  },
};

// XDR JSON v27 names the event type key `type_`; v28 renames it to `type`.
const V27_EVENT = {
  in_successful_contract_call: true,
  event: { ext: "v0", contract_id: null, type_: "diagnostic", body },
};

const V28_EVENT = {
  in_successful_contract_call: true,
  event: { ext: "v0", contract_id: null, type: "diagnostic", body },
};

// The mock supplies the required response fields the breakdown does not read.
const responseWithEvent = (event: object) => ({
  ...TX_RESPONSE_SOROBAN.result,
  diagnosticEventsJson: [event],
});

describe("getTxResourceBreakdown() core metrics event type key", () => {
  it("reads memory usage from a v27 `type_` event", () => {
    expect(
      getTxResourceBreakdown("testnet", responseWithEvent(V27_EVENT))
        .memory_usage,
    ).toBe(1024);
  });

  it("reads memory usage from a v28 `type` event", () => {
    expect(
      getTxResourceBreakdown("testnet", responseWithEvent(V28_EVENT))
        .memory_usage,
    ).toBe(1024);
  });
});
