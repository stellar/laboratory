import React from 'react';
import {ExplorerActions} from '../../actions/ExplorerActions';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let LimitParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error;
    if (!value.match(/^[0-9]*$/g) || value < 0 || value > 200) {
      error = 'Limit is invalid.';
    }

    this.setState({value, error});
    ExplorerActions.parameterSet(this.props.param, value, error);
  },
  render: function() {
    let {value, error} = this.state;
    let {optional} = this.props;
    return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          Limit
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
