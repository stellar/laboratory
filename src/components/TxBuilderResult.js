import React from 'react';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';

export default class TxBuilderResult extends React.Component {
  render() {
    return <div className="TxBuilderResult">
      <h3>Resulting TransactionEnvelope XDR:</h3>
      <pre className="TransactionXDR so-code TransactionBuilderResult__code"><code>AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL</code></pre>
      <button className="s-button">Sign this transaction</button>
    </div>
  }
}
