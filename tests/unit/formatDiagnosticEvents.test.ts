import {
  DiagnosticEventJson,
  formatDiagnosticEvents,
} from "../../src/helpers/formatDiagnosticEvents";

const body = {
  v0: {
    topics: [{ symbol: "fn_call" }, { bytes: "aabb" }, { symbol: "transfer" }],
    data: { void: null },
  },
};

// XDR JSON v27 names the event type key `type_`; v28 renames it to `type`.
const V27_EVENT: DiagnosticEventJson = {
  in_successful_contract_call: true,
  event: { ext: "v0", contract_id: null, type_: "diagnostic", body },
};

const V28_EVENT: DiagnosticEventJson = {
  in_successful_contract_call: true,
  event: { ext: "v0", contract_id: null, type: "diagnostic", body },
};

describe("formatDiagnosticEvents() event type key", () => {
  it("reads the v27 `type_` key", () => {
    const { callStack } = formatDiagnosticEvents([V27_EVENT]);

    expect(callStack).toHaveLength(1);
    expect(callStack[0].type).toBe("fn_call");
    expect(callStack[0].name).toBe("transfer");
  });

  it("reads the v28 `type` key", () => {
    const { callStack } = formatDiagnosticEvents([V28_EVENT]);

    expect(callStack).toHaveLength(1);
    expect(callStack[0].type).toBe("fn_call");
    expect(callStack[0].name).toBe("transfer");
  });
});
