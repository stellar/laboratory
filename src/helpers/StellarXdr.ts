import init, { decode, encode, guess } from "@stellar/stellar-xdr-json";

// A wrapper for the Stellar XDR JSON
declare global {
  interface Window {
    __STELLAR_XDR_INIT__?: boolean;
  }
}

const initialize = async () => {
  if (!window.__STELLAR_XDR_INIT__) {
    await init();
    window.__STELLAR_XDR_INIT__ = true;
  }
};

export { initialize, decode, encode, guess };
