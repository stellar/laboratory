import React from 'react';
import TxBuilderOperation from './TxBuilderOperation';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';

export default class TxBuilderOperations extends React.Component {
  constructor() {
    super()
  }
  render() {
    return <div className="TransactionOperations">
      {this.props.operations.map((op, index) => {
        console.log(op)
        return <TxBuilderOperation key={op.id} order={index} op={op} />
      })}

      <button className="TransactionOperations__add s-button" onClick={this.props.onAddOp}>
        Add Operation
      </button>
    </div>
  }
}
