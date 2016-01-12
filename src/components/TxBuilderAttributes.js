import React from 'react';
import TxAttributesPane from './TxBuilderPanes/TxAttributes';

export default class TxBuilderAttributes extends React.Component {
  render() {
    let {onUpdate, attributes} = this.props;
    return <div className="TransactionAttributes">
      <div className="TransactionOp__config TransactionOpConfig optionsTable">
        <TxAttributesPane onUpdate={onUpdate} values={attributes}/>

      </div>
    </div>
  }
}
