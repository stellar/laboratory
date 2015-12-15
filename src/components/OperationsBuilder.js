import React from 'react';
import {connect} from 'react-redux';
import Picker from './FormComponents/Picker';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';
import {getOperation} from '../data/operations';
import {
  addOperation,
  removeOperation,
  updateOperationType,
  updateOperationAttributes,
  reorderOperation,
} from '../actions/transactionBuilder';

class OperationsBuilder extends React.Component {
  constructor() {
    super();
  }
  render() {
    return <div className="TransactionOperations">
      {_.map(this.props.ops, (op, index) => {
        return operation(this.props.ops, index, this.props.dispatch);
      })}
    </div>
  }
}

// takes in op state from the reducer
let operation = (ops, index, dispatch) => {
  let op = ops[index];
  let opConfig = getOperation(op.name);
  let attributePickers;
  if (typeof opConfig !== 'undefined') {
    attributePickers = _.map(opConfig.params, (param, paramKey) => {
      return Picker({
        type: param.pickerType,
        onUpdate: (values) => {
          let actionValue = values;
          if ('value' in values) {
            actionValue = values.value;
          }

          dispatch(updateOperationAttributes(op.id, {
            [paramKey]: actionValue
          }))
        },
        label: param.label,
        required: true,
        key: paramKey,
      })
    });
    attributePickers.push(Picker({
      type: 'PubKey',
      onUpdate: ({value}) => {
        dispatch(updateOperationAttributes(op.id, value))
      },
      label: 'Source Account',
      key: 'source',
    }))
  }

  let removeLink;
  if (ops.length > 1) {
    removeLink = <p className="TransactionOpMeta__remove">
      <a onClick={() => dispatch(removeOperation(op.id))}>remove</a>
    </p>;
  }

  return <div className="TransactionOp" key={op.id}>
    <div className="TransactionOp__meta TransactionOpMeta">
      <div className="TransactionOpMeta__order">
        <BlurNumberInput
          value={index + 1}
          onUpdate={(value) => dispatch(reorderOperation(op.id, value))}
          maxLength="2"
          className="TransactionOpMeta__order__input" />
      </div>
      {removeLink}
    </div>
    <div className="TransactionOp__config TransactionOpConfig optionsTable">
      {Picker({
        type: 'OperationType',
        onUpdate: ({value}) => {
          dispatch(updateOperationType(op.id, value))
        },
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


// BlurNumberInput is a controller input component that calls onUpdate only when
// the user unfocuses the input
class BlurNumberInput extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: props.value,
    }
  }
  componentWillReceiveProps(nextProps) {
    this.setState({
      currentValue: nextProps.value
    });
  }
  onChange(event) {
    this.setState({
      currentValue: event.target.value
    });
  }
  onBlur(event) {
    this.props.onUpdate(this.state.currentValue);
    this.setState({
      currentValue: this.props.value
    });
  }
  render() {
    return <input
      className={this.props.className}
      type="text"
      onChange={this.onChange.bind(this)}
      onBlur={this.onBlur.bind(this)}
      value={this.state.currentValue}
      maxLength={this.props.maxLength} />
  }
}
BlurNumberInput.propTypes = {
  onUpdate: React.PropTypes.func.isRequired,
  value: React.PropTypes.number.isRequired,
};
