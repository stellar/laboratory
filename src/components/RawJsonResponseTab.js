import React from 'react';
import {ExplorerStore} from '../stores/ExplorerStore';
import {CodeBlock} from './CodeBlock';

export let RawJsonResponseTab = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let response = ExplorerStore.getResponse();
    if (response) {
      response = JSON.stringify(response, null, 2);
    }
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
    return <CodeBlock code={this.state.response} language="json" />;
  }
});
