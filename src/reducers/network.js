import {combineReducers} from "redux";
import {CHOOSE_NETWORK} from "../actions/network";
import NETWORK from '../constants/network';
import {LOAD_STATE} from '../actions/routing';

const network = combineReducers({ current });

export default network;

function current(state=NETWORK.defaultName, action) {
  switch(action.type) {
    case LOAD_STATE:
      const lsCurrentNetwork = localStorage.getItem('CURRENT_NETWORK');
      if (action.queryObj.network && NETWORK.available[action.queryObj.network]) {
        return action.queryObj.network;
      }
      if (lsCurrentNetwork) {
        return lsCurrentNetwork;
      }
      return state;
    case CHOOSE_NETWORK:
      localStorage.setItem('CURRENT_NETWORK', action.name);
      return action.name;
    default:
      return state;
  }
}
