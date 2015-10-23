import React from 'react';
import {EndpointsStore} from '../stores/EndpointsStore';
import {CodeBlock} from './CodeBlock';

export let RawJsonResponseTab = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let response = EndpointsStore.getResponse();
    if (response) {
      response = JSON.stringify(response, null, 2);
    }
    return {response};
  },
  //onChange: function() {
  //  this.setState(this.getState());
  //},
  //componentDidMount: function() {
  //  EndpointsStore.addResponseChangeListener(this.onChange);
  //},
  //componentWillUnmount: function() {
  //  EndpointsStore.removeResponseChangeListener(this.onChange);
  //},
  render: function() {
    return <CodeBlock code={"<script>alert('dANGEROUszzzzz')</script>" + this.state.response} language="json" />;
  }
});
