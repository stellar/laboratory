import {
  CHOOSE_ENDPOINT,
  START_REQUEST,
  UPDATE_REQUEST,
  ERROR_REQUEST
} from '../actions/endpointExplorer'
import {logEvent} from '../utilities/metrics'

const metricsEvents = {
  changeResource: 'endpoint explorer: changed resource',
  changeEndpoint: 'endpoint explorer: changed endpoint',
  startRequest: 'endpoint explorer: request: start',
  requestFinish: 'endpoint explorer: request: success',
  requestError: 'endpoint explorer: request: failed',
  requestStream: 'endpoint explorer: request: stream message',
}

const getPayload = (state, action) => {

  const {
    pendingRequest, currentResource, currentEndpoint
  } = state.endpointExplorer
  const template = pendingRequest.template ?
    pendingRequest.template.template : ''

  return {
    template,
    resource: currentResource,
    endpoint: currentEndpoint
  }
}

export default function(state, action) {
  const {type, ...payload} = action
  switch (type) {
    case CHOOSE_ENDPOINT: {
      const {resource, endpoint} = payload;

      if (endpoint === '') {
        logEvent(metricsEvents.changeResource, {resource})
      } else {
        logEvent(metricsEvents.changeEndpoint, {resource, endpoint})
      }
      return;
    }
    case START_REQUEST: {
      logEvent(metricsEvents.startRequest, getPayload(state, action))
      return;
    }

    case UPDATE_REQUEST: {
      if (payload.isStreaming) {
        logEvent(metricsEvents.requestStream, getPayload(state, action));
      } else {
        logEvent(metricsEvents.requestFinish, getPayload(state, action));
      }
      return;
    }

    case ERROR_REQUEST: {
      const {extras = {}, detail = '', status = ''} = payload.body;
      logEvent(metricsEvents.requestError, {
        detail,
        extras: JSON.stringify(extras),
        status
      })
      return;
    }
  }
}
