import React from 'react';
import {ExplorerActions} from '../actions/ExplorerActions';
import {EndpointsStore} from '../stores/EndpointsStore';
import {EndpointListItem} from './EndpointListItem';

export let EndpointList = React.createClass({
  onEndpointSelect: function(id) {
    ExplorerActions.endpointSelect(id);
  },
  render: function() {
    return <nav className="s-buttonGroup s-buttonGroup--vertical">
      {this.props.endpoints.map(endpoint => {
        return <EndpointListItem key={endpoint.id}
                                 endpoint={endpoint}
                                 onSelect={this.onEndpointSelect} />
      })}
    </nav>;
  }
});
