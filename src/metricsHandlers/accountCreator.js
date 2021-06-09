import {
  GENERATE_NEW_KEYPAIR,
  START_FRIENDBOT_REQUEST,
  FINISH_FRIENDBOT_REQUEST,
  GENERATE_MUXED_ACCOUNT,
} from '../actions/accountCreator';

import { logEvent} from '../utilities/metrics'

const metricsEvents = {
  newAccount: 'account creator: generated new account',
  fundAccountStart: 'account creator: funded test account: begin',
  fundAccountSuccess: 'account creator: funded test account: success',
  fundAccountError: 'account creator: funded test account: failed',
  generateMuxedAccount: 'account creator: generated new muxed account',
}

export default function accountCreatorMetrics(state, action) {
  const {type, ...actionBody} = action
  switch (type) {
    case GENERATE_NEW_KEYPAIR: {
      logEvent(metricsEvents.newAccount)
      return;
    }
    case START_FRIENDBOT_REQUEST: {
      logEvent(metricsEvents.fundAccountStart)
      return;
    }
    case FINISH_FRIENDBOT_REQUEST: {
      if (actionBody.status === 'success'){
        logEvent(metricsEvents.fundAccountSuccess)
        return
      }
      const {message, code} = actionBody
      logEvent(metricsEvents.fundAccountError, {message, code})
      return;
    }
    case GENERATE_MUXED_ACCOUNT: {
      logEvent(metricsEvents.generateMuxedAccount)
      return;
    }

  }
}
