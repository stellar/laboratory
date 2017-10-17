import React from 'react';
import OptionsTablePair from './OptionsTable/Pair';
import HelpMark from './HelpMark';
import PubKeyPicker from './FormComponents/PubKeyPicker';
import SequencePicker from './FormComponents/SequencePicker';
import StroopsPicker from './FormComponents/StroopsPicker';
import MemoPicker from './FormComponents/MemoPicker';
import TimeBoundsPicker from './FormComponents/TimeBoundsPicker';
import {connect} from 'react-redux';
import {StrKey} from 'stellar-sdk';
import NETWORK from '../constants/network';
import {fetchSequence} from '../actions/transactionBuilder';

export default function TxBuilderAttributes(props) {
  let {onUpdate, attributes} = props;

  return <div className="TransactionAttributes">
    <div className="TransactionOp__config TransactionOpConfig optionsTable">
      <OptionsTablePair label={<span>Source Account <HelpMark href="https://www.stellar.org/developers/learn/concepts/accounts.html" /></span>}>
        <PubKeyPicker
          value={attributes['sourceAccount']}
          onUpdate={(value) => {onUpdate('sourceAccount', value)}}
          />
        <p className="optionsTable__pair__content__note">If you don't have an account yet, you can create and fund a test net account with the <a href="#account-creator">account creator</a>.</p>
      </OptionsTablePair>
      <OptionsTablePair label={<span>Transaction Sequence Number <HelpMark href="https://www.stellar.org/developers/learn/concepts/transactions.html#sequence-number" /></span>}>
        <SequencePicker
          value={attributes['sequence']}
          onUpdate={(value) => {onUpdate('sequence', value)}}
          />
        <p className="optionsTable__pair__content__note">The transaction sequence number is usually one higher than current account sequence number.</p>
        <SequenceFetcher />
      </OptionsTablePair>
      <OptionsTablePair optional={true} label={<span>Base Fee <HelpMark href="https://www.stellar.org/developers/learn/concepts/transactions.html#fee" /></span>}>
        <StroopsPicker
          value={attributes['fee']}
          onUpdate={(value) => {onUpdate('fee', value)}}
          />
        <p className="optionsTable__pair__content__note">The <a href="https://www.stellar.org/developers/learn/concepts/fees.html">network base fee</a> is currently set to 100 stroops (0.00001 lumens). Transaction fee is equal to base fee times number of operations in this transaction.</p>
      </OptionsTablePair>
      <OptionsTablePair optional={true} label={<span>Memo <HelpMark href="https://www.stellar.org/developers/learn/concepts/transactions.html#memo" /></span>}>
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
      </OptionsTablePair>
    </div>
  </div>
}

class sequenceFetcherClass extends React.Component {
  render() {
    let {attributes, sequenceFetcherError} = this.props.state;
    let dispatch = this.props.dispatch;
    let currentNetwork = this.props.currentNetwork;
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
          fetchSequence(attributes.sourceAccount, NETWORK.available[currentNetwork].url)
        )}
        >Fetch next sequence number for account starting with "{truncatedAccountId}"</a>
      <br />
      {sequenceErrorMessage}
    </p>
  }
}

let SequenceFetcher = connect(chooseState)(sequenceFetcherClass);
function chooseState(state) {
  return {
    state: state.transactionBuilder,
    currentNetwork: state.network.current,
  }
}
