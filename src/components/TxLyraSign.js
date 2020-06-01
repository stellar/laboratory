import React from 'react';

const signWithLyra = async (xdr, setTxResult) => {
      let res = {transactionStatus: "" };

    try {
      res = await window.lyra.requestSignature({
        transactionXdr: xdr,
      });
    } catch (e) {
      res = e;
      console.error(e);
    }

    setTxResult(res.transactionStatus);

}

const TxLyraSign = ({ xdr }) => {
  const [ txResult, setTxResult ] = React.useState();
  return (
    <div>
      <hr />
    <button className="s-button" type="button" onClick={() => signWithLyra(xdr, setTxResult)}>
      Sign with Lyra
    </button>
    {
      txResult ? 
        <div>
          <h1>Result: { txResult.successful ? 'Success!' : 'Failed!' }</h1>
          <h3>Full results:</h3>
          <textarea readonly value={JSON.stringify(txResult)} />
        </div> : null
    }
  </div>
  )
};

export default TxLyraSign;