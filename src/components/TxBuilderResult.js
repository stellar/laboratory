import React from 'react';
import {AddressParameter} from './FormComponents/AddressParameter';
import TxBuilderStore from '../stores/TxBuilderStore';

export default class TxBuilderResult extends React.Component {
  onUpdate() {
    this.forceUpdate();
  }
  componentDidMount() {
    TxBuilderStore.addUpdateListener(this.onUpdate);
  }
  componentWillUnmount() {
    TxBuilderStore.removeUpdateListener(this.onUpdate);
  }
  render() {
    let xdr = TxBuilderStore.getXdr();
    return <div className="TxBuilderResult">
      <h3>Resulting TransactionEnvelope XDR:</h3>
      <pre className="TransactionXDR so-code TransactionBuilderResult__code"><code>{xdr}</code></pre>
      <button className="s-button">Sign this transaction</button>
    </div>
  }
}
