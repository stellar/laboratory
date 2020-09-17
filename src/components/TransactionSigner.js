import React from 'react';
import {connect} from 'react-redux';
import {TransactionBuilder, FeeBumpTransaction} from 'stellar-sdk';
import { isConnected } from "@stellar/lyra-api";
import isUndefined from 'lodash/isUndefined'
import map from 'lodash/map'
import TransactionImporter from './TransactionImporter';
import {
  importFromXdr,
  clearTransaction,
  setSecrets,
  setBIPPath,
  signWithLedger,
} from '../actions/transactionSigner';
import {EasySelect} from './EasySelect';
import OptionsTablePair from './OptionsTable/Pair';
import SecretKeyPicker from './FormComponents/SecretKeyPicker';
import MultiPicker from './FormComponents/MultiPicker';
import BipPathPicker from './FormComponents/BipPathPicker';
import {txPostLink, xdrViewer, feeBumpTxLink} from '../utilities/linkBuilder';
import HelpMark from './HelpMark';
import clickToSelect from '../utilities/clickToSelect';
import scrollOnAnchorOpen from '../utilities/scrollOnAnchorOpen';
import extrapolateFromXdr from '../utilities/extrapolateFromXdr';
import validateTxXdr from '../utilities/validateTxXdr';
import NETWORK from '../constants/network';
import Libify from '../utilities/Libify';
import {addEventHandler} from '../utilities/metrics'
import transactionSignerMetrics from '../metricsHandlers/transactionSigner'
import TxLyraSign from "./TxLyraSign";

const {signTransaction} = Libify

addEventHandler(transactionSignerMetrics)

class TransactionSigner extends React.Component {
  render() {
    let {dispatch, networkPassphrase} = this.props;
    let {xdr, signers, bipPath, ledgerwalletStatus} = this.props.state;
    let content;

    if (validateTxXdr(xdr, networkPassphrase).result !== 'success') {
      content = <div className="so-back">
        <div className="so-chunk">
          <div className="TxSignerImport TransactionSigner__import">
            <p className="TxSignerImport__title">Import a transaction envelope in XDR format:</p>
            <TransactionImporter networkPassphrase={networkPassphrase} onImport={(xdr) => dispatch(importFromXdr(xdr))}/>
          </div>
        </div>
      </div>
    } else {
      let ledgerSigs = ledgerwalletStatus.signatures;
      let result = signTransaction(xdr, signers, networkPassphrase, ledgerSigs);
      let transaction = TransactionBuilder.fromXDR(xdr, networkPassphrase);

      let infoTable = {
        'Signing for': <pre className="so-code so-code__wrap"><code>{networkPassphrase}</code></pre>,
        'Transaction Envelope XDR': <EasySelect plain={true}><pre className="so-code so-code__wrap"><code>{xdr}</code></pre></EasySelect>,
        'Transaction Hash': <EasySelect plain={true}><pre className="so-code so-code__wrap"><code>{transaction.hash().toString('hex')}</code></pre></EasySelect>,
      };

      if (transaction instanceof FeeBumpTransaction) {
        infoTable = {
          ...infoTable,
          ...{
            'Fee source account': transaction.feeSource,
            'Transaction Fee (stroops)': transaction.fee,
            'Number of existing signatures': transaction.signatures.length,
            'Inner transaction hash': <EasySelect plain={true}><pre className="so-code so-code__wrap"><code>{transaction.innerTransaction.hash().toString('hex')}</code></pre></EasySelect>,
            'Inner transaction source account': transaction.innerTransaction.source,
            'Inner transaction sequence number': transaction.innerTransaction.sequence,
            'Inner transaction fee (stroops)': transaction.innerTransaction.fee,
            'Inner transaction number of operations': transaction.innerTransaction.operations.length,
            'Inner transaction number of existing signatures': transaction.innerTransaction.signatures.length,
          }
        };
      } else {
        infoTable = {
          ...infoTable,
          ...{
            'Source account': transaction.source,
            'Sequence number': transaction.sequence,
            'Transaction Fee (stroops)': transaction.fee,
            'Number of operations': transaction.operations.length,
            'Number of existing signatures': transaction.signatures.length,
          }
        };
      }

      let codeResult, submitLink, xdrLink, resultTitle, submitInstructions, feeBumpLink;

      if (!isUndefined(result.xdr)) {
        codeResult = <pre className="TxSignerResult__xdr so-code so-code__wrap" onClick={clickToSelect}><code>{result.xdr}</code></pre>;
        submitLink = <a
          className="s-button TxSignerResult__submit"
          href={txPostLink(result.xdr)}
          onClick={scrollOnAnchorOpen}
          >Submit in Transaction Submitter</a>;
        xdrLink = <a
          className="s-button TxSignerResult__submit"
          href={xdrViewer(result.xdr, 'TransactionEnvelope')}
          onClick={scrollOnAnchorOpen}
          >View in XDR Viewer</a>;
        feeBumpLink = <a
          className="s-button TxSignerResult__submit"
          href={feeBumpTxLink(result.xdr)}
          onClick={scrollOnAnchorOpen}
        >Wrap with Fee Bump</a>
        resultTitle = <h3 className="TxSignerResult__title">Transaction signed!</h3>;
        submitInstructions = <p className="TxSignerResult__instructions">
          Now that this transaction is signed, you can submit it to the network. Horizon provides an endpoint called Post Transaction that will relay your transaction to the network and inform you of the result.
        </p>
      }

      let ledgerwalletMessage;
      if (ledgerwalletStatus.message) {

        let messageAlertType;
        if (ledgerwalletStatus.status === 'loading') {
          messageAlertType = 's-alert--info';
        } else if (ledgerwalletStatus.status === 'success') {
          messageAlertType = 's-alert--success';
        } else if (ledgerwalletStatus.status === 'failure') {
          messageAlertType = 's-alert--alert';
        }

        ledgerwalletMessage = <div>
          <br />
          <div className={`s-alert TxSignerKeys__ledgerwallet_message ${messageAlertType}`}> {ledgerwalletStatus.message} </div>
        </div>
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
                {map(infoTable, (content, label) => {
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
              <p className="TxSignerKeys__title">Signatures <HelpMark href="https://developers.stellar.org/docs/glossary/multisig/" /></p>
              <div className="optionsTable">
                <OptionsTablePair label="Add Signer">
                  <MultiPicker
                    component={SecretKeyPicker}
                    value={signers}
                    onUpdate={(value) => dispatch(setSecrets(value))}
                  />
                </OptionsTablePair>
                <OptionsTablePair label="Ledger Wallet">
                  <BipPathPicker
                    value={bipPath}
                    onUpdate={(value) => dispatch(setBIPPath(value))}
                  />
                  <button
                    className="s-button TxSignerKeys__signBipPath"
                    onClick={() => {dispatch(signWithLedger(xdr, bipPath, networkPassphrase))}}
                  >Sign with BIP Path</button>
                  {ledgerwalletMessage}
                </OptionsTablePair>
                {isConnected() && (
                    <OptionsTablePair label="Lyra">
                      <TxLyraSign xdr={xdr} />
                    </OptionsTablePair>
                  )}
              </div>

            </div>
          </div>
        </div>
        <div className="so-back TxSignerResult TransactionSigner__result">
          <div className="so-chunk">
            {resultTitle}
            <p className="TxSignerResult__summary">{result.message}</p>
            {codeResult}
            {submitInstructions}
            {submitLink} {xdrLink} {feeBumpLink}
          </div>
        </div>
      </div>
    }
    return <div className="TransactionSigner">
      <div className="so-back">
        <div className="so-chunk">
          <div className="pageIntro">
            <p>
              The transaction signer lets you add signatures to a Stellar transaction. Signatures are used in the network to prove that the account is authorized to perform the operations in the transaction.
            </p>
            <p>
              For simple transactions, you only need one signature from the correct account. Some advanced signatures may require more than one signature if there are multiple source accounts or signing keys.
            </p>
            <p><a href="https://developers.stellar.org/docs/glossary/multisig/" target="_blank">Read more about signatures on the developer's site.</a></p>
          </div>
        </div>
      </div>
      {content}
    </div>
  }
}

export default connect(chooseState)(TransactionSigner);

function chooseState(state) {
  return {
    state: state.transactionSigner,
    networkPassphrase: state.network.current.networkPassphrase,
  }
}


