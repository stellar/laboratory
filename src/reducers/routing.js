import {combineReducers} from 'redux';
import {UPDATE_LOCATION} from '../actions/routing';
import url from 'url';

const routing = combineReducers({
  location,
});

export default routing;

function location(state = '', action) {
  if (action.type === UPDATE_LOCATION) {
    return action.location;
  }
  return state;
}
