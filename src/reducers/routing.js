import {combineReducers} from 'redux';
import {UPDATE_LOCATION} from '../actions/routing';
import url from 'url';

const routing = combineReducers({
  location,
});

export default routing;

function location(state, action) {
  if (typeof state === 'undefined') {
    // During first load, we want to reduce FOUC by bootstrapping here
    return url.parse(window.location.hash.substr(1)).pathname || '';
  }
  if (action.type === UPDATE_LOCATION) {
    return action.location;
  }
  return state;
}
