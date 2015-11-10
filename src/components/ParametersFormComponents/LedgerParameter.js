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
      error = 'Ledger sequence is invalid.';
    }

    this.setState({value, error});
    ExplorerStore.setParam(this.props.param, value, error);
  },
  onExternalError: function({param, error}) {
    if (param === this.props.param && !this.state.error) {
      this.setState(_.extend(this.state, {error}));
    }
  },
  componentDidMount: function() {
    ExplorerStore.addParameterErrorListener(this.onExternalError);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeParameterErrorListener(this.onExternalError);
  },
  render: function() {
    let {value, error} = this.state;
    let {optional} = this.props;
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        Ledger sequence
        {optional && <span className="optionsTable__pair__title__optional"> (optional)</span>}
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
