import React from 'react';

export let Order = React.createClass({
  onChange: {
    //
  },
  render: function() {
    return <tr>
      <td>
        Order
      </td>
      <td>
        <input type="radio" name={this.props.key} value="asc" /> asc
        <input type="radio" name={this.props.key} value="desc" /> desc
      </td>
    </tr>;
  }
});
