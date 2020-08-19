/**
 * @prettier
 */

import React from "react";
import { signTransaction } from "@stellar/lyra-api";

import { CodeBlock } from "./CodeBlock";

const signWithLyra = async (xdr, setTxResult) => {
  let res = { signedTransaction: "" };

  try {
    res = await signTransaction({
      transactionXdr: xdr,
    });
  } catch (e) {
    res = e;
    console.error(e);
  }

  setTxResult(res.signedTransaction);
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
