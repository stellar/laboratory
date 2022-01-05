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
  const isDisabled = !txXdr || !isIdle;

  return (
    <div className="TransactionSubmitter">
      <div className="XdrViewer__submit so-back">
        <div className="so-chunk">
          <button
            className="s-button"
            data-testid="transaction-submitter-submit-btn"
            disabled={isDisabled}
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
      <h3
        className="ResultTitle__success"
        data-testid="transaction-submitter-response-success"
      >
        Transaction submitted!
      </h3>
      <p data-testid="transaction-submitter-response-status">
        Transaction {successful ? "succeeded" : "failed"} with {operation_count}{" "}
        operation(s).
      </p>
      <pre className="so-code TransactionSubmitter__code">
        <code>
          <div>
            Hash:
            <br />{" "}
            <EasySelect data-testid="transaction-submitter-response-hash">
              {hash}
            </EasySelect>{" "}
            <br />
            Ledger number:
            <br />{" "}
            <EasySelect data-testid="transaction-submitter-response-ledger">
              {ledger}
            </EasySelect>{" "}
            <br />
            Paging token:
            <br />{" "}
            <EasySelect data-testid="transaction-submitter-response-token">
              {paging_token}
            </EasySelect>{" "}
            <br />
            Result XDR:
            <br />{" "}
            <EasySelect data-testid="transaction-submitter-response-result-xdr">
              {result_xdr}
            </EasySelect>{" "}
            <br />
            Result Meta XDR:
            <br />{" "}
            <EasySelect data-testid="transaction-submitter-response-result-meta-xdr">
              {result_meta_xdr}
            </EasySelect>{" "}
            <br />
            Fee Meta XDR:
            <br />{" "}
            <EasySelect data-testid="transaction-submitter-response-fee-meta-xdr">
              {fee_meta_xdr}
            </EasySelect>
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
    extras = (
      <React.Fragment>
        Destination account:
        <br />{" "}
        <EasySelect data-testid="transaction-submitter-error-account-id">
          {error.accountId}
        </EasySelect>{" "}
        <br />
        Operation index:
        <br />{" "}
        <EasySelect data-testid="transaction-submitter-error-op-index">
          {error.operationIndex}
        </EasySelect>{" "}
        <br />
      </React.Fragment>
    );
  } else if (error?.response) {
    const { result_codes, result_xdr } = error.response.data?.extras || {};
    message = error.message;
    extras = (
      <React.Fragment>
        extras.result_codes:
        <br />{" "}
        <EasySelect data-testid="transaction-submitter-error-code">
          {JSON.stringify(result_codes)}
        </EasySelect>{" "}
        <br />
        Result XDR:
        <br />{" "}
        <EasySelect data-testid="transaction-submitter-error-xdr">
          {result_xdr}
        </EasySelect>{" "}
        <br />
      </React.Fragment>
    );
  } else {
    message =
      error instanceof BadResponseError
        ? "Received a bad response when submitting."
        : "An unknown error occurred.";
    extras = (
      <React.Fragment>
        original error:
        <br />
        <EasySelect data-testid="transaction-submitter-error-original">
          {JSON.stringify(error, null, 2)}
        </EasySelect>
        <br />
      </React.Fragment>
    );
  }

  return (
    <div className="XdrViewer__submit so-back TransactionSubmitter__result">
      <div className="so-chunk">
        <h3
          className="ResultTitle__failure"
          data-testid="transaction-submitter-response-error"
        >
          Transaction failed!
        </h3>
        <p data-testid="transaction-submitter-error-message">{message}</p>
        {extras && (
          <pre className="so-code TransactionSubmitter__code">
            <code>{extras}</code>
          </pre>
        )}
      </div>
    </div>
  );
};
