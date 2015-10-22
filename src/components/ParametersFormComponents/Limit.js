import React from 'react';
import {EndpointsStore} from '../../stores/EndpointsStore';

export let Limit = React.createClass({
  getInitialState: function() {
    return {value: ''};
  },
  onChange: function(event) {
    this.setState({value: event.target.value});
    EndpointsStore.setParam(this.props.param, event.target.value);
  },
  render: function() {
    var value = this.state.value;
    return <tr>
      <td>
        Limit
      </td>
      <td>
        <input type="text" value={value} onChange={this.onChange} />
      </td>
    </tr>;
  }
});
