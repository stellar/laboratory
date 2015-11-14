import React from 'react';
import TxBuilderOperation from './TxBuilderOperation';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';

export default class TxBuilderOperations extends React.Component {
  constructor() {
    super()
  }
  addOp() {
    AppDispatcher.dispatch({
      type: TxBuilderConstants.ADD_OPERATION,
    });
  }
  render() {
    let ops = TxBuilderStore.getOperationList()
    return <div className="TransactionOperations">
      {ops.map((op, index) => {
        return <TxBuilderOperation key={op.key} order={index} op={op} />
      })}

      <button className="TransactionOperations__add s-button" onClick={this.addOp}>
        Add Operation
      </button>
    </div>
  }
}
