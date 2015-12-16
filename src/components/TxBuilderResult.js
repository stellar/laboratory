import React from 'react';
import {connect} from 'react-redux';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';
import {Account, TransactionBuilder, Operation, Asset, Memo} from 'stellar-sdk';

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
    if (attributes.fee === '') {
      validationErrors.push('Transation fee is a required field');
    }
    if (attributes.memoType !== 'MEMO_NONE' && attributes.memoContent === '') {
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
      <pre className="TransactionXDR so-code TransactionBuilderResult__code"><code>{finalResult}</code></pre>
      <button className="s-button">Sign this transaction</button>
    </div>
  }
}

export default connect(chooseState)(TxBuilderResult);

function chooseState(state) {
  return {
    state: state.transactionBuilder,
    network: state.network
  }
}

function buildTransaction(attributes, operations) {
  let result = {
    errors: [],
    xdr: '',
  };

  try {
    var account = new Account(attributes.sourceAccount, attributes.sequence);
    var transaction = new TransactionBuilder(account)

    if (attributes.memoType !== 'MEMO_NONE') {
      try {
        transaction = transaction.addMemo(jsLibifyMemo({
          type: attributes.memoType,
          content: attributes.memoContent,
        }));
      } catch(e) {
        result.errors.push(`Memo: ${e.message}`);
      }
    }

    _.each(operations, (op, index) => {
      if (op.name === '') {
        result.errors.push(`Operation #${index + 1}: operation type not selected`);
        return;
      }

      try {
        let atts = op.attributes;
        let opOpts = {};

        opOpts.destination = atts.destination;
        opOpts.asset = jsLibifyAsset(atts.asset);

        // TODO: refactor this to somehow automatically jsLibify everything
        if (op.name === 'payment') {
          opOpts.amount = atts.amount;
        } else if (op.name === 'createAccount') {
          opOpts.startingBalance = atts.startingBalance;
        }

        if (typeof atts.source !== 'undefined' && atts.source !== '') {
          opOpts.source = atts.source;
        }

        transaction = transaction.addOperation(Operation[op.name](opOpts))
      } catch(e) {
        result.errors.push(`Operation #${index + 1}: ${e.message}`);
      }
    })

    transaction = transaction.build();
    result.xdr = transaction.toEnvelope().toXDR('base64');
  } catch(e) {
    result.errors.push(e.message);
  }

  return result;
}

function formatErrorList(errors) {
  return _.reduce(errors, (result, error) => {
    return `${result}- ${error} \n`;
  }, '');
}

function jsLibifyAsset(opts) {
  if (typeof opts === 'undefined') {
    return Asset.native();
  }

  if (opts.type === '' || opts.type === 'native') {
    return Asset.native();
  }

  return new Asset(opts.code, opts.issuer);
}

function jsLibifyMemo(opts) {
  switch(opts.type) {
  case 'MEMO_TEXT':
    return Memo.text(opts.content);
  case 'MEMO_ID':
    return Memo.id(opts.content);
  case 'MEMO_HASH':
    return Memo.hash(opts.content);
  case 'MEMO_RETURN':
    return Memo.returnHash(opts.content);
  }
}
