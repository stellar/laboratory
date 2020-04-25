import React from "react";
import { Server, TransactionBuilder } from "stellar-sdk";
import { EasySelect } from "./EasySelect";

const NETWORK_STATES = {
  idle: "idle",
  pending: "pending",
  success: "success",
  failed: "failed",
};
const ACTIONS = {
  submit: "submit",
  success: "success",
  fail: "fail",
};
const initialState = {
  state: NETWORK_STATES.idle,
  // state: NETWORK_STATES.success,
  response: null,
  actualresponse: {
    id: "93ec75f754a3735efc2483bd0628b9473416651b05850a77c7d773e9f7c2ce09",
    paging_token: "5884612001693696",
    successful: true,
    hash: "93ec75f754a3735efc2483bd0628b9473416651b05850a77c7d773e9f7c2ce09",
    ledger: 1370118,
    created_at: "2020-04-24T20:27:03Z",
    source_account: "GDK75HHCRZRZFLBYIQJHVUNPQQI3JN33ZHQNFCRZ4LXOMPYAK47WARLK",
    source_account_sequence: "5762067994771457",
    fee_account: "GDK75HHCRZRZFLBYIQJHVUNPQQI3JN33ZHQNFCRZ4LXOMPYAK47WARLK",
    fee_charged: 100,
    max_fee: 100,
    operation_count: 1,
    envelope_xdr:
      "AAAAANX+nOKOY5KsOEQSetGvhBG0t3vJ4NKKOeLu5j8AVz9gAAAAZAAUeJIAAAABAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAABAAAAANX+nOKOY5KsOEQSetGvhBG0t3vJ4NKKOeLu5j8AVz9gAAAAAAAAAAAC+vCAAAAAAAAAAAEAVz9gAAAAQEuiI52qNVssmiJDRFfXKQ/mrRbkRbE2+0QEPhWt6vRe3QRurJ4dMX9Tv/zmOHp5cDWEyO9AVYIJbswbVnt7gQ4=",
    result_xdr: "AAAAAAAAAGQAAAAAAAAAAQAAAAAAAAABAAAAAAAAAAA=",
    result_meta_xdr:
      "AAAAAQAAAAIAAAADABToBgAAAAAAAAAA1f6c4o5jkqw4RBJ60a+EEbS3e8ng0oo54u7mPwBXP2AAAAAXSHbnnAAUeJIAAAAAAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABABToBgAAAAAAAAAA1f6c4o5jkqw4RBJ60a+EEbS3e8ng0oo54u7mPwBXP2AAAAAXSHbnnAAUeJIAAAABAAAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAABAAAAAA==",
    fee_meta_xdr:
      "AAAAAgAAAAMAFHiSAAAAAAAAAADV/pzijmOSrDhEEnrRr4QRtLd7yeDSijni7uY/AFc/YAAAABdIdugAABR4kgAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAAAAEAFOgGAAAAAAAAAADV/pzijmOSrDhEEnrRr4QRtLd7yeDSijni7uY/AFc/YAAAABdIduecABR4kgAAAAAAAAAAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAA==",
    memo_type: "none",
    signatures: [
      "S6Ijnao1WyyaIkNEV9cpD+atFuRFsTb7RAQ+Fa3q9F7dBG6snh0xf1O//OY4enlwNYTI70BVggluzBtWe3uBDg==",
    ],
    valid_after: "1970-01-01T00:00:00Z",
  },
  error: null,
};

export const TxSubmitterResult = ({ txXdr, networkPassphrase, horizonURL }) => {
  const [submission, dispatch] = React.useReducer((state, action) => {
    switch (action.type) {
      case ACTIONS.submit:
        return { ...initialState, state: NETWORK_STATES.pending };
      case ACTIONS.success:
        return { ...state, error: null, response: action.payload };
      case ACTIONS.fail:
        return { ...state, response: null, error: action.payload };
      default:
        return state;
    }
  }, initialState);

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
              // server.submitTransaction(transaction).then(
              Promise.resolve().then(
                (res) => {
                  dispatch({
                    type: ACTIONS.success,
                    payload: initialState.actualresponse,
                  });
                },
                (err) => {
                  dispatch({ type: ACTIONS.fail, payload: err });
                },
              );
            }}
          >
            Submit Transaction
          </button>
        </div>
      </div>
      <div className={`collapsible ${isIdle ? "closed" : ""}`}>
        {!isIdle && submission.response && (
          <Response {...submission.response} />
        )}
      </div>
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
      <h3 className="TxSignerResult__title">Transaction submitted!</h3>
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
