import React from 'react';
import {ExplorerStore} from '../stores/ExplorerStore';
import {RawJsonResponseTab} from './RawJsonResponseTab';

export let EndpointResult = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let response = ExplorerStore.getResponse();
    return {response};
  },
  onChange: function() {
    this.setState(this.getState());
  },
  componentDidMount: function() {
    ExplorerStore.addResponseListener(this.onChange);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeResponseListener(this.onChange);
  },
  render: function() {
    if (this.state.response) {
      return <div className="EndpointResult">
        <div className="EndpointResult__tabs">
          <button className="EndpointResult__tabs__tab is-current">JSON Response</button>
        </div>
        <div className="EndpointResult__content">
          <RawJsonResponseTab />
        </div>
      </div>;
    } else {
      return <div></div>;
    }
  }
});
