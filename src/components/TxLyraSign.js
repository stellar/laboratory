/**
 * @prettier
 */

import React from "react";

import { CodeBlock } from "./CodeBlock";

const signWithLyra = async (xdr, setTxResult) => {
  let res = { transactionStatus: "" };

  try {
    res = await window.lyra.requestSignature({
      transactionXdr: xdr,
    });
  } catch (e) {
    res = e;
    console.error(e);
  }

  setTxResult(res.transactionStatus);
};

const TxLyraSign = ({ xdr }) => {
  const [txResult, setTxResult] = React.useState();

  return (
    <div>
      <hr />
      <button
        className="s-button"
        type="button"
        onClick={() => signWithLyra(xdr, setTxResult)}
      >
        Sign with Lyra
      </button>
      {txResult ? (
        <div>
          <div
            className={`AccountCreator__spaceTop s-alert ${
              txResult.successful ? "s-alert--success" : "s-alert--alert"
            }`}
          >
            Result: {txResult.successful ? "Success!" : "Failed!"}
          </div>
          <CodeBlock
            className="AccountCreator__spaceTop"
            code={JSON.stringify(txResult, null, 2)}
            language="json"
          />
        </div>
      ) : null}
    </div>
  );
};

export default TxLyraSign;
