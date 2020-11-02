/**
 * @prettier
 */

import React from "react";
import { signTransaction } from "@stellar/freighter-api";

import { CodeBlock } from "./CodeBlock";

const signWithFreighter = async (xdr, setTxResultMessage, setErrorStatus) => {
  let res = { signedTransaction: "", error: "" };

  try {
    res = await signTransaction(xdr);
  } catch (e) {
    setTxResultMessage(e);
    setErrorStatus(true);
  }

  setTxResultMessage(res);
  setErrorStatus(false);
};

const TxFreighterSign = ({ xdr }) => {
  const [txResultMessage, setTxResultMessage] = React.useState("");
  const [hasError, setErrorStatus] = React.useState(false);

  return (
    <div>
      <button
        className="s-button"
        type="button"
        onClick={() =>
          signWithFreighter(xdr, setTxResultMessage, setErrorStatus)
        }
      >
        {txResultMessage ? "Sign again" : "Sign with Freighter"}
      </button>
      {txResultMessage ? (
        hasError ? (
          <div className="TxFreighterSign__result">
            There was an error signing the transaction:
            <div className="TxFreighterSign__result-error">
              <code>{txResultMessage}</code>
            </div>
          </div>
        ) : (
          <div className="TxFreighterSign__result">
            Successfully signed!
            <CodeBlock
              className="AccountCreator__spaceTop so-code so-code__wrap"
              code={JSON.stringify(txResultMessage, null, 2)}
              language="json"
            />
          </div>
        )
      ) : null}
    </div>
  );
};

export default TxFreighterSign;
