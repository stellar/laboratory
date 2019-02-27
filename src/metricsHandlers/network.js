import {SET_PARAMS} from '../actions/network'
import {logEvent} from '../utilities/metrics'

const metricsEvents = {
  changeNetwork: 'pick network: changed horizon url'
}

export default function networkMetrics(state, action) {
  const {type, ...payload} = action
  switch (type) {
    case SET_PARAMS: {
      logEvent(metricsEvents.changeNetwork, {
        horizonUrl: payload.params.horizonURL
      })
    }
  }
}
