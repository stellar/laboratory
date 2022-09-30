import axios from "axios";
import { Keypair, Account, MuxedAccount } from "stellar-sdk";
import dispatchInNewStack from "../helpers/dispatchInNewStack";

export const GENERATE_NEW_KEYPAIR = "GENERATE_NEW_KEYPAIR";
export function generateNewKeypair() {
  let keypair = Keypair.random();
  return {
    type: GENERATE_NEW_KEYPAIR,
    pubKey: keypair.publicKey(),
    secretKey: keypair.secret(),
  };
}

export const UPDATE_FRIENDBOT_TARGET = "UPDATE_FRIENDBOT_TARGET";
export function updateFriendbotTarget(target) {
  return {
    type: UPDATE_FRIENDBOT_TARGET,
    target,
  };
}

export const START_FRIENDBOT_REQUEST = "START_FRIENDBOT_REQUEST";
export const FINISH_FRIENDBOT_REQUEST = "FINISH_FRIENDBOT_REQUEST";
export function startFriendbotRequest(target, isSoroban = false) {
  const friendbotURL = isSoroban
    ? "https://friendbot-futurenet.stellar.org"
    : "https://friendbot.stellar.org";
  return (dispatch) => {
    dispatch({
      type: START_FRIENDBOT_REQUEST,
      message: "Loading...",
      status: "loading",
    });

    axios
      .get(friendbotURL + "/?addr=" + target)
      .then(() => {
        dispatchInNewStack(dispatch, {
          type: FINISH_FRIENDBOT_REQUEST,
          target,
          message: `Successfully funded ${target} on the test network`,
          status: "success",
          code: "",
        });
      })
      .catch((e) => {
        let code, message;
        if (e.response.status === 0) {
          code = "";
          message = "Unable to reach Friendbot server at " + friendbotURL;
        } else {
          code = JSON.stringify(e.response.data, null, 2);
          message = `Failed to fund ${target} on the test network`;
        }

        dispatchInNewStack(dispatch, {
          type: FINISH_FRIENDBOT_REQUEST,
          target,
          message,
          status: "failure",
          code,
        });
      });
  };
}

export const GENERATE_MUXED_ACCOUNT = "GENERATE_MUXED_ACCOUNT";
export function generateMuxedAccount(publicKey, muxedAccountId) {
  try {
    const muxedAccount = new MuxedAccount(
      new Account(publicKey, "0"),
      muxedAccountId,
    );

    return {
      type: GENERATE_MUXED_ACCOUNT,
      mAddress: muxedAccount.accountId(),
    };
  } catch (e) {
    return {
      type: GENERATE_MUXED_ACCOUNT,
      errorMessage: `Something went wrong. ${e.toString()}`,
    };
  }
}

export const UPDATE_GENERATE_MUXED_ACCOUNT_INPUT =
  "UPDATE_GENERATE_MUXED_ACCOUNT_INPUT";
export function updateGenerateMuxedAccountInput(input) {
  return {
    type: UPDATE_GENERATE_MUXED_ACCOUNT_INPUT,
    input,
  };
}

export const PARSE_MUXED_ACCOUNT = "PARSE_MUXED_ACCOUNT";
export function parseMuxedAccount(muxedAccountAddress) {
  try {
    const muxedAccount = new MuxedAccount.fromAddress(muxedAccountAddress, "0");
    const gAddress = muxedAccount.baseAccount().accountId();
    const mAccountId = muxedAccount.id();

    if (!gAddress) {
      throw new Error("Base account for this muxed account was not found.");
    }

    if (!mAccountId) {
      throw new Error("Muxed account ID for this muxed account was not found.");
    }

    return {
      type: PARSE_MUXED_ACCOUNT,
      gAddress,
      mAccountId,
    };
  } catch (e) {
    return {
      type: PARSE_MUXED_ACCOUNT,
      errorMessage: `Something went wrong. ${e.toString()}`,
    };
  }
}

export const UPDATE_PARSE_MUXED_ACCOUNT_INPUT =
  "UPDATE_PARSE_MUXED_ACCOUNT_INPUT";
export function updateParseMuxedAccountInput(mAddress) {
  return {
    type: UPDATE_PARSE_MUXED_ACCOUNT_INPUT,
    mAddress,
  };
}
