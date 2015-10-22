import React from 'react';
import {ResourceList} from './ResourceList';
import {EndpointList} from './EndpointList';
import {EndpointsStore} from '../stores/EndpointsStore';

export let EndpointPicker = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    return {
      resources: EndpointsStore.getResources(),
      endpoints: EndpointsStore.getCurrentEndpoints()
    }
  },
  onChange: function() {
    this.setState(this.getState());
  },
  componentDidMount: function() {
    EndpointsStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    EndpointsStore.removeChangeListener(this.onChange);
  },
  render: function() {
    return <div>
      <div>
        Select a resource:
        <ResourceList endpoints={this.state.resources} />
      </div>
      <div>
        Select an endpoint:
        <EndpointList endpoints={this.state.endpoints} />
      </div>
    </div>;
  }
});
