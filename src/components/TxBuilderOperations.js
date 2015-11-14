import React from 'react';
import {PubKeyPicker} from './FormComponents/PubKeyPicker';
import TxBuilderOperation from './TxBuilderOperation';

export default class TxBuilderOperations extends React.Component {
  constructor() {
    super()
    this.state ={
      operations: [{
        key: 1
      },{
        key: 52973
      },{
        key: 25
      }]
    }
  }
  render() {
    return <div className="TransactionOperations">
      {this.state.operations.map((op, index) => {
        return <TxBuilderOperation key={op.key} order={index} op={op} />
      })}

      <div className="TransactionOperations__add s-button">
        Add Operation
      </div>
    </div>
  }
}
