import * as amplitude from "@amplitude/analytics-browser";

declare global {
  interface Window {
    _env_: {
      AMPLITUDE_API_KEY: string;
    };
  }
}

export const initTracking = () => {
  if (!window._env_.AMPLITUDE_API_KEY) {
    return;
  }

  const options = {};
  amplitude.init(window._env_.AMPLITUDE_API_KEY, options);
};
