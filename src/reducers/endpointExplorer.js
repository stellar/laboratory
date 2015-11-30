import {combineReducers} from "redux";
import {
  CHOOSE_ENDPOINT,
  CHANGE_PENDING_REQUEST_PROPS,
  START_REQUEST,
  FINISH_REQUEST,
} from "../actions/endpointExplorer";
import {getTemplate} from '../endpoints';

const endpointExplorer = combineReducers({
  currentResource,
  currentEndpoint,
  pendingRequest: combineReducers({
    pendingRequestTemplate,
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
    return getTemplate(action.resouce, action.endpoint) || "";
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
