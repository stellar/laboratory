import React from 'react';

export default class TransactionBuilder extends React.Component {
  render() {
    return <div className="TransactionImport">
      <button className="s-button">Import from XDR</button>
      <div className="TransactionImport__input">
        <textarea className="TransactionImport__input__textarea" placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
      </div>
      <p className="TransactionImport__alert">The input is not valid base64 (a-zA-Z0-9+/).</p>
      <div className="s-buttonList">
        <button className="s-button">Import Transaction</button>
        <button className="s-button s-button__light">Cancel</button>
      </div>
    </div>
  }
}
