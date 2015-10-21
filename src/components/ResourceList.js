import React from 'react';
import {ExplorerActions} from '../actions/ExplorerActions';
import {EndpointListItem} from './EndpointListItem';

export let ResourceList = React.createClass({
  onResourceSelect: function(id) {
    ExplorerActions.resourceSelect(id);
  },
  render: function() {
    return <ul>
      {this.props.endpoints.map(endpoint => {
        return <EndpointListItem key={endpoint.id}
                                 endpoint={endpoint}
                                 onSelect={this.onResourceSelect} />
      })}
    </ul>;
  }
});
