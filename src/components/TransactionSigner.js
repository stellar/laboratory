import React from 'react';
import {connect} from 'react-redux';
import {Transaction, Keypair, Network} from 'stellar-sdk';
import TransactionImporter from './TransactionImporter';
import {
  importFromXdr,
  clearTransaction,
  setSecrets,
} from '../actions/transactionSigner';
import {EasySelect} from './EasySelect';
import OptionsTablePair from './OptionsTable/Pair';
import SecretKeyPicker from './FormComponents/SecretKeyPicker';
import MultiPicker from './FormComponents/MultiPicker';
import {txPostLink} from '../utilities/linkBuilder';
import HelpMark from './HelpMark';

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
      let result = signTx(tx.xdr, signers, this.props.useNetworkFunc);
      let transaction = new Transaction(tx.xdr);

      let infoTable = {
        'Transaction Envelope XDR': <EasySelect plain={true}><pre className="so-code so-code__wrap"><code>{tx.xdr}</code></pre></EasySelect>,
        'Source account': transaction.source,
        'Sequence number': transaction.sequence,
        'Transaction Fee (stroops)': transaction.fee,
        'Number of operations': transaction.operations.length,
        'Number of existing signatures': transaction.signatures.length,
      };

      let codeResult, postLink;

      if (!_.isUndefined(result.xdr)) {
        codeResult = <EasySelect plain={true}>
          <pre className="TxSignerResult__xdr so-code so-code__wrap"><code>{result.xdr}</code></pre>
        </EasySelect>;

        postLink = <a className="s-button TxSignerResult__submit" href={txPostLink(result.xdr)}>Submit this transaction to the network</a>;
      }

      let resultTitle;
      if (result.success) {
        resultTitle = <h3 className="TxSignerResult__title">Transaction signed!</h3>
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
                {_.map(infoTable, (content, label) => {
                  return <div className="simpleTable__row" key={label}>
                    <div className="simpleTable__row__label">{label}</div>
                    <div className="simpleTable__row__content">{content}</div>
                  </div>
                })}
              </div>
            </div>
          </div>
          <div className="so-chunk">
            <div className="TxSignerKeys TransactionSigner__keys">
              <p className="TxSignerKeys__title">Signatures <HelpMark href="https://www.stellar.org/developers/learn/concepts/multi-sig.html" /></p>
              <div className="optionsTable">
                <OptionsTablePair label="Add Signer">
                  <MultiPicker
                    component={SecretKeyPicker}
                    value={signers}
                    onUpdate={(value) => dispatch(setSecrets(value))}
                  />
                </OptionsTablePair>
              </div>
            </div>
          </div>
        </div>
        <div className="so-back TxSignerResult TransactionSigner__result">
          <div className="so-chunk">
            {resultTitle}
            <p className="TxSignerResult__summary">{result.message}</p>
            {codeResult}
            {postLink}
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
    useNetworkFunc: state.network.available[state.network.current].useNetworkFunc,
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

function signTx(xdr, signers, useNetworkFunc) {
  Network[useNetworkFunc]();

  let validSecretKeys = [];
  for (let i = 0; i < signers.length; i++) {
    let signer = signers[i];
    if (signer !== null && !_.isUndefined(signer) && signer !== '') {
      if (!isValidSecret(signer)) {
        return {
          message: 'Valid secret keys are required to sign transaction'
        }
      }
      validSecretKeys.push(signer);
    }
  }


  let newTx = new Transaction(xdr);
  let existingSigs = newTx.signatures.length;
  _.each(validSecretKeys, (signer) => {
    newTx.sign(Keypair.fromSeed(signer));
  })

  if (validSecretKeys.length === 0) {
    return {
      message: 'Enter a secret key to sign message'
    }
  }

  return {
    xdr: newTx.toEnvelope().toXDR('base64'),
    success: true,
    message: `${validSecretKeys.length} signature(s) added; ${existingSigs + validSecretKeys.length} signature(s) total`,
  };
}
