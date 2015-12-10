import React from 'react';
import {connect} from 'react-redux';
import Picker from './FormComponents/Picker';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';
import {getOperation} from '../data/operations';

class OperationsBuilder extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <div className="TransactionOperations">
      {_.map(this.props.ops, (op, index) => {
        return operation(this.props.ops, op, index);
      })}
    </div>
  }
}

// takes in op state from the reducer
function operation(ops, op, index) {
  let opConfig = getOperation(op.name);
  let attributePickers;
  if (typeof opConfig !== 'undefined') {
    attributePickers = _.map(opConfig.params, (param, paramKey) => {
      return Picker({
        type: param.pickerType,
        onUpdate: function() {},
        label: param.label,
        required: true,
        key: paramKey,
      })
    });
  }

  let removeLink;
  if (true) {
    removeLink = <p className="TransactionOpMeta__remove">
      <a>remove</a>
    </p>;
  }

  return <div className="TransactionOp" key={op.id}>
    <div className="TransactionOp__meta TransactionOpMeta">
      <div className="TransactionOpMeta__order">
        <input className="TransactionOpMeta__order__input" type="text" defaultValue={2} maxLength="2" />
      </div>
      {removeLink}
    </div>
    <div className="TransactionOp__config TransactionOpConfig optionsTable">
      {Picker({
        type: 'OperationType',
        onUpdate: function() {},
        label: 'Operation Type',
        required: true,
        key: 'operationType',
      })}
      {attributePickers}
    </div>
  </div>;
}

export default connect(chooseState)(OperationsBuilder);

function chooseState(state) {
  return {
    ops: state.transactionBuilder.operations,
  }
}
