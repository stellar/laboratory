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
import {rehydrate} from '../utilities/hydration';
import SLUG from '../constants/slug';

function currentResource(state="", action) {
  switch (action.type) {
    case LOAD_STATE:
      if (action.slug === SLUG.EXPLORER && action.queryObj.resource) {
        return action.queryObj.resource;
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
    if (action.slug === SLUG.EXPLORER && action.queryObj.endpoint) {
      return action.queryObj.endpoint;
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
  if (action.slug === SLUG.EXPLORER && action.queryObj.values) {
    return rehydrate(action.queryObj.values);
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

const blankResults = {
  id: null,
  available: false,
  body: [],
};
function results(state, action) {
  if (typeof state === 'undefined') {
    return blankResults;
  }

  // Clear the results when a change to the explorer happens
  switch (action.type) {
    case LOAD_STATE:
      if (action.slug === SLUG.EXPLORER) {
        return blankResults;
      }
      return state;
    case CHOOSE_ENDPOINT:
    case UPDATE_VALUE:
      return blankResults;
  }

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
    let errorContent;
    if (action.errorStatus === 0) {
      errorContent = 'Unable to reach Horizon server.';
    } else {
      errorContent = JSON.stringify(action.body, null, 2);
    }

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
