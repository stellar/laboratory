import {broadcastEvent} from '../utilities/metrics'

const metrics = store => next => action => {
  broadcastEvent(store.getState(), action)
  return next(action)
}

export default metrics
