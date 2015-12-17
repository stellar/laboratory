import React from 'react';
import {Transaction} from 'stellar-sdk';
import classNames from 'classnames';
import _ from 'lodash';

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
    if (validateXdr(this.state.input).result === 'success') {
      this.props.onImport(this.state.input);
    }
  }
  render() {
    let validation, message, submitEnabled;

    validation = validateXdr(this.state.input);
    if (validation.result === 'error') {
      message = <p className="TransactionImporter__alert">{validation.message}</p>
    } else if (validation.result === 'success') {
      message = <p className="TransactionImporter__success">{validation.message}</p>
    }

    submitEnabled = validation.result === 'success';

    return <div className="TransactionImporter">
      <div className="TransactionImporter__input">
        <textarea
          className="TransactionImporter__input__textarea"
          onChange={this.updateTextarea.bind(this)}
          placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."></textarea>
      </div>
      {message}
      <div className="s-buttonList">
        <button className="s-button"
          disabled={!submitEnabled} onClick={this.triggerImport.bind(this)}>
          Import Transaction</button>
        {/* Support for Cancel button needed in TransactionBuilder import
        <button className="s-button s-button__light">Cancel</button>
        */}
      </div>
    </div>
  }
}
TransactionImporter.propTypes = {
  'onImport': React.PropTypes.func.isRequired,
};

function validateXdr(input) {
  input = _.trim(input);

  if (input === '') {
    return {
      result: 'empty',
    };
  }
  if (input.match(/^[-A-Za-z0-9+\/=]*$/) === null) {
    return {
      result: 'error',
      message: 'The input is not valid base64 (a-zA-Z0-9+/=).'
    };
  }
  try {
    new Transaction(input);
    return {
      result: 'success',
      message: 'Valid Transaction Envelope XDR',
    }
  } catch (e) {
    return {
      result: 'error',
      message: 'Unable to parse input XDR into Transaction Envelope',
    };
  }
}
