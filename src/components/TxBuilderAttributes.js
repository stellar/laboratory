import React from 'react';
import Picker from './FormComponents/Picker';

export default class TxBuilderAttributes extends React.Component {
  render() {
    let {onUpdate} = this.props;
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        {Picker({
          type: 'PubKey',
          onUpdate: onUpdate.bind(this, 'sourceAccount'),
          label: 'Source Account',
          required: true,
          key: 'sourceAccount',
        })}
        {Picker({
          type: 'Sequence',
          onUpdate: onUpdate.bind(this, 'sequence'),
          label: 'Transaction sequence number',
          required: true,
          key: 'sequence',
        })}
        {Picker({
          type: 'Stroops',
          onUpdate: onUpdate.bind(this, 'fee'),
          label: 'Transaction Fee',
          required: false,
          key: 'fee',
        })}
        {Picker({
          type: 'Memo',
          onUpdate: onUpdate.bind(this, 'memo'),
          label: 'Memo',
          key: 'memo',
        })}
      </div>
    </div>
  }
}
