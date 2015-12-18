import React from 'react';
import {connect} from 'react-redux';
import Picker from './FormComponents/Picker';
import {Transaction, Keypair} from 'stellar-sdk';
import TransactionImporter from './TransactionImporter';
import {
  importFromXdr,
  clearTransaction,
  setSecret,
} from '../actions/transactionSigner';

class TransactionSigner extends React.Component {
  render() {
    let {dispatch} = this.props;
    let {tx, signers} = this.props.state;
    let content;

    if (!tx.loaded) {
      content = <div className="so-back">
        <div className="so-chunk">
          <div className="TxSignerImport TransactionSigner__import">
            <p className="TxSignerImport__title">Import a transaction envelope in XDR format:</p>
            <TransactionImporter onImport={(xdr) => dispatch(importFromXdr(xdr))}/>
          </div>
        </div>
      </div>
    } else {
      let xdrResult, resultTitle;
      if (isValidSecret(signers.signer)) {
        let newTx = new Transaction(tx.xdr);
        newTx.sign(Keypair.fromSeed(signers.signer));

        xdrResult = newTx.toEnvelope().toXDR('base64');
        resultTitle = '1 signature added';
      } else {
        resultTitle = 'Signing key required';
      }

      content = <div>
        <div className="so-back">
          <div className="so-chunk">
            <div className="TxSignerOverview TransactionSigner__overview">
              <div className="TxSignerOverview__titleBar">
                <p className="TxSignerOverview__titleBar__title">Transaction overview</p>
                <a className="TxSignerOverview__titleBar__reset"
                  onClick={() => dispatch(clearTransaction())}>
                  Clear and import new transaction</a>
              </div>
              <div className="simpleTable">
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">Transaction Envelope XDR</div>
                  <div className="simpleTable__row__content">
                    <pre className="so-code so-code__wrap"><code>{tx.xdr}</code></pre>
                  </div>
                </div>
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">Source account</div>
                  <div className="simpleTable__row__content">GDEGHAHQ6EK7HT44KZV3KKXQ5W7SD7WN6TFMK6I2VNWFWNKHG3PSO7ZM</div>
                </div>
                <div className="simpleTable__row">
                  <div className="simpleTable__row__label">Number of operations</div>
                  <div className="simpleTable__row__content">3</div>
                </div>
              </div>
            </div>
          </div>
          <div className="so-chunk">
            <div className="TxSignerKeys TransactionSigner__keys">
              <p className="TxSignerKeys__title">Signatures</p>
              <div className="optionsTable">
                {Picker({
                  type: 'SecretKey',
                  onUpdate: (values) => dispatch(setSecret(values.value)),
                  required: true,
                  label: 'Add Signer',
                })}
              </div>
            </div>
          </div>
        </div>
        <div className="so-back TxSignerResult TransactionSigner__result">
          <div className="so-chunk">
            <p className="TxSignerResult__summary">{resultTitle}</p>
            <pre className="TxSignerResult__xdr so-code so-code__wrap"><code>{xdrResult}</code></pre>
          </div>
        </div>
      </div>
    }
    return <div className="TransactionSigner">
      {content}
    </div>
  }
}

export default connect(chooseState)(TransactionSigner);

function chooseState(state) {
  return {
    state: state.transactionSigner,
  }
}

function isValidSecret(key) {
  try{
    Keypair.fromSeed(key);
  } catch (err) {
    return false;
  }
  return true;
}
