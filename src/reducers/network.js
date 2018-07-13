import {combineReducers} from "redux";
import {CHOOSE_NETWORK, SET_PARAMS, SHOW_MODAL, HIDE_MODAL, UPDATE_MODAL} from "../actions/network";
import NETWORK from '../constants/network';
import {LOAD_STATE} from '../actions/routing';

let defaultNetwork = {
  name: NETWORK.defaultName,
  horizonURL: NETWORK.available[NETWORK.defaultName].horizonURL,
  networkPassphrase: NETWORK.available[NETWORK.defaultName].networkPassphrase
};

let current = (state=defaultNetwork, action) => {
  switch(action.type) {
    case LOAD_STATE:
      if (action.queryObj.network == "custom") {
        return {
          name: action.queryObj.network,
          horizonURL: action.queryObj.horizonURL,
          networkPassphrase: action.queryObj.networkPassphrase
        }
      }

      if (action.queryObj.network && NETWORK.available[action.queryObj.network]) {
        return Object.assign({name: action.queryObj.network}, NETWORK.available[action.queryObj.network]);
      }
      return state;
    case SET_PARAMS:
      return action.params;
    default:
      return state;
  }
}

function modal(state={visible: false, values: {}}, action) {
  switch(action.type) {
    case SHOW_MODAL:
      return Object.assign({}, state, {visible: true});
    case HIDE_MODAL:
      return Object.assign({}, state, {visible: false});
    case SET_PARAMS:
      return {visible: false, values: Object.assign({}, action.params)};
    case UPDATE_MODAL:
      let values = state.values;
      values[action.key] = action.value
      return {visible: true, values};
    default:
      return state;
  }
}

const network = combineReducers({
  current,
  modal
});

export default network;
