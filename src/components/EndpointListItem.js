import React from 'react';
import {ExplorerActions} from '../actions/ExplorerActions';

export let EndpointListItem = React.createClass({
  render: function() {
    return <li onClick={this.props.onSelect.bind(null, this.props.endpoint.id)}>
      {this.props.endpoint.text} selected={this.props.endpoint.selected ? 'true' : 'false'}
    </li>
  }
});
