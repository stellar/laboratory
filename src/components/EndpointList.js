import React from 'react';
import {EndpointsStore} from '../stores/EndpointsStore';
import {EndpointListItem} from './EndpointListItem';

export let EndpointList = React.createClass({
  onEndpointSelect: function() {
    console.log('endpoint selected');
  },
  render: function() {
    return <ul>
      {this.props.endpoints.map(endpoint => {
        return <EndpointListItem key={endpoint.id}
                                 endpoint={endpoint}
                                 onSelect={this.props.onEndpointSelect} />
      })}
    </ul>;
  }
});
