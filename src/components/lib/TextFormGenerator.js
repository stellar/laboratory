import React from 'react';
import _ from 'lodash';

/**
Sample config (with all the features)

{
  labels: { // (optional) key is the form type. Value is the displayed text
    'source_account': 'Source Account',
    'destination_account': 'Destination Account',
    'destination_asset_issuer': 'Destination Asset Issuer',
    'selling_asset_issuer': 'Selling Asset Issuer',
    'buying_asset_issuer': 'Buying Asset Issuer',
  },
  defaultLabel: 'Account ID', // (required)
  validator: value => { // This function should either return string (if errored) or null (if no errors)
    return Account.isValidAddress(value) ? null : 'Public key is invalid.';
  },
}
**/

export default function(config) {
  return React.createClass({
    propTypes: {
      optional: React.PropTypes.bool.isRequired,
      forceError: React.PropTypes.string,
      forceDirty: React.PropTypes.bool,
    },
    getInitialState: function() {
      return {value: '', error: null, dirty: false};
    },
    validate: function(value) {
      let dirty = this.props.forceDirty || this.state.dirty;
      let optional = this.props.optional == true;

      if (!dirty) {
        return null;
      } else if (!optional && value === '') {
        return 'This is a required field.';
      } else if (optional && value === '') {
        return null;
      }

      return config.validator(value);
    },
    onChange: function(event) {
      let value = event.target.value;
      let error = this.validate(value);
      let dirty = true;

      this.setState({value, error, dirty});
      this.props.onUpdate(this.props.param, value, error !== null);
    },
    render: function() {
      let errorMessage = this.validate(this.state.value);
      if (typeof this.props.forceError === 'string') {
        errorMessage = this.props.forceError;
      }

      let label = config.defaultLabel;
      if (typeof config.labels !== 'undefined' && this.props.param in config.labels) {
        label = config.labels[this.props.param];
      }

      return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          {label}
          {this.props.optional && <span className="optionsTable__pair__title__optional"> (optional)</span>}
        </div>
        <div className="optionsTable__pair__content">
          <input type="text" value={this.state.value} onChange={this.onChange}/>
          {errorMessage ? <p className="optionsTable__pair__content__alert">
            {errorMessage}
          </p> : ''}
        </div>
      </div>;
    }
  });
}
