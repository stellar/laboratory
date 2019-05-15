import {broadcastEvent} from '../utilities/metrics'

const metrics = store => next => action => {
  // Disable metrics for the time being
  // broadcastEvent(store.getState(), action)
  return next(action)
}

export default metrics
