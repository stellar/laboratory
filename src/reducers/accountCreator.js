import {combineReducers} from 'redux';
import assign from 'lodash/assign';
import {
  GENERATE_NEW_KEYPAIR,
  UPDATE_FRIENDBOT_TARGET,
  START_FRIENDBOT_REQUEST,
  FINISH_FRIENDBOT_REQUEST,
  GENERATE_MUXED_ACCOUNT,
  UPDATE_GENERATE_MUXED_ACCOUNT_INPUT,
  PARSE_MUXED_ACCOUNT,
  UPDATE_PARSE_MUXED_ACCOUNT_INPUT
} from '../actions/accountCreator';

function keypairGeneratorResult(state=null, action) {
  if (action.type === GENERATE_NEW_KEYPAIR) {
    return {
      pubKey: action.pubKey,
      secretKey: action.secretKey,
    };
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

const initialMuxedAccountState = {
  gAddress: "",
  mAccountId: "",
  mAddress: "",
  errorMessage: "",
};
function muxedAccountGenerated(state = initialMuxedAccountState, action) {
  if (action.type === GENERATE_MUXED_ACCOUNT) {
    return {
      ...state,
      mAddress: action.mAddress,
      errorMessage: action.errorMessage || "",
    }
  }
  if (action.type === UPDATE_GENERATE_MUXED_ACCOUNT_INPUT) {
    return {
      ...state,
      ...action.input,
      errorMessage: "",
      mAddress: "",
    }
  }
  return state;
}
function muxedAccountParsed(state = initialMuxedAccountState, action) {
  if (action.type === PARSE_MUXED_ACCOUNT) {
    return {
      ...state,
      gAddress: action.gAddress,
      mAccountId: action.mAccountId,
      errorMessage: action.errorMessage || "",
    }
  }
  if (action.type === UPDATE_PARSE_MUXED_ACCOUNT_INPUT) {
    return {
      ...state,
      mAddress: action.mAddress,
      errorMessage: "",
      gAddress: "",
      mAccountId: "",
    }
  }
  return state;
}

const defaultRequestState = {
  message: '',
  code: '',
  status: 'inital',
}
function friendbotStatus(state = defaultRequestState, action) {
  if (action.type === START_FRIENDBOT_REQUEST) {
    return assign({}, defaultRequestState, {
      message: action.message,
      status: action.status,
    });
  }
  if (action.type === FINISH_FRIENDBOT_REQUEST) {
    return {
      message: action.message,
      code: action.code,
      status: action.status,
    }
  }
  return state;
}

const accountCreator = combineReducers({
  keypairGeneratorResult,
  keypairGeneratorPubKey,
  friendbotTarget,
  friendbotStatus,
  muxedAccountGenerated,
  muxedAccountParsed,
})
export default accountCreator
