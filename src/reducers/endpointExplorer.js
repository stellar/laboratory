import {combineReducers} from "redux";
import {
  CHOOSE_ENDPOINT,
  CHANGE_PENDING_REQUEST_PROPS,
  START_REQUEST,
  FINISH_REQUEST,
  UPDATE_VALUE,
} from "../actions/endpointExplorer";
import {getEndpoint, getTemplate} from '../data/endpoints';

const endpointExplorer = combineReducers({
  currentResource,
  currentEndpoint,
  pendingRequest: combineReducers({
    template: pendingRequestTemplate,
    values: pendingRequestValues,
    props: identity({}),
  }),
  currentRequest
});

export default endpointExplorer

function currentResource(state="", action) {
  switch (action.type) {
    case CHOOSE_ENDPOINT:
      return action.resource;
    default:
      return state;
  }
}

function currentEndpoint(state="", action) {
  switch (action.type) {
  case CHOOSE_ENDPOINT:
    return action.endpoint;
  default:
    return state;
  }
}

function identity(initial) {
  return (state=initial, action) => state;
}

function pendingRequestTemplate(state="", action) {
  switch (action.type) {
  case CHOOSE_ENDPOINT:
    return getTemplate(action.resource, action.endpoint) || "";
  default:
    return state;
  }
}

function pendingRequestValues(state={}, action) {
  switch (action.type) {
  case UPDATE_VALUE:
    return Object.assign({}, state, {
      [action.param]: action.value
    });
  case CHOOSE_ENDPOINT:
    return {};
  default:
    return state;
  }
}

function currentRequest(state={isLoading: false}, action) {
  switch (action.type) {
  case START_REQUEST:
    return Object.assign({}, state, {isLoading: true});
  case FINISH_REQUEST:
    let {error, payload} = action;

    return Object.assign({}, state, {isLoading: false, response: payload, error});
  default:
    return state;
  }
}
