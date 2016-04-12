import React from 'react';
import classNames from 'classnames';
import _ from 'lodash';
import validateTxXdr from '../utilities/validateTxXdr';

// TransactionImporter will call the onImport passed to it's props when the user
// presses the import button and the input is valid

export default class TransactionImporter extends React.Component {
  constructor() {
    super();
    this.state = {
      input: '',
    };
  }
  updateTextarea(event) {
    this.setState({
      'input': event.target.value
    })
  }
  triggerImport() {
    if (validateTxXdr(this.state.input).result === 'success') {
      this.props.onImport(this.state.input);
    }
  }
  render() {
    let validation, message, submitEnabled, messageClass;
    validation = validateTxXdr(this.state.input);
    messageClass = validation.result === 'error' ? 'xdrInput__message__alert' : 'xdrInput__message__success';
    message = <p className={messageClass}>{validation.message}</p>

    submitEnabled = validation.result === 'success';

    return <div className="xdrInput">
      <div className="xdrInput__input">
        <textarea
          className="xdrInput__input__textarea"
          onChange={this.updateTextarea.bind(this)}
          placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
      </div>
      <div className="xdrInput__message">
        {message}
      </div>
      <div className="s-buttonList">
        <button className="s-button"
          disabled={!submitEnabled} onClick={this.triggerImport.bind(this)}>
          Import Transaction</button>
      </div>
    </div>
  }
}
TransactionImporter.propTypes = {
  'onImport': React.PropTypes.func.isRequired,
};
