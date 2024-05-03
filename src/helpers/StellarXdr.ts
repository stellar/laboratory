// TODO: replace with package once published
import wasm, { decode, encode } from "bindings-js";

declare global {
  interface Window {
    __STELLAR_XDR_INIT__?: boolean;
  }
}

const init = async () => {
  if (!window.__STELLAR_XDR_INIT__) {
    await wasm();
    window.__STELLAR_XDR_INIT__ = true;
  }
};

export { init, decode, encode };
