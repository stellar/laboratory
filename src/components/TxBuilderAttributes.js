import React from 'react';
import OptionsTablePair from './OptionsTable/Pair';
import PubKeyPicker from './FormComponents/PubKeyPicker';
import SequencePicker from './FormComponents/SequencePicker';
import StroopsPicker from './FormComponents/StroopsPicker';
import MemoPicker from './FormComponents/MemoPicker';
import {connect} from 'react-redux';
import {Account} from 'stellar-sdk';
import {fetchSequence} from '../actions/transactionBuilder';

export default function TxBuilderAttributes(props) {
  let {onUpdate, attributes} = props;
  return <div className="TransactionAttributes">
    <div className="TransactionOp__config TransactionOpConfig optionsTable">
      <OptionsTablePair label="Source Account">
        <PubKeyPicker
          value={attributes['sourceAccount']}
          onUpdate={(value) => {onUpdate('sourceAccount', value)}}
          />
      </OptionsTablePair>
      <OptionsTablePair label="Transaction Sequence Number">
        <SequencePicker
          value={attributes['sequence']}
          onUpdate={(value) => {onUpdate('sequence', value)}}
          />
        <p className="optionsTable__pair__content__note">The transaction sequence number is usually one higher than current account sequence number.</p>
        <SequenceFetcher />
      </OptionsTablePair>
      <OptionsTablePair label="Base Fee" optional={true}>
        <StroopsPicker
          value={attributes['fee']}
          onUpdate={(value) => {onUpdate('fee', value)}}
          />
        <p className="optionsTable__pair__content__note">The <a href="https://www.stellar.org/developers/learn/concepts/fees.html">network base fee</a> is currently set to 100 stroops (0.00001 XLM). Transaction fee is equal to base fee times number of operations in this transaction.</p>
      </OptionsTablePair>
      <OptionsTablePair label="Memo" optional={true}>
        <MemoPicker
          value={{
            type: attributes.memoType,
            content: attributes.memoContent,
          }}
          onUpdate={(value) => {onUpdate('memo', value)}}
          />
      </OptionsTablePair>
    </div>
  </div>
}

class sequenceFetcherClass extends React.Component {
  render() {
    let {attributes, sequenceFetcherError} = this.props.state;
    let dispatch = this.props.dispatch;
    let network = this.props.network;
    if (!Account.isValidAccountId(attributes.sourceAccount)) {
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
          fetchSequence(attributes.sourceAccount, network.available[network.current].url)
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
    network: state.network,
  }
}
