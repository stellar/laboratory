import React, { useEffect } from 'react';
import OptionsTablePair from './OptionsTable/Pair';
import HelpMark from './HelpMark';
import TxTypePicker from './FormComponents/TxTypePicker';
import PubKeyPicker from './FormComponents/PubKeyPicker';
import SequencePicker from './FormComponents/SequencePicker';
import StroopsPicker from './FormComponents/StroopsPicker';
import MemoPicker from './FormComponents/MemoPicker';
import TimeBoundsPicker from './FormComponents/TimeBoundsPicker';
import {connect} from 'react-redux';
import {StrKey} from 'stellar-sdk';
import NETWORK from '../constants/network';
import {fetchSequence, fetchBaseFee, updateTxType, updateFeeBumpAttribute} from '../actions/transactionBuilder';
import TransactionImporter from './TransactionImporter';
import TX_TYPES from '../constants/transaction_types';

function TxBuilderAttributes(props) {
  let {onUpdate, attributes, horizonURL, dispatch, feeBumpAttributes, networkPassphrase} = props;
  const { txType, network } = props.state;

  useEffect(() => {
    dispatch(fetchBaseFee(horizonURL))
  }, [])
  
  return <div className="TransactionAttributes">
    <div className="TransactionOp__config TransactionOpConfig optionsTable">
      <OptionsTablePair label={<span>Transaction Type <HelpMark href="https://developers.stellar.org/docs/glossary/fee-bumps" /></span>}>
        <TxTypePicker
          value={txType}
          onUpdate={(value) => {dispatch(updateTxType(value))}}
        />
      </OptionsTablePair>
      {txType === TX_TYPES.REGULAR &&
      <React.Fragment>
      <OptionsTablePair label={<span>Source Account <HelpMark href="https://www.stellar.org/developers/guides/concepts/accounts.html" /></span>}>
        <PubKeyPicker
          value={attributes['sourceAccount']}
          onUpdate={(value) => {onUpdate('sourceAccount', value)}}
          />
        <p className="optionsTable__pair__content__note">If you don't have an account yet, you can create and fund a test net account with the <a href="#account-creator">account creator</a>.</p>
      </OptionsTablePair>
      <OptionsTablePair label={<span>Transaction Sequence Number <HelpMark href="https://www.stellar.org/developers/guides/concepts/transactions.html#sequence-number" /></span>}>
        <SequencePicker
          value={attributes['sequence']}
          onUpdate={(value) => {onUpdate('sequence', value)}}
          />
        <p className="optionsTable__pair__content__note">The transaction sequence number is usually one higher than current account sequence number.</p>
        <SequenceFetcher />
      </OptionsTablePair>
      <OptionsTablePair label={<span>Base Fee <HelpMark href="https://www.stellar.org/developers/guides/concepts/transactions.html#fee" /></span>}>
        <StroopsPicker
          value={attributes['fee']}
          onUpdate={(value) => {onUpdate('fee', value)}}
          />
        <p className="optionsTable__pair__content__note">The <a href="https://www.stellar.org/developers/guides/concepts/fees.html">network base fee</a> is currently set to {attributes['fee']} stroops ({attributes['fee'] / 1e7} lumens). Transaction fee is equal to base fee times number of operations in this transaction.</p>
      </OptionsTablePair>
      <OptionsTablePair optional={true} label={<span>Memo <HelpMark href="https://www.stellar.org/developers/guides/concepts/transactions.html#memo" /></span>}>
        <MemoPicker
          value={{
            type: attributes.memoType,
            content: attributes.memoContent,
          }}
          onUpdate={(value) => {onUpdate('memo', value)}}
          />
      </OptionsTablePair>
      <OptionsTablePair optional={true} label={<span>Time Bounds <HelpMark href="https://www.stellar.org/developers/guides/concepts/transactions.html#time-bounds" /></span>}>
        <TimeBoundsPicker
          value={{
            minTime: attributes.minTime,
            maxTime: attributes.maxTime
          }}
          onUpdate={(value) => {onUpdate('timebounds', value)}}
          />
        <p className="optionsTable__pair__content__note">Enter <a href="http://www.epochconverter.com/" target="_blank">unix timestamp</a> values of time bounds when this transaction will be valid.</p>
        <p className="optionsTable__pair__content__note">For regular transactions, it is highly recommended to set <code>max_time</code> to get <a href="https://github.com/stellar/stellar-core/issues/1811" target="_blank">a final result</a> of a transaction in a defined time.</p>
        <p className="optionsTable__pair__content__note">
          <a
            className="s-button"
            onClick={() => onUpdate('timebounds', {maxTime: Math.ceil(new Date().getTime()/1000) + 5*60})}
            >Set to 5 minutes from now</a>
          <br />
        </p>
      </OptionsTablePair>
      </React.Fragment>
    }
    {txType === TX_TYPES.FEE_BUMP &&
      <React.Fragment>
      <OptionsTablePair label={<span>Source Account <HelpMark href="https://www.stellar.org/developers/guides/concepts/accounts.html" /></span>}>
        <PubKeyPicker 
          value={feeBumpAttributes['sourceAccount']}
          onUpdate={(value) => {dispatch(updateFeeBumpAttribute({'sourceAccount': value}))}}
        />
        <p className="optionsTable__pair__content__note">The account responsible for paying the transaction fee.</p>
      </OptionsTablePair>
      <OptionsTablePair label={<span>Base Fee <HelpMark href="https://www.stellar.org/developers/guides/concepts/transactions.html#fee" /></span>}>
        <StroopsPicker
          value={feeBumpAttributes['maxFee']}
          onUpdate={(value) => {dispatch(updateFeeBumpAttribute({'maxFee': value}))}}
          />
        <p className="optionsTable__pair__content__note">The <a href="https://www.stellar.org/developers/guides/concepts/fees.html">network base fee</a> is currently set to {attributes['fee']} stroops ({attributes['fee'] / 1e7} lumens). Transaction fee is equal to base fee times number of operations in this transaction.</p>
      </OptionsTablePair>
      <OptionsTablePair label={<span>Inner Transaction XDR <HelpMark href="https://www.stellar.org/developers/guides/concepts/transactions.html#transaction-envelopes"/></span>}>
      <TransactionImporter
        value={feeBumpAttributes['innerTxXDR']}
        networkPassphrase={networkPassphrase}
        onUpdate={(value) => {dispatch(updateFeeBumpAttribute({'innerTxXDR': value}))}}
      />
      </OptionsTablePair>
      </React.Fragment>
    }
    </div>
  </div>
}

export default connect(chooseState)(TxBuilderAttributes);

class sequenceFetcherClass extends React.Component {
  render() {
    let {attributes, sequenceFetcherError} = this.props.state;
    let dispatch = this.props.dispatch;
    let horizonURL = this.props.horizonURL;
    if (!StrKey.isValidEd25519PublicKey(attributes.sourceAccount)) {
      return null;
    }

    let sequenceErrorMessage;
    if (sequenceFetcherError.length > 0) {
      sequenceErrorMessage = <span className="optionsTable__pair__content__note optionsTable__pair__content__note--alert">
        {sequenceFetcherError}
      </span>
    }

    let truncatedAccountId = attributes.sourceAccount.substr(0,10);

    return <p className="optionsTable__pair__content__note">
      <a
        className="s-button"
        onClick={() => dispatch(
          fetchSequence(attributes.sourceAccount, horizonURL)
        )}
        >Fetch next sequence number for account starting with "{truncatedAccountId}"</a>
      <br />
      <small>Fetching from: <code>{horizonURL}</code></small><br />
      {sequenceErrorMessage}
    </p>
  }
}

let SequenceFetcher = connect(chooseState)(sequenceFetcherClass);
function chooseState(state) {
  return {
    state: state.transactionBuilder,
    horizonURL: state.network.current.horizonURL,
    networkPassphrase: state.network.current.networkPassphrase,
  }
}
