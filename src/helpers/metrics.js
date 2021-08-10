/**
 * @prettier
 */
import throttle from "lodash/throttle";

const METRICS_ENDPOINT = "https://api.amplitude.com/2/httpapi";
let cache = [];

const uploadMetrics = throttle(() => {
  const toUpload = cache;
  cache = [];
  if (!process.env.AMPLITUDE_KEY) {
    // eslint-disable-next-line no-console
    console.log("Not uploading metrics", toUpload);
    return;
  }
  fetch(METRICS_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      api_key: process.env.AMPLITUDE_KEY,
      events: toUpload,
    }),
  });
}, 500);

const getUserId = () => {
  const storedId = localStorage.getItem("metrics_user_id");
  if (!storedId) {
    // Create a random ID by taking the decimal portion of a random number
    const newId = Math.random()
      .toString()
      .split(".")[1];
    localStorage.setItem("metrics_user_id", newId);
    return newId;
  }
  return storedId;
};

export function logEvent(type, properties) {
  cache.push({
    /* eslint-disable camelcase */
    event_type: type,
    event_properties: properties,
    user_id: getUserId(),
    device_id: window.navigator.userAgent,
    /* eslint-enable camelcase */
  });
  uploadMetrics();
}

const eventHandlers = [];

export function addEventHandler(handler) {
  eventHandlers.push(handler);
}

export function broadcastEvent(state, action) {
  eventHandlers.forEach((handler) => {
    handler(state, action);
  });
}
