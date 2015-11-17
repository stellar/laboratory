import {combineReducers} from "redux";
import {CHOOSE_NETWORK, SET_NETWORKS} from "../actions/network";

const defaultNetworks = {
  test: 'https://horizon-testnet.stellar.org',
  public: 'https://horizon.stellar.org'
}

const defaultNetworkName = 'test';

const network = combineReducers({ current, available });

export default network;

function current(state=defaultNetworkName, action) {
  switch(action.type) {
    case CHOOSE_NETWORK:
      return action.name;
    default:
      return state;
  }
}

function available(state=defaultNetworks, action) {
  switch(action.type) {
  case SET_NETWORKS:
    return action.networks;
  default:
    return state;
  }
}
