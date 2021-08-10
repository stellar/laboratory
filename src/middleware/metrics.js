import { broadcastEvent } from "../helpers/metrics";

const metrics = (store) => (next) => (action) => {
  broadcastEvent(store.getState(), action);
  return next(action);
};

export default metrics;
