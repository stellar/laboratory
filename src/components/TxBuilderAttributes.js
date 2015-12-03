import React from 'react';
import Picker from './FormComponents/Picker';
import TxBuilderConstants from '../constants/TxBuilderConstants';

export default class TxBuilderAttributes extends React.Component {
  constructor() {
    super();
    this.state = {
    };
  }
  onUpdateHandler(type, values) {
    console.log()
  }
  render() {
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        {Picker({
          type: 'source_account',
          onUpdate: this.onUpdateHandler,
        })}
      </div>
    </div>
  }
}
