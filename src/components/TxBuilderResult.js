import React from 'react';
import {connect} from 'react-redux';
import {
  Account,
  TransactionBuilder,
  Operation,
  Asset,
  Memo,
  UnsignedHyper,
} from 'stellar-sdk';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';
import {EasySelect} from './EasySelect';
import Libify from '../utilities/Libify';
import {txSignerLink, xdrViewer} from '../utilities/linkBuilder';
import clickToSelect from '../utilities/clickToSelect';

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
      let transactionBuild = buildTransaction(attributes, operations);

      if (transactionBuild.errors.length > 0) {
        errorTitleText = `Transaction building errors:`;
        finalResult = formatErrorList(transactionBuild.errors);
      } else {
        successTitleText = `Success! Transaction Envelope XDR:`;
        finalResult = transactionBuild.xdr;
        signingInstructions = <p className="TransactionBuilderResult__instructions">
          In order for the transaction to make it into the ledger, a transaction must be successfully
          signed and submitted to the network. The laboratory provides
          the <a href="#txsigner">Transaction Signer</a> to for signing a
          transaction, and the <a href="#explorer?resource=transactions&endpoint=create">Post Transaction endpoint</a> for
          submitting one to the network.
        </p>;
        signingLink = <a className="s-button"
          href={txSignerLink(transactionBuild.xdr)}>Sign in Transaction Signer</a>
        xdrLink = <a className="s-button"
          href={xdrViewer(transactionBuild.xdr, 'TransactionEnvelope')}>View in XDR Viewer</a>
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
  }
}

function buildTransaction(attributes, operations) {
  let result = {
    errors: [],
    xdr: '',
  };

  try {
    var account = new Account(attributes.sourceAccount, UnsignedHyper.fromString(attributes.sequence).subtract(1).toString());

    let opts = {};
    if (attributes.fee !== '') {
      opts.fee = attributes.fee;
    }

    var transaction = new TransactionBuilder(account, opts)

    if (attributes.memoType !== 'MEMO_NONE') {
      try {
        transaction = transaction.addMemo(Libify.Memo({
          type: attributes.memoType,
          content: attributes.memoContent,
        }));
      } catch(e) {
        console.error(e);
        result.errors.push(`Memo: ${e.message}`);
      }
    }

    _.each(operations, (op, index) => {
      try {
        transaction = transaction.addOperation(Libify.Operation(op.name, op.attributes));
      } catch(e) {
        console.error(e);
        result.errors.push(`Operation #${index + 1}: ${e.message}`);
      }
    })

    transaction = transaction.build();
    result.xdr = transaction.toEnvelope().toXDR('base64');
  } catch(e) {
    console.error(e);
    result.errors.push(e.message);
  }

  return result;
}

function formatErrorList(errors) {
  return _.reduce(errors, (result, error) => {
    return `${result}- ${error} \n`;
  }, '');
}
