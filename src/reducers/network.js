import {combineReducers} from "redux";
import {CHOOSE_NETWORK} from "../actions/network";
import NETWORK from '../constants/network';
import {LOAD_STATE} from '../actions/routing';

const network = combineReducers({ current });

export default network;

function current(state=NETWORK.defaultName, action) {
  switch(action.type) {
    case LOAD_STATE:
      if (NETWORK.available[action.payload.network]) {
        return action.payload.network;
      }
      return state;
    case CHOOSE_NETWORK:
      return action.name;
    default:
      return state;
  }
}
