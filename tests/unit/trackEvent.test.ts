import * as amplitude from "@amplitude/analytics-browser";
import { ATTRIBUTION_STORAGE_KEY } from "@/metrics/attribution";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

jest.mock("@amplitude/analytics-browser", () => ({
  init: jest.fn(),
  track: jest.fn(),
  Types: { LogLevel: {} },
}));

const setWindow = (search: string, saved?: object) => {
  const data: Record<string, string> = saved
    ? { [ATTRIBUTION_STORAGE_KEY]: JSON.stringify(saved) }
    : {};

  (global as any).window = {
    __STELLAR_TRACKING_ENABLED__: true,
    location: { search },
    sessionStorage: {
      getItem: (key: string) => data[key] ?? null,
      setItem: jest.fn(),
    },
  };
};

afterEach(() => {
  delete (global as any).window;
  jest.clearAllMocks();
});

describe("trackEvent", () => {
  it("adds the network and saved attribution", () => {
    setWindow("?utm_source=neevai&$=network$id=futurenet;;", {
      utm_source: "neevai",
      utm_medium: "chat",
      landing_path: "/",
    });

    trackEvent(TrackingEvent.PAGE_VIEW, { path: "/xdr/view" });

    expect(amplitude.track).toHaveBeenCalledWith("page view", {
      network: "futurenet",
      utm_source: "neevai",
      utm_medium: "chat",
      landing_path: "/",
      path: "/xdr/view",
    });
  });

  it("doesn't add attribution when none is saved", () => {
    setWindow("?$=network$id=testnet;;");

    trackEvent(TrackingEvent.PAGE_VIEW, { path: "/" });

    expect(amplitude.track).toHaveBeenCalledWith("page view", {
      network: "testnet",
      path: "/",
    });
  });

  it("lets event properties override attribution", () => {
    setWindow("", { utm_source: "neevai" });

    trackEvent(TrackingEvent.HOME_TOP_BTN, { utm_source: "explicit" });

    expect(amplitude.track).toHaveBeenCalledWith("home: top btn", {
      network: undefined,
      utm_source: "explicit",
    });
  });

  it("doesn't track when tracking is disabled", () => {
    setWindow("", { utm_source: "neevai" });
    (global as any).window.__STELLAR_TRACKING_ENABLED__ = false;

    trackEvent(TrackingEvent.PAGE_VIEW, { path: "/" });

    expect(amplitude.track).not.toHaveBeenCalled();
  });
});
