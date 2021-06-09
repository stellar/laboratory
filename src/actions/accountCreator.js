import axios from 'axios';
import dispatchInNewStack from '../utilities/dispatchInNewStack';
import {Keypair, Account, MuxedAccount, Server} from 'stellar-sdk';

export const GENERATE_NEW_KEYPAIR = 'GENERATE_NEW_KEYPAIR';
export function generateNewKeypair() {
  let keypair = Keypair.random();
  return {
    type: GENERATE_NEW_KEYPAIR,
    pubKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  }
}

export const UPDATE_FRIENDBOT_TARGET = 'UPDATE_FRIENDBOT_TARGET';
export function updateFriendbotTarget(target) {
  return {
    type: UPDATE_FRIENDBOT_TARGET,
    target,
  }
}

export const START_FRIENDBOT_REQUEST = 'START_FRIENDBOT_REQUEST';
export const FINISH_FRIENDBOT_REQUEST = 'FINISH_FRIENDBOT_REQUEST';
export function startFriendbotRequest(target) {
  return dispatch => {
    dispatch({
      type: START_FRIENDBOT_REQUEST,
      message: 'Loading...',
      status: 'loading',
    });

    axios.get('https://friendbot.stellar.org/?addr=' + target)
      .then(r => {
        dispatchInNewStack(dispatch, {
          type: FINISH_FRIENDBOT_REQUEST,
          target,
          message: `Successfully funded ${target} on the test network`,
          status: 'success',
          code: '',
        })
      })
      .catch(e => {
        let code, message;
        if (e.response.status === 0) {
          code = '';
          message = 'Unable to reach Friendbot server at https://friendbot.stellar.org';
        } else {
          code = JSON.stringify(e.response.data, null, 2);
          message = `Failed to fund ${target} on the test network`;
        }

        dispatchInNewStack(dispatch, {
          type: FINISH_FRIENDBOT_REQUEST,
          target,
          message,
          status: 'failure',
          code,
        })
      })
  }
}

export const GENERATE_MUXED_ACCOUNT = 'GENERATE_MUXED_ACCOUNT';
export function generateMuxedAccount(publicKey, muxedAccountId, horizonURL) {
  const server = new Server(horizonURL);

  return dispatch => server.accounts().accountId(publicKey).call().then(accountInfo => {
    const { sequence } = accountInfo;
    const baseAccount = new Account(publicKey, sequence);
    const muxedAccount = new MuxedAccount(baseAccount, muxedAccountId);

    dispatch({
      type: GENERATE_MUXED_ACCOUNT,
      mAddress: muxedAccount.accountId(),
    });
  }).catch(e => {
    dispatch({
      type: GENERATE_MUXED_ACCOUNT,
      errorMessage: `Something went wrong. ${e.toString()}`
    });
  });
}

export const UPDATE_GENERATE_MUXED_ACCOUNT_INPUT = 'UPDATE_GENERATE_MUXED_ACCOUNT_INPUT';
export function updateGenerateMuxedAccountInput(input) {
  return {
    type: UPDATE_GENERATE_MUXED_ACCOUNT_INPUT,
    input,
  }
}
