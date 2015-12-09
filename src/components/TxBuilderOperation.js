import React from 'react';
import Picker from './FormComponents/Picker';
import TxBuilderStore from '../stores/TxBuilderStore';
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import TxBuilderConstants from '../constants/TxBuilderConstants';
import {getOperation} from '../data/operations';

export default class TxBuilderOperation extends React.Component {
  constructor() {
    super();
  }
  onUpdateHandler() {

  }
  render() {
    let opConfig = this.props.opConfig;
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

    let removeLink = (this.props.removable) ?
      ''
      :
      <p className="TransactionOpMeta__remove"><a onClick={this.props.onRemove}>remove</a></p>;

    return <div className="TransactionOp">
      <div className="TransactionOp__meta TransactionOpMeta">
        <div className="TransactionOpMeta__order">
          <input className="TransactionOpMeta__order__input" type="text" value={this.props.order} maxLength="2" />
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
    </div>
  }
}
