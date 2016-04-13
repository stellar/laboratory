import axios from 'axios';
import dispatchInNewStack from '../utilities/dispatchInNewStack';
import {Keypair} from 'stellar-sdk';

export const GENERATE_NEW_KEYPAIR = 'GENERATE_NEW_KEYPAIR';
export function generateNewKeypair() {
  let keypair = Keypair.random();
  return {
    type: GENERATE_NEW_KEYPAIR,
    result: '' +
      '{\n' +
      '  "public key": "' + keypair.accountId() + '",\n' +
      '  "secret key": "' + keypair.seed() + '"\n' +
      '}',
    pubKey: keypair.accountId(),
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
    });

    axios.get('https://horizon-testnet.stellar.org/friendbot?addr=' + target)
      .then(r => {
        console.log(r)
        dispatchInNewStack(dispatch, {
          type: FINISH_FRIENDBOT_REQUEST,
          target,
          message: `Successfully funded ${target} on the test network`,
          code: JSON.stringify(r.data, null, 2),
        })
      })
      .catch(e => {
        let code, message;
        if (e.status === 0) {
          code = '';
          message = 'Unable to reach Horizon server at https://horizon-testnet.stellar.org';
        } else {
          code = JSON.stringify(e.data, null, 2);
          message = `Failed to fund ${target} on the test network`;
        }

        dispatchInNewStack(dispatch, {
          type: FINISH_FRIENDBOT_REQUEST,
          target,
          message,
          code,
        })
      })
  }
}