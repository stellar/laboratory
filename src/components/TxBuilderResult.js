import React from 'react';
import {connect} from 'react-redux';
import {Network} from 'stellar-sdk';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';
import {EasySelect} from './EasySelect';
import Libify from '../utilities/Libify';
import {txSignerLink, xdrViewer} from '../utilities/linkBuilder';
import scrollOnAnchorOpen from '../utilities/scrollOnAnchorOpen';
import clickToSelect from '../utilities/clickToSelect';
import NETWORK from '../constants/network';

export default class TxBuilderResult extends React.Component {
  render() {
    let {attributes, operations} = this.props.state;
    let xdrResult, buildError;
    let validationErrors = [];

    if (attributes.sourceAccount === '') {
      validationErrors.push('Source account ID is a required field');
    }
    if (attributes.sequence === '') {
      validationErrors.push('Sequence number is a required field');
    }
    let memoIsNone = attributes.memoType === 'MEMO_NONE' || attributes.memoType === '';
    if (!memoIsNone && attributes.memoContent === '') {
      validationErrors.push('Memo content is required if memo type is selected');
    }

    let finalResult, errorTitleText, successTitleText, signingInstructions, signingLink, xdrLink;
    if (validationErrors.length > 0) {
      errorTitleText = 'Form validation errors:';
      finalResult = formatErrorList(validationErrors);
    } else {
      let transactionBuild = Libify.buildTransaction(attributes, operations, new Network(this.props.networkPassphrase));

      if (transactionBuild.errors.length > 0) {
        errorTitleText = `Transaction building errors:`;
        finalResult = formatErrorList(transactionBuild.errors);
      } else {
        successTitleText = `Success! Transaction Envelope XDR:`;
        finalResult = <div>
          Network Passphrase:<br />
          {this.props.networkPassphrase}<br />
          Hash:<br />
          {transactionBuild.hash}<br />
          XDR:<br />
          {transactionBuild.xdr}
          </div>
        signingInstructions = <p className="TransactionBuilderResult__instructions">
          In order for the transaction to make it into the ledger, a transaction must be successfully
          signed and submitted to the network. The laboratory provides
          the <a href="#txsigner">Transaction Signer</a> to for signing a
          transaction, and the <a href="#explorer?resource=transactions&endpoint=create">Post Transaction endpoint</a> for
          submitting one to the network.
        </p>;
        signingLink = <a className="s-button"
          href={txSignerLink(transactionBuild.xdr)}
          onClick={scrollOnAnchorOpen}>Sign in Transaction Signer</a>
        xdrLink = <a className="s-button"
          href={xdrViewer(transactionBuild.xdr, 'TransactionEnvelope')}
          onClick={scrollOnAnchorOpen}>View in XDR Viewer</a>
      }
    }

    let errorTitle = errorTitleText ? <h3 className="TransactionBuilderResult__error">{errorTitleText}</h3> : null
    let successTitle = successTitleText ? <h3 className="TransactionBuilderResult__success">{successTitleText}</h3> : null

    return <div className="TransactionBuilderResult">
      {successTitle}
      {errorTitle}
      <pre className="TransactionXDR so-code so-code__wrap TransactionBuilderResult__code" onClick={clickToSelect}>
        <code>{finalResult}</code>
      </pre>
      {signingInstructions}
      {signingLink} {xdrLink}
    </div>
  }
}

export default connect(chooseState)(TxBuilderResult);

function chooseState(state) {
  return {
    state: state.transactionBuilder,
    networkPassphrase: state.network.current.networkPassphrase,
  }
}

function formatErrorList(errors) {
  return _.reduce(errors, (result, error) => {
    return `${result}- ${error} \n`;
  }, '');
}
