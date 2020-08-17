import React from 'react';
import {connect} from 'react-redux';
import { isConnected } from "@stellar/lyra-api";
import reduce from 'lodash/reduce'
import {EasySelect} from './EasySelect';
import Libify from '../utilities/Libify';
import {txSignerLink, xdrViewer} from '../utilities/linkBuilder';
import scrollOnAnchorOpen from '../utilities/scrollOnAnchorOpen';
import TX_TYPES from '../constants/transaction_types';
import TxLyraSign from "./TxLyraSign";


class TxBuilderResult extends React.Component {
  
  render() {
    let {attributes, operations, feeBumpAttributes, txType} = this.props.state;

    const getRegularTxValidationErrors = () => {
      const errors = [];
      if (attributes.sourceAccount === '') {
        errors.push('Source account ID is a required field');
      }
      if (attributes.sequence === '') {
        errors.push('Sequence number is a required field');
      }
      let memoIsNone = attributes.memoType === 'MEMO_NONE' || attributes.memoType === '';
      if (!memoIsNone && attributes.memoContent === '') {
        errors.push('Memo content is required if memo type is selected');
      }
      return errors;
    }

    const getFeeBumpTxValidationErrors = () => {
      const errors = [];
      if (feeBumpAttributes.sourceAccount === '') {
        errors.push('Source Account is a required field');
      }
      if (feeBumpAttributes.maxFee === '') {
        errors.push('Base Fee is a required field');
      }
      if (feeBumpAttributes.innerTxXDR === '') {
        errors.push('Inner Transaction is a required field');
      }
      return errors;
    }

    let validationErrors;
    if (txType === TX_TYPES.FEE_BUMP) {
      validationErrors = getFeeBumpTxValidationErrors()
    } else {
      validationErrors = getRegularTxValidationErrors()
    }
    
    let finalResult, errorTitleText, successTitleText, signingInstructions, signingLink, xdrLink, transactionBuild;
    if (validationErrors.length > 0) {
      errorTitleText = "Form validation errors:";
      finalResult = formatErrorList(validationErrors);
    } else {
      transactionBuild = txType === TX_TYPES.FEE_BUMP ? Libify.buildFeeBumpTransaction(feeBumpAttributes, this.props.networkPassphrase) :
       Libify.buildTransaction(attributes, operations, this.props.networkPassphrase);

      if (transactionBuild.errors.length > 0) {
        errorTitleText = `Transaction building errors:`;
        finalResult = formatErrorList(transactionBuild.errors);
      } else {
        successTitleText = `Success! Transaction Envelope XDR:`;
        finalResult = (
          <div>
            Network Passphrase:
            <br />
            {this.props.networkPassphrase}
            <br />
            Hash:
            <br />
            <EasySelect>{transactionBuild.hash}</EasySelect>
            <br />
            XDR:
            <br />
            <EasySelect>{transactionBuild.xdr}</EasySelect>
          </div>
        );
        signingInstructions = (
          <p className="TransactionBuilderResult__instructions">
            In order for the transaction to make it into the ledger, a
            transaction must be successfully signed and submitted to the
            network. The laboratory provides the{" "}
            <a href="#txsigner">Transaction Signer</a> to for signing a
            transaction, and the{" "}
            <a href="#explorer?resource=transactions&endpoint=create">
              Post Transaction endpoint
            </a>{" "}
            for submitting one to the network.
          </p>
        );
        signingLink = (
          <a
            className="s-button"
            href={txSignerLink(transactionBuild.xdr)}
            onClick={scrollOnAnchorOpen}
          >
            Sign in Transaction Signer
          </a>
        );
        xdrLink = (
          <a
            className="s-button"
            href={xdrViewer(transactionBuild.xdr, "TransactionEnvelope")}
            onClick={scrollOnAnchorOpen}
          >
            View in XDR Viewer
          </a>
        );
      }
    }

    let errorTitle = errorTitleText ? (
      <h3 className="TransactionBuilderResult__error">{errorTitleText}</h3>
    ) : null;
    let successTitle = successTitleText ? (
      <h3 className="TransactionBuilderResult__success">{successTitleText}</h3>
    ) : null;

    return (
      <div className="TransactionBuilderResult">
        {successTitle}
        {errorTitle}
        <pre className="TransactionXDR so-code so-code__wrap TransactionBuilderResult__code">
          <code>{finalResult}</code>
        </pre>
        {signingInstructions}
        {signingLink} {xdrLink}
        {isConnected() && transactionBuild && !transactionBuild.errors.length ? (
          <TxLyraSign xdr={transactionBuild.xdr} />
        ) : null}
      </div>
    );
  }
}

export default connect(chooseState)(TxBuilderResult);

function chooseState(state) {
  return {
    state: state.transactionBuilder,
    networkPassphrase: state.network.current.networkPassphrase,
  };
}

function formatErrorList(errors) {
  return reduce(
    errors,
    (result, error) => {
      return `${result}- ${error} \n`;
    },
    "",
  );
}
