import React from 'react';
import {ResourceList} from './ResourceList';
import {EndpointList} from './EndpointList';
import {ExplorerStore} from '../stores/ExplorerStore';

export let EndpointPicker = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    return {
      resources: ExplorerStore.getResources(),
      endpoints: ExplorerStore.getCurrentEndpoints()
    }
  },
  onChange: function() {
    this.setState(this.getState());
  },
  componentDidMount: function() {
    ExplorerStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeChangeListener(this.onChange);
  },
  render: function() {
    return <div className="EndpointPicker">
      <div className="EndpointPicker__section">
        <p className="EndpointPicker__section__title">1. Select a resource</p>
          <ResourceList endpoints={this.state.resources} />
      </div>
      <div className="EndpointPicker__section">
        <p className="EndpointPicker__section__title">2. Select an endpoint</p>
          <EndpointList endpoints={this.state.endpoints} />
      </div>
    </div>;
  }
});
