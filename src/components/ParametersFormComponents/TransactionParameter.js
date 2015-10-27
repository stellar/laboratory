import React from 'react';
import {ExplorerActions} from '../../actions/ExplorerActions';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let TransactionParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error;
    if (!value.match(/^[0-9a-f]{64}$/g)) {
      error = 'Transaction ID is invalid.';
    }

    this.setState({value, error});
    ExplorerActions.parameterSet(this.props.param, value, error);
  },
  render: function() {
    let {value, error} = this.state;
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        Transaction ID
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
