import React from "react";
import PropTypes from "prop-types";
import validateTxXdr from "../utilities/validateTxXdr";

// TransactionImporter will call the onImport passed to it's props when the user
// presses the import button and the input is valid
// If no onImport function given, button is hidden and can trigger an update using onUpdate instead

export default class TransactionImporter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      input: props.value ? props.value : "",
    };
  }
  updateTextarea(event) {
    this.setState({
      input: event.target.value,
    });
    if (this.props.onUpdate) {
      this.props.onUpdate(event.target.value);
    }
  }
  triggerImport() {
    if (
      validateTxXdr(this.state.input, this.props.networkPassphrase).result ===
      "success"
    ) {
      this.props.onImport(this.state.input);
    }
  }
  render() {
    let validation, message, submitEnabled, messageClass;
    validation = validateTxXdr(this.state.input, this.props.networkPassphrase);
    messageClass =
      validation.result === "error"
        ? "xdrInput__message__alert"
        : "xdrInput__message__success";
    message = <p className={messageClass}>{validation.message}</p>;

    submitEnabled = validation.result === "success";

    return (
      <div className="xdrInput">
        <div className="xdrInput__input">
          <textarea
            value={this.state.input}
            className="xdrInput__input__textarea"
            onChange={this.updateTextarea.bind(this)}
            placeholder="Example: AAAAAGXNhB2hIkbP//jgzn4os/AAAAZAB+BaLPAAA5Q/xL..."
          ></textarea>
        </div>
        <div className="xdrInput__message">{message}</div>
        {this.props.onImport && (
          <div className="s-buttonList">
            <button
              className="s-button"
              disabled={!submitEnabled}
              onClick={this.triggerImport.bind(this)}
            >
              Import Transaction
            </button>
          </div>
        )}
      </div>
    );
  }
}
TransactionImporter.propTypes = {
  onImport: PropTypes.func,
  networkPassphrase: PropTypes.string.isRequired,
  onUpdate: PropTypes.func,
};
