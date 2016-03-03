import {combineReducers} from "redux";
import {
  CHOOSE_ENDPOINT,
  CHANGE_PENDING_REQUEST_PROPS,
  START_REQUEST,
  ERROR_REQUEST,
  UPDATE_REQUEST,
  UPDATE_VALUE,
} from "../actions/endpointExplorer";
import {LOAD_STATE} from '../actions/routing';
import {getEndpoint, getTemplate} from '../data/endpoints';
import SLUG from '../constants/slug';

const endpointExplorer = combineReducers({
  currentResource,
  currentEndpoint,
  pendingRequest: combineReducers({
    template: pendingRequestTemplate,
    values: pendingRequestValues,
  }),
  results
});

export default endpointExplorer

function currentResource(state="", action) {
  switch (action.type) {
    case LOAD_STATE:
      if (action.slug === SLUG.EXPLORER && action.payload.resource) {
        return action.payload.resource;
      }
      break;
    case CHOOSE_ENDPOINT:
      return action.resource;
  }
  return state;
}

function currentEndpoint(state="", action) {
  switch (action.type) {
  case LOAD_STATE:
    if (action.slug === SLUG.EXPLORER && action.payload.endpoint) {
      return action.payload.endpoint;
    }
    break;
  case CHOOSE_ENDPOINT:
    return action.endpoint;
  }
  return state;
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
  case LOAD_STATE:
  if (action.slug === SLUG.EXPLORER && action.payload.values) {
    return action.payload.values;
  }
  break;
  case UPDATE_VALUE:
    return Object.assign({}, state, {
      [action.param]: action.value
    });
  case CHOOSE_ENDPOINT:
    return {};
  }
  return state;
}

function results(state={id: null, available: false, body: []}, action) {
  if (action.type === START_REQUEST) {
    return Object.assign({}, state, {
      available: true,
      id: action.id,
      isError: false,
      body: [],
    });
  }

  if (action.id !== state.id) {
    // This action has expired as we've moved on to a new request
    // Or, this is likely an irrelevant action
    return state;
  }

  if (action.type === ERROR_REQUEST) {
    let errorContent = action.errorStatus === 0 ?
      'Unable to reach Horizon server.'
      :
      JSON.stringify(action.body, null, 2);

    return Object.assign({}, state, {
      isError: true,
      body: [errorContent],
    });
  }

  if (action.type === UPDATE_REQUEST) {
    return Object.assign({}, state, {
      body: [].concat(state.body, JSON.stringify(action.body, null, 2)),
    });
  }

  return state;
}
