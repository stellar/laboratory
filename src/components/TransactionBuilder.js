import React from 'react';
import {connect} from 'react-redux';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';
import TxBuilderAttributes from './TxBuilderAttributes';
import {
  addOperation,
  updateAttributes,
} from '../actions/transactionBuilder';
import OperationsBuilder from './OperationsBuilder';
import {getOperation} from '../data/operations';
import TxBuilderResult from './TxBuilderResult';
import {resetTxbuilder} from '../actions/transactionBuilder';

class TransactionBuilder extends React.Component {
  render() {
    let {dispatch} = this.props;
    let {
      attributes,
      operations,
    } = this.props.state;

    return <div className="TransactionBuilder">
      <div className="so-back">
        <div className="so-chunk">
          <div className="pageIntro">
            <p>The transaction builder lets you build a new Stellar transaction.</p>
            <p>
              This transaction will start out with no signatures. To make it into the ledger, this transaction will then need to be signed and submitted to the network.
            </p>
          </div>
          <p className="TransactionBuilder__clearBar">
            <a className="TransactionBuilder__clearBar__link"
            onClick={() => dispatch(resetTxbuilder())}>Clear form contents and start over</a>
          </p>
          <TxBuilderAttributes
            attributes={attributes}
            onUpdate={onAttributeUpdate.bind(this, dispatch)} />
          <OperationsBuilder />
          <div className="TransactionOperations__add">
            <button className="TransactionOperations__add__button s-button" onClick={() => dispatch(addOperation())}>
              + Add Operation
            </button>
          </div>
        </div>
      </div>
      <div className="so-back TransactionBuilder__result">
        <div className="so-chunk">
          <TxBuilderResult />
        </div>
      </div>
    </div>
  }
};

export default connect(chooseState)(TransactionBuilder);

function chooseState(state) {
  return {
    state: state.transactionBuilder,
  }
}

function onAttributeUpdate(dispatch, param, value) {
  let newAttributes = {};
  switch(param) {
  case 'sourceAccount':
    newAttributes.sourceAccount = value;
  break;
  case 'sequence':
    newAttributes.sequence = value;
    break;
  case 'fee':
    newAttributes.fee = value;
  break;
  case 'memo':
    newAttributes.memoType = value.type;
    newAttributes.memoContent = value.content;
  case 'timebounds':
    newAttributes.minTime = value.minTime;
    newAttributes.maxTime = value.maxTime;
  break;
  }
  dispatch(updateAttributes(newAttributes));
}
