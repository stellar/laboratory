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
        return <TxBuilderOperation
          key={op.id}
          order={index}
          op={op}
          removable={this.props.operations.length === 1}
          onRemove={this.props.onRemove.bind(this, op.id)}
          />
      })}

      <button className="TransactionOperations__add s-button" onClick={this.props.onAddOp}>
        Add Operation
      </button>
    </div>
  }
}
