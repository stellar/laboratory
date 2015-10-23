import React from 'react';
import {EndpointsStore} from '../../stores/EndpointsStore';

export let AddressParameter = React.createClass({
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
          Account ID
        </div>
        <div className="optionsTable__pair__content">
          <input type="text" name="accountID" value={value} onChange={this.onChange}/>
        </div>
      </div>
  }
});
