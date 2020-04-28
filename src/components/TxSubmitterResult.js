import React from "react";
import {
  Server,
  TransactionBuilder,
  AccountRequiresMemoError,
  BadResponseError,
} from "stellar-sdk";
import { EasySelect } from "./EasySelect";
import { Collapsible } from "./Collapsible";

const NETWORK_STATES = {
  idle: "idle",
  pending: "pending",
  success: "success",
  fail: "failed",
};
const ACTIONS = {
  submit: "submit",
  success: "success",
  fail: "fail",
};
const initialState = {
  state: NETWORK_STATES.idle,
  response: null,
  error: null,
};

const reducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.submit:
      return { ...initialState, state: NETWORK_STATES.pending };
    case ACTIONS.success:
      return {
        ...state,
        error: null,
        response: action.payload,
        state: NETWORK_STATES.success,
      };
    case ACTIONS.fail:
      return {
        ...state,
        response: null,
        error: action.payload,
        state: NETWORK_STATES.fail,
      };
    default:
      return state;
  }
};

export const TxSubmitterResult = ({ txXdr, networkPassphrase, horizonURL }) => {
  const [submission, dispatch] = React.useReducer(reducer, initialState);

  const isIdle = submission.state === NETWORK_STATES.idle;

  return (
    <div className="TransactionSubmitter">
      <div className="XdrViewer__submit so-back">
        <div className="so-chunk">
          <button
            className="s-button"
            disabled={submission.state !== NETWORK_STATES.idle}
            onClick={() => {
              dispatch({ type: ACTIONS.submit });
              const transaction = TransactionBuilder.fromXDR(
                txXdr,
                networkPassphrase,
              );
              const server = new Server(horizonURL, { appName: "Laboratory" });
              server.submitTransaction(transaction).then(
                (res) => {
                  dispatch({ type: ACTIONS.success, payload: res });
                },
                (err) => {
                  dispatch({ type: ACTIONS.fail, payload: err });
                },
              );
            }}
          >
            {submission.state === NETWORK_STATES.pending
              ? "Submitting to the network…"
              : "Submit Transaction"}
          </button>
        </div>
      </div>
      <Collapsible isOpen={!isIdle}>
        {!isIdle && submission.response && (
          <Response {...submission.response} />
        )}
        {!isIdle && submission.error && <Error error={submission.error} />}
      </Collapsible>
    </div>
  );
};

const Response = ({
  operation_count,
  successful,
  paging_token,
  hash,
  ledger,
  result_xdr,
  result_meta_xdr,
  fee_meta_xdr,
}) => (
  <div className="XdrViewer__submit so-back TransactionSubmitter__result">
    <div className="so-chunk">
      <h3 className="ResultTitle__success">Transaction submitted!</h3>
      <p>
        Transaction {successful ? "succeeded" : "failed"} with {operation_count}{" "}
        operation(s).
      </p>
      <pre className="so-code TransactionSubmitter__code">
        <code>
          <div>
            Hash:
            <br /> <EasySelect>{hash}</EasySelect> <br />
            Ledger number:
            <br /> <EasySelect>{ledger}</EasySelect> <br />
            Paging token:
            <br /> <EasySelect>{paging_token}</EasySelect> <br />
            Result XDR:
            <br /> <EasySelect>{result_xdr}</EasySelect> <br />
            Result Meta XDR:
            <br /> <EasySelect>{result_meta_xdr}</EasySelect> <br />
            Fee Meta XDR:
            <br /> <EasySelect>{fee_meta_xdr}</EasySelect>
          </div>
        </code>
      </pre>
    </div>
  </div>
);
const Error = ({ error }) => {
  let message = "",
    extras = null;
  if (error instanceof AccountRequiresMemoError) {
    message = "This destination requires a memo.";
    extras = <React.Fragment>
        Destination account:
        <br /> <EasySelect>{error.accountId}</EasySelect> <br />
        Operation index:
        <br /> <EasySelect>{error.operationIndex}</EasySelect> <br />
        </React.Fragment>
  } else if (error instanceof BadResponseError) {
    message = "An unknown error occurred";
    extras = (
      <React.Fragment>
        original error:
        <br />
        <EasySelect>{JSON.stringify(error, null, 2)}</EasySelect>
        <br />
      </React.Fragment>
    );
  } else {
    const { result_codes, result_xdr } = error?.response.data?.extras || {};
    message = error.message;
    extras = (
      <React.Fragment>
        extras.result_codes:
        <br /> <EasySelect>{JSON.stringify(result_codes)}</EasySelect> <br />
        Result XDR:
        <br /> <EasySelect>{result_xdr}</EasySelect> <br />
      </React.Fragment>
    );
  }

  return (
    <div className="XdrViewer__submit so-back TransactionSubmitter__result">
      <div className="so-chunk">
        <h3 className="ResultTitle__failure">Transaction failed!</h3>
        <p>{message}</p>
        {extras && (
          <pre className="so-code TransactionSubmitter__code">
            <code>{extras}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
