import {UPDATE_LOCATION} from '../actions/routing'
import {logEvent} from '../utilities/metrics'

const metricsEvents = {
  navigate: 'routing: changed page'
}

export default function networkMetrics(state, action) {
  const {type, ...payload} = action
  switch (type) {
    case UPDATE_LOCATION: {
      logEvent(metricsEvents.navigate, {
        path: payload.slug || ''
      })
    }
  }
}
