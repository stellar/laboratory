import React from 'react';
import {EndpointsStore} from '../../stores/EndpointsStore';

export let LimitParameter = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },
  onChange: function(event) {
    this.setState({value: event.target.value});
    EndpointsStore.setParam(this.props.param, event.target.value);
  },
  render: function() {
    var value = this.state.value;
    return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          Limit
        </div>
        <div className="optionsTable__pair__content">
          <input type="text" name="limit" value={value} onChange={this.onChange} />
          <p className="optionsTable__pair__content__alert">
            Limit must be a positive number
          </p>
        </div>
      </div>
  }
});
