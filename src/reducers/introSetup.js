import {combineReducers} from 'redux';
import {
  GENERATE_NEW_KEYPAIR,
  UPDATE_FRIENDBOT_TARGET,
  START_FRIENDBOT_REQUEST,
  FINISH_FRIENDBOT_REQUEST,
} from '../actions/introSetup';
import _ from 'lodash';

function keypairGeneratorResult(state='', action) {
  if (action.type === GENERATE_NEW_KEYPAIR) {
    return action.result;
  }
  return state;
}
function keypairGeneratorPubKey(state='', action) {
  if (action.type === GENERATE_NEW_KEYPAIR) {
    return action.pubKey;
  }
  return state;
}
function friendbotTarget(state='', action) {
  if (action.type === UPDATE_FRIENDBOT_TARGET) {
    return action.target;
  }
  return state;
}

const defaultRequestState = {
  message: '',
  code: '',
}
function friendbotStatus(state, action) {
  if (state === undefined) {
    return defaultRequestState;
  }
  if (action.type === START_FRIENDBOT_REQUEST) {
    return _.assign({}, defaultRequestState, {message: action.message});
  }
  if (action.type === FINISH_FRIENDBOT_REQUEST) {
    return {
      message: action.message,
      code: action.code,
    }
  }
  return state;
}

const introSetup = combineReducers({
  keypairGeneratorResult,
  keypairGeneratorPubKey,
  friendbotTarget,
  friendbotStatus,
})
export default introSetup