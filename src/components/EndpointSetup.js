import React from 'react';
import {AddressParameter} from './ParametersFormComponents/AddressParameter';
import {LimitParameter} from './ParametersFormComponents/LimitParameter';
import {OrderParameter} from './ParametersFormComponents/OrderParameter';
import {EndpointsStore} from '../stores/EndpointsStore';

export let EndpointSetup = React.createClass({
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
      return <div className="so-chunk">
          <div className="optionsTable">
            {this.state.params.map(type => {
              switch (type) {
                case 'address':
                  return <AddressParameter key={type} param={type} />;
                case 'limit':
                  return <LimitParameter key={type} param={type} />;
                case 'order':
                  return <OrderParameter key={type} param={type} />;
                default:
                  return;
              }
            })}
            <hr className="optionsTable__separator" />
            <div className="optionsTable__blank">
              <span>{this.state.url}</span>
            </div>
            <div className="optionsTable__blank">
              <button className="s-button">Submit</button>
            </div>
          </div>
        </div>;
    } else {
      return <div></div>;
    }
  }
});
