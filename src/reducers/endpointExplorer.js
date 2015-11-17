import {combineReducers} from "redux";
import {
  CHOOSE_ENDPOINT,
  CHANGE_PENDING_REQUEST_PROPS,
  SUBMIT_PENDING_REQUEST,
} from "../actions/endpointExplorer";

const endpointExplorer = combineReducers({
  currentResource,
  currentEndpoint,
  pendingRequest: combineReducers({
    template: pendingRequestTemplate,
    props:    pendingRequestProps,
  })
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

function pendingRequestTemplate(state="", action) {
  return state;
}

function pendingRequestProps(state={}, action) {
  return state;
}
