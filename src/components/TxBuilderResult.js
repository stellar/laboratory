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

    let finalResult, errorTitle;
    if (validationErrors.length > 0) {
      errorTitle = 'Form validation errors:';
      finalResult = formatErrorList(validationErrors);
    } else {
      let transactionBuild = buildTransaction(attributes, operations);

      if (transactionBuild.errors.length > 0) {
        errorTitle = `Transaction building errors:`;
        finalResult = formatErrorList(transactionBuild.errors);
      } else {
        errorTitle = `Transaction Envelope XDR:`;
        finalResult = transactionBuild.xdr;
      }
    }

    return <div className="TxBuilderResult">
      <h3>{errorTitle}</h3>
      <EasySelect plain={true}><pre className="TransactionXDR so-code TransactionBuilderResult__code">
        <code>{finalResult}</code>
      </pre></EasySelect>
      {/* TODO: Implement button signing (while refactoring routing)
      <button className="s-button">Sign this transaction</button>
      */}
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
