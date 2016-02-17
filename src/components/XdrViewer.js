import React from 'react';
import {connect} from 'react-redux';
import _ from 'lodash';
import SelectPicker from './FormComponents/SelectPicker';
import extrapolateFromXdr from '../utilities/extrapolateFromXdr';
import TreeView from './TreeView';
import validateTxXdr from '../utilities/validateTxXdr';
import {updateXdrInput, updateXdrType} from '../actions/xdrViewer';

function XdrViewer(props) {
  let {dispatch, state} = props;

  let validation = validateTxXdr('');
  let messageClass = validation.result === 'error' ? 'xdrInput__message__alert' : 'xdrInput__message__success';
  let message = <p className={messageClass}>{validation.message}</p>

  let xdrNodes, treeView, errorMessage;
  if (state.input === '') {
    errorMessage = <p>Enter a base-64 encoded xdr blob to decode.</p>;
  } else if (state.type === '' || !_.has(xdrTypes, state.type)) {
    errorMessage = <p>Please select a valid xdr type</p>;
  } else {
    try {
      xdrNodes = extrapolateFromXdr(state.input, 'TransactionEnvelope');
      treeView = <TreeView nodes={extrapolateFromXdr(state.input, state.type)} />
    } catch (e) {
      errorMessage = <p>Unable to decode xdr input as {state.type}</p>;
    }
  }

  return <div>
    <div className="XdrViewer__setup so-back">
      <div className="so-chunk">
        <p className="XdrViewer__label">Input base-64 encoded xdr blob:</p>
        <div className="xdrInput__input">
          <textarea
            value={state.input}
            className="xdrInput__input__textarea"
            onChange={(event) => dispatch(updateXdrInput(event.target.value))}
            placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
        </div>
        <div className="xdrInput__message">
          {message}
        </div>

        <p className="XdrViewer__label">Xdr type:</p>
        <SelectPicker
          value={state.type}
          onUpdate={(input) => dispatch(updateXdrType(input))}
          items={xdrTypes}
        />
      </div>
    </div>
    <div className="XdrViewer__results so-back">
      <div className="so-chunk">
        {errorMessage}
        {treeView}
      </div>
    </div>
  </div>
}

export default connect(chooseState)(XdrViewer);
function chooseState(state) {
  return {
    state: state.xdrViewer,
  }
}

let xdrTypes = {
  'TransactionEnvelope': 'TransactionEnvelope',
  'TransactionMeta': 'TransactionMeta',
  'TransactionResult': 'TransactionResult',
  '': '---',
  'AccountEntry': 'AccountEntry',
  'AccountEntryExt': 'AccountEntryExt',
  'AccountFlags': 'AccountFlags',
  'AccountId': 'AccountId',
  'AccountMergeResult': 'AccountMergeResult',
  'AccountMergeResultCode': 'AccountMergeResultCode',
  'AllowTrustOp': 'AllowTrustOp',
  'AllowTrustOpAsset': 'AllowTrustOpAsset',
  'AllowTrustResult': 'AllowTrustResult',
  'AllowTrustResultCode': 'AllowTrustResultCode',
  'Asset': 'Asset',
  'AssetAlphaNum12': 'AssetAlphaNum12',
  'AssetAlphaNum4': 'AssetAlphaNum4',
  'AssetType': 'AssetType',
  'Auth': 'Auth',
  'BucketEntry': 'BucketEntry',
  'BucketEntryType': 'BucketEntryType',
  'ChangeTrustOp': 'ChangeTrustOp',
  'ChangeTrustResult': 'ChangeTrustResult',
  'ChangeTrustResultCode': 'ChangeTrustResultCode',
  'ClaimOfferAtom': 'ClaimOfferAtom',
  'CreateAccountOp': 'CreateAccountOp',
  'CreateAccountResult': 'CreateAccountResult',
  'CreateAccountResultCode': 'CreateAccountResultCode',
  'CreatePassiveOfferOp': 'CreatePassiveOfferOp',
  'CryptoKeyType': 'CryptoKeyType',
  'DecoratedSignature': 'DecoratedSignature',
  'DontHave': 'DontHave',
  'EnvelopeType': 'EnvelopeType',
  'Error': 'Error',
  'Hello': 'Hello',
  'InflationPayout': 'InflationPayout',
  'InflationResult': 'InflationResult',
  'InflationResultCode': 'InflationResultCode',
  'Int64': 'Int64',
  'LedgerEntry': 'LedgerEntry',
  'LedgerEntryChange': 'LedgerEntryChange',
  'LedgerEntryChangeType': 'LedgerEntryChangeType',
  'LedgerEntryData': 'LedgerEntryData',
  'LedgerEntryExt': 'LedgerEntryExt',
  'LedgerEntryType': 'LedgerEntryType',
  'LedgerHeader': 'LedgerHeader',
  'LedgerHeaderExt': 'LedgerHeaderExt',
  'LedgerHeaderHistoryEntry': 'LedgerHeaderHistoryEntry',
  'LedgerHeaderHistoryEntryExt': 'LedgerHeaderHistoryEntryExt',
  'LedgerKey': 'LedgerKey',
  'LedgerKeyAccount': 'LedgerKeyAccount',
  'LedgerKeyOffer': 'LedgerKeyOffer',
  'LedgerKeyTrustLine': 'LedgerKeyTrustLine',
  'LedgerUpgrade': 'LedgerUpgrade',
  'LedgerUpgradeType': 'LedgerUpgradeType',
  'ManageOfferEffect': 'ManageOfferEffect',
  'ManageOfferOp': 'ManageOfferOp',
  'ManageOfferResult': 'ManageOfferResult',
  'ManageOfferResultCode': 'ManageOfferResultCode',
  'ManageOfferSuccessResult': 'ManageOfferSuccessResult',
  'ManageOfferSuccessResultOffer': 'ManageOfferSuccessResultOffer',
  'Memo': 'Memo',
  'MemoType': 'MemoType',
  'MessageType': 'MessageType',
  'NodeId': 'NodeId',
  'OfferEntry': 'OfferEntry',
  'OfferEntryExt': 'OfferEntryExt',
  'OfferEntryFlags': 'OfferEntryFlags',
  'Operation': 'Operation',
  'OperationBody': 'OperationBody',
  'OperationMeta': 'OperationMeta',
  'OperationResult': 'OperationResult',
  'OperationResultCode': 'OperationResultCode',
  'OperationResultTr': 'OperationResultTr',
  'OperationType': 'OperationType',
  'PathPaymentOp': 'PathPaymentOp',
  'PathPaymentResult': 'PathPaymentResult',
  'PathPaymentResultCode': 'PathPaymentResultCode',
  'PathPaymentResultSuccess': 'PathPaymentResultSuccess',
  'PaymentOp': 'PaymentOp',
  'PaymentResult': 'PaymentResult',
  'PaymentResultCode': 'PaymentResultCode',
  'PeerAddress': 'PeerAddress',
  'Price': 'Price',
  'PublicKey': 'PublicKey',
  'ScpBallot': 'ScpBallot',
  'ScpEnvelope': 'ScpEnvelope',
  'ScpNomination': 'ScpNomination',
  'ScpQuorumSet': 'ScpQuorumSet',
  'ScpStatement': 'ScpStatement',
  'ScpStatementConfirm': 'ScpStatementConfirm',
  'ScpStatementExternalize': 'ScpStatementExternalize',
  'ScpStatementPledges': 'ScpStatementPledges',
  'ScpStatementPrepare': 'ScpStatementPrepare',
  'ScpStatementType': 'ScpStatementType',
  'SequenceNumber': 'SequenceNumber',
  'SetOptionsOp': 'SetOptionsOp',
  'SetOptionsResult': 'SetOptionsResult',
  'SetOptionsResultCode': 'SetOptionsResultCode',
  'Signer': 'Signer',
  'SimplePaymentResult': 'SimplePaymentResult',
  'StellarMessage': 'StellarMessage',
  'StellarValue': 'StellarValue',
  'StellarValueExt': 'StellarValueExt',
  'ThresholdIndices': 'ThresholdIndices',
  'TimeBounds': 'TimeBounds',
  'Transaction': 'Transaction',
  'TransactionExt': 'TransactionExt',
  'TransactionHistoryEntry': 'TransactionHistoryEntry',
  'TransactionHistoryEntryExt': 'TransactionHistoryEntryExt',
  'TransactionHistoryResultEntry': 'TransactionHistoryResultEntry',
  'TransactionHistoryResultEntryExt': 'TransactionHistoryResultEntryExt',
  'TransactionResultCode': 'TransactionResultCode',
  'TransactionResultExt': 'TransactionResultExt',
  'TransactionResultPair': 'TransactionResultPair',
  'TransactionResultResult': 'TransactionResultResult',
  'TransactionResultSet': 'TransactionResultSet',
  'TransactionSet': 'TransactionSet',
  'TrustLineEntry': 'TrustLineEntry',
  'TrustLineEntryExt': 'TrustLineEntryExt',
  'TrustLineFlags': 'TrustLineFlags',
  'Uint64': 'Uint64',
};
