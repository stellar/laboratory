import React from 'react';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let LedgerParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error;
    if (!value.match(/^[0-9]*$/g)) {
      error = 'Ledger ID is invalid.';
    }

    this.setState({value, error});
    ExplorerStore.setParam(this.props.param, value, error);
  },
  render: function() {
    let {value, error} = this.state;
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        Ledger ID
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
