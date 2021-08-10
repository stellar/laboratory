import { combineReducers } from "redux";
import url from "url";
import { UPDATE_LOCATION, LOAD_STATE } from "../actions/routing";

const routing = combineReducers({
  location,
});

export default routing;

function location(state = "", action) {
  switch (action.type) {
    case UPDATE_LOCATION:
    case LOAD_STATE:
      if (action.slug === null) {
        return "";
      }
      return action.slug;
  }
  return state;
}
