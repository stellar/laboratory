/**
 * @prettier
 */

import React from "react";
import { signTransaction } from "@stellar/lyra-api";

import { CodeBlock } from "./CodeBlock";

const signWithLyra = async (xdr, setTxResultMessage, setErrorStatus) => {
  let res = { signedTransaction: "", error: "" };

  try {
    res = await signTransaction({
      transactionXdr: xdr,
    });
  } catch (e) {
    res = e;
    console.error(e);
  }

  if (res.error) {
    setTxResultMessage(res.error);
    setErrorStatus(true);
  } else {
    setTxResultMessage(res.signedTransaction);
    setErrorStatus(false);
  }
};

const ErrorResultDetails = ({ resultMessage, hasError }) => {
  const [isClicked, setOnClick] = React.useState(false);

  let arrowIconType = isClicked
    ? "s-button__dropdown-icon--right"
    : "s-button__dropdown-icon";

  return (
    <div>
      <button
        type="button"
        className={arrowIconType}
        onClick={() => setOnClick(!isClicked)}
      >
        Details
      </button>
      {isClicked ? (
        <div className="TxLyraSign__result-error">
          <code>{resultMessage}</code>
        </div>
      ) : null}
    </div>
  );
};

const TxLyraSign = ({ xdr }) => {
  const [txResultMessage, setTxResultMessage] = React.useState("");
  const [hasError, setErrorStatus] = React.useState(false);

  return (
    <div>
      <button
        className="s-button"
        type="button"
        onClick={() => signWithLyra(xdr, setTxResultMessage, setErrorStatus)}
      >
        {txResultMessage ? "Sign again" : "Sign with Lyra"}
      </button>
      {txResultMessage ? (
        hasError ? (
          <div className="TxLyraSign__result">
            There was an error signing the transaction:
            <ErrorResultDetails
              resultMessage={txResultMessage}
              hasError={hasError}
            />
          </div>
        ) : (
          <div className="TxLyraSign__result">
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

export default TxLyraSign;
