import { parse, stringify } from "zustand-querystring";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";
import { buildEndpointHref } from "@/helpers/buildEndpointHref";
import { getQueryStringState } from "@/helpers/getQueryStringState";
import { shareableUrl } from "@/helpers/shareableUrl";
import { Routes } from "@/constants/routes";
import { createStore } from "@/store/createStore";

const UTM = "utm_source=neevai&utm_medium=chat&utm_campaign=stellar-lab-chat";

const network = {
  id: "futurenet",
  label: "Futurenet",
  horizonUrl: "https://horizon-futurenet.stellar.org",
  rpcUrl: "https://rpc-futurenet.stellar.org",
  passphrase: "Test SDF Future Network ; October 2022",
};
const stateQuery = `$=${stringify({ network, xdr: { blob: "AAAA" } })};;`;

const setLocation = (search: string) => {
  (global as any).window = {
    location: {
      origin: "https://lab.stellar.org",
      pathname: "/xdr/view",
      search,
    },
  };
};

/** Parses the `$=` state out of a href built by the helpers. */
const getHrefState = (href: string) =>
  parse(href.split("?$=")[1].replace(/;;$/, ""));

afterEach(() => {
  delete (global as any).window;
});

describe.each([
  ["state first", `?${stateQuery}&${UTM}`],
  ["UTM params first", `?${UTM}&${stateQuery}`],
])("query string helpers (%s)", (_, search) => {
  beforeEach(() => {
    setLocation(search);
  });

  it("buildEndpointHref keeps the network", () => {
    const href = buildEndpointHref(Routes.ENDPOINTS_GET_TRANSACTIONS, {
      limit: "5",
    });

    expect(href.startsWith(`${Routes.ENDPOINTS_GET_TRANSACTIONS}?$=`)).toBe(
      true,
    );
    expect(href).not.toContain("utm_");
    expect(getHrefState(href)).toEqual({
      network,
      endpoints: { params: { limit: "5" } },
    });
  });

  it("buildContractExplorerHref keeps the network", () => {
    const href = buildContractExplorerHref("CABC");

    expect(href).not.toContain("utm_");
    expect(getHrefState(href)).toEqual({
      network,
      smartContracts: { explorer: { contractId: "CABC" } },
    });
  });

  it("shareableUrl keeps the network and drops UTM params", () => {
    const url = shareableUrl("transactions-save");

    expect(url.startsWith("https://lab.stellar.org/xdr/view?$=")).toBe(true);
    expect(url).not.toContain("utm_");
    expect(getHrefState(url)).toEqual({ network, xdr: { blob: "AAAA" } });
  });
});

describe("getQueryStringState matches the store", () => {
  it("reads the same network the store initializes from the URL", () => {
    const url = `/xdr/view?${UTM}&${stateQuery}`;
    const store = createStore({ url });

    expect(store.getState().network).toEqual(getQueryStringState(url)?.network);
  });
});
