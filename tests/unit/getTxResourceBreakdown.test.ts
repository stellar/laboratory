import { getTxResourceBreakdown } from "../../src/helpers/getTxResourceBreakdown";
import { normalizeNetworkLimits } from "../../src/query/external/useBackendNetworkLimits";
import { TX_RESPONSE_SOROBAN } from "./mock/txResponse";
import { MOCK_NETWORK_LIMITS_MAINNET } from "../mock/networkLimits";

const LIMITS = normalizeNetworkLimits(MOCK_NETWORK_LIMITS_MAINNET);

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
      getTxResourceBreakdown(LIMITS, responseWithEvent(V27_EVENT)).memory_usage,
    ).toBe(1024);
  });

  it("reads memory usage from a v28 `type` event", () => {
    expect(
      getTxResourceBreakdown(LIMITS, responseWithEvent(V28_EVENT)).memory_usage,
    ).toBe(1024);
  });
});

describe("getTxResourceBreakdown() network limits", () => {
  it("computes limits and usage when limits are provided", () => {
    const result = getTxResourceBreakdown(LIMITS, responseWithEvent(V28_EVENT));

    expect(result.memory_usage_network_limit).toBe(LIMITS.tx_memory_limit);
    expect(result.memory_usage_usage_percent).toBe(
      `${((1024 / LIMITS.tx_memory_limit) * 100).toFixed(2)}%`,
    );
    expect(result.instructions_network_limit).toBe(400000000);
  });

  it("leaves limits and usage undefined when limits are unavailable", () => {
    const result = getTxResourceBreakdown(
      undefined,
      responseWithEvent(V28_EVENT),
    );

    expect(result.memory_usage).toBe(1024);
    expect(result.memory_usage_network_limit).toBeUndefined();
    expect(result.memory_usage_network_limit_display).toBeUndefined();
    expect(result.memory_usage_usage_percent).toBeUndefined();
    expect(result.footprint_keys_total_network_limit_display).toBeUndefined();
  });
});

describe("normalizeNetworkLimits()", () => {
  it("converts numeric string fields to numbers", () => {
    expect(LIMITS.tx_max_instructions).toBe(400000000);
    expect(LIMITS.ledger_max_instructions).toBe(
      Number(MOCK_NETWORK_LIMITS_MAINNET.ledger_max_instructions),
    );
    expect(typeof LIMITS.fee_rate_per_instructions_increment).toBe("number");
    expect(LIMITS.fee_disk_read_1kb).toBe(
      MOCK_NETWORK_LIMITS_MAINNET.fee_disk_read_1kb,
    );
  });
});
