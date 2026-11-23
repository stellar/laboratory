import { stringify } from "zustand-querystring";
import { getQueryStringState } from "@/helpers/getQueryStringState";

const UTM = "utm_source=neevai&utm_medium=chat&utm_campaign=stellar-lab-chat";

const state = {
  network: {
    id: "testnet",
    label: "Testnet",
    rpcUrl: "https://soroban-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
  },
  xdr: { blob: "AAAA+/==" },
};
const stateQuery = `$=${stringify(state)};;`;

describe("getQueryStringState", () => {
  it("parses state at the start of the query string", () => {
    expect(getQueryStringState(`?${stateQuery}`)).toEqual(state);
  });

  it("parses state without the leading `?`", () => {
    expect(getQueryStringState(stateQuery)).toEqual(state);
  });

  it("parses state after UTM params", () => {
    expect(getQueryStringState(`?${UTM}&${stateQuery}`)).toEqual(state);
  });

  it("parses state before UTM params", () => {
    expect(getQueryStringState(`?${stateQuery}&${UTM}`)).toEqual(state);
  });

  it("parses state between other params", () => {
    expect(
      getQueryStringState(`?utm_source=neevai&${stateQuery}&utm_medium=chat`),
    ).toEqual(state);
  });

  it("keeps nested objects that produce `;;` mid-string", () => {
    const nested = {
      endpoints: { params: { limit: 5 } },
      network: { id: "testnet" },
    };

    expect(getQueryStringState(`?${UTM}&$=${stringify(nested)};;`)).toEqual(
      nested,
    );
  });

  it("parses state without the trailing `;;`", () => {
    expect(getQueryStringState("?$=network$id=testnet")).toEqual({
      network: { id: "testnet" },
    });
  });

  it("returns null when there is no state", () => {
    expect(getQueryStringState("")).toBeNull();
    expect(getQueryStringState("?")).toBeNull();
    expect(getQueryStringState(`?${UTM}`)).toBeNull();
  });
});
