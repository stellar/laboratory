import React from 'react';
import {connect} from 'react-redux';
import PubKeyPicker from './FormComponents/PubKeyPicker.js';
import {getOperation} from '../data/operations';
import {
  addOperation,
  removeOperation,
  updateOperationType,
  updateOperationAttributes,
  reorderOperation,
} from '../actions/transactionBuilder';
import OperationTypePicker from './FormComponents/OperationTypePicker';
import OptionsTablePair from './OptionsTable/Pair';

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
  let operationPane, sourceAccountRow, separator;
  let dispatchUpdateOpAtts = (key, value) => {
    dispatch(updateOperationAttributes(op.id, {
      [key]: value
    }))
  };
  if (typeof opConfig !== 'undefined') {
    operationPane = opConfig.operationPane({
      onUpdate: dispatchUpdateOpAtts,
      values: op.attributes
    });

    sourceAccountRow = <OptionsTablePair label="Source Account" optional={true} key="sourceAccount">
      <PubKeyPicker
        value={op.attributes['sourceAccount']}
        onUpdate={(value) => dispatchUpdateOpAtts('sourceAccount', value)}
        />
    </OptionsTablePair>;

    separator = <hr className="optionsTable__separator" />;
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
      <OptionsTablePair label="Operation Type">
        <OperationTypePicker value={op.name} onUpdate={(value) => {
          dispatch(updateOperationType(op.id, value))
        }} />
      </OptionsTablePair>
      {separator}
      {operationPane}
      {sourceAccountRow}
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
