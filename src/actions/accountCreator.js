import axios from 'axios';
import dispatchInNewStack from '../utilities/dispatchInNewStack';
import {Keypair} from 'stellar-sdk';

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
        if (e.status === 0) {
          code = '';
          message = 'Unable to reach Friendbot server at https://friendbot.stellar.org';
        } else {
          code = JSON.stringify(e.data, null, 2);
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
