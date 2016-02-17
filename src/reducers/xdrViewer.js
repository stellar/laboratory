import {combineReducers} from 'redux';
import {UPDATE_XDR_INPUT, UPDATE_XDR_TYPE} from '../actions/xdrViewer';
import url from 'url';

const routing = combineReducers({
  input,
  type,
});

export default routing;

function input(state = '', action) {
  if (action.type === UPDATE_XDR_INPUT) {
    return action.input;
  }
  return state;
}

function type(state = 'TransactionEnvelope', action) {
  if (action.type === UPDATE_XDR_TYPE) {
    return action.xdrType;
  }
  return state;
}
