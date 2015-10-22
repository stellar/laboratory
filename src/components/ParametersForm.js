import React from 'react';
import {Address} from './ParametersFormComponents/Address';
import {Limit} from './ParametersFormComponents/Limit';
import {Order} from './ParametersFormComponents/Order';
import {EndpointsStore} from '../stores/EndpointsStore';

export let ParametersForm = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let params = EndpointsStore.getCurrentEndpointParams();
    let url = EndpointsStore.getCurrentUrl();
    return {params, url};
  },
  onChange: function() {
    this.setState(this.getState());
  },
  componentDidMount: function() {
    EndpointsStore.addChangeListener(this.onChange);
    EndpointsStore.addUrlChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    EndpointsStore.removeChangeListener(this.onChange);
    EndpointsStore.removeUrlChangeListener(this.onChange);
  },
  render: function() {
    if (this.state.params) {
      return <table className="parameter-form">
        <tbody>
          {this.state.params.map(type => {
            switch (type) {
              case 'address':
                return <Address key={type} param={type} />;
              case 'limit':
                return <Limit key={type} param={type} />;
              case 'order':
                return <Order key={type} param={type} />;
              default:
                return;
            }
          })}
        <tr>
          <td colSpan="2">{this.state.url}</td>
        </tr>
        </tbody>
      </table>;
    } else {
      return <div></div>;
    }
  }
});
