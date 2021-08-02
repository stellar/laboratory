import React from "react";
import isString from "lodash/isString";

// @param {string} [props.message] - Message will display only if a string is passed in
export default class PickerError extends React.Component {
  render() {
    let message = this.props.message;
    if (isString(message)) {
      return <p className="picker__errorMessage">{message}</p>;
    }
    return null;
  }
}
