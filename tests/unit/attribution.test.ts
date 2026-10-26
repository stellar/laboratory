import {
  ATTRIBUTION_STORAGE_KEY,
  captureAttribution,
  getAttribution,
  getUtmParams,
} from "@/metrics/attribution";

const UTM = "utm_source=neevai&utm_medium=chat&utm_campaign=stellar-lab-chat";
const STATE = "$=network$id=testnet&label=Testnet;;";

const NEEVAI = {
  utm_source: "neevai",
  utm_medium: "chat",
  utm_campaign: "stellar-lab-chat",
};

const createStorage = () => {
  const data: Record<string, string> = {};

  return {
    data,
    getItem: (key: string) => (key in data ? data[key] : null),
    setItem: (key: string, value: string) => {
      data[key] = value;
    },
  };
};

let storage: ReturnType<typeof createStorage>;

beforeEach(() => {
  storage = createStorage();
  (global as any).window = { sessionStorage: storage };
});

afterEach(() => {
  delete (global as any).window;
});

describe("getUtmParams", () => {
  it("reads UTM params", () => {
    expect(getUtmParams(`?${UTM}`)).toEqual(NEEVAI);
  });

  it("reads UTM params before or after the store state", () => {
    expect(getUtmParams(`?${UTM}&${STATE}`)).toEqual(NEEVAI);
    expect(getUtmParams(`?${STATE}&${UTM}`)).toEqual(NEEVAI);
  });

  it("returns null without utm_source", () => {
    expect(getUtmParams("")).toBeNull();
    expect(getUtmParams(`?${STATE}`)).toBeNull();
    expect(getUtmParams("?utm_medium=chat&utm_campaign=x")).toBeNull();
    expect(getUtmParams("?utm_source=%20%20")).toBeNull();
  });

  it("keeps only known UTM params", () => {
    expect(
      getUtmParams("?utm_source=neevai&utm_term=secret&utm_content=x&foo=bar"),
    ).toEqual({ utm_source: "neevai" });
  });

  it("trims and caps values", () => {
    const long = "a".repeat(300);

    expect(
      getUtmParams(`?utm_source=%20neevai%20&utm_campaign=${long}`),
    ).toEqual({ utm_source: "neevai", utm_campaign: "a".repeat(100) });
  });
});

describe("captureAttribution", () => {
  it("saves UTM params and the landing path", () => {
    captureAttribution(`?${UTM}&${STATE}`, "/network-limits");

    expect(JSON.parse(storage.data[ATTRIBUTION_STORAGE_KEY])).toEqual({
      ...NEEVAI,
      landing_path: "/network-limits",
    });
  });

  it("keeps saved attribution when landing without UTM params", () => {
    captureAttribution(`?${UTM}`, "/network-limits");
    captureAttribution(`?${STATE}`, "/xdr/view");

    expect(getAttribution()).toEqual({
      ...NEEVAI,
      landing_path: "/network-limits",
    });
  });

  it("replaces saved attribution on a new UTM landing", () => {
    captureAttribution(`?${UTM}`, "/network-limits");
    captureAttribution("?utm_source=newsletter", "/xdr/view");

    expect(getAttribution()).toEqual({
      utm_source: "newsletter",
      landing_path: "/xdr/view",
    });
  });

  it("doesn't throw when storage is unavailable", () => {
    (global as any).window = {
      get sessionStorage() {
        throw new Error("SecurityError");
      },
    };

    expect(() => captureAttribution(`?${UTM}`, "/")).not.toThrow();
  });
});

describe("getAttribution", () => {
  it("returns an empty object when nothing is saved", () => {
    expect(getAttribution()).toEqual({});
  });

  it("returns an empty object for invalid saved data", () => {
    storage.setItem(ATTRIBUTION_STORAGE_KEY, "{not json");
    expect(getAttribution()).toEqual({});

    storage.setItem(ATTRIBUTION_STORAGE_KEY, '"neevai"');
    expect(getAttribution()).toEqual({});
  });

  it("drops unknown and non-string fields", () => {
    storage.setItem(
      ATTRIBUTION_STORAGE_KEY,
      JSON.stringify({ utm_source: "neevai", utm_medium: 1, network: "x" }),
    );

    expect(getAttribution()).toEqual({ utm_source: "neevai" });
  });

  it("returns an empty object when storage is unavailable", () => {
    (global as any).window = {
      get sessionStorage() {
        throw new Error("SecurityError");
      },
    };

    expect(getAttribution()).toEqual({});
  });
});
