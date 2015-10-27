import React from 'react';
import {Account} from 'stellar-sdk';
import {ExplorerActions} from '../../actions/ExplorerActions';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let AddressParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error = null;
    if (value && !Account.isValidAddress(value)) {
      error = 'Address is invalid.';
    }

    this.setState({value, error});
    ExplorerActions.parameterSet(this.props.param, value, error);
  },
  render: function() {
    let {value, error} = this.state;
    let text;
    switch (this.props.param) {
      case 'selling_asset_issuer':
        text = 'Selling Asset Issuer';
        break;
      case 'buying_asset_issuer':
        text = 'Buying Asset Issuer';
        break;
      default:
        text = 'Account ID';
    }
    return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          {text}
        </div>
        <div className="optionsTable__pair__content">
          <input type="text" value={value} onChange={this.onChange}/>
          {error ? <p className="optionsTable__pair__content__alert">
            {error}
          </p> : ''}
        </div>
      </div>
  }
});
