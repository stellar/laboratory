import React from 'react';
import {Account} from 'stellar-sdk';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let AddressParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error;
    if (value && !Account.isValidAddress(value)) {
      error = 'Address is invalid.';
      this.setState({value, error});
      return;
    }

    this.setState({value, error});
    ExplorerStore.setParam(this.props.param, value);
  },
  render: function() {
    let {value, error} = this.state;
    return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          Account ID
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
