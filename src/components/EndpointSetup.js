import _ from 'lodash';
import React from 'react';

import Picker from './FormComponents/Picker';
import {ExplorerActions} from '../actions/ExplorerActions';
import {ExplorerStore} from '../stores/ExplorerStore';
import {EasySelect} from './EasySelect';

export let EndpointSetup = React.createClass({
  getInitialState: function() {
    return this.getState();
  },
  getState: function() {
    let endpointId = ExplorerStore.getCurrentEndpointId();
    let params = ExplorerStore.getCurrentEndpointParams();
    let requiredParams = ExplorerStore.getCurrentEndpointRequiredParams();
    let url = ExplorerStore.getCurrentUrl();
    let formDirty = false;
    return {endpointId, params, requiredParams, url, formDirty};
  },
  onChange: function() {
    this.setState(this.getState());
  },
  onSubmit: function() {
    this.setState({formDirty: true})
    ExplorerStore.submitRequest();
  },
  onUpdateHandler: function(param, value, error) {
    ExplorerActions.parameterSet(param, value, error);
  },
  onError: function() {
    // there aren't any errors right now
  },
  componentDidMount: function() {
    ExplorerStore.addChangeListener(this.onChange);
    ExplorerStore.addUrlChangeListener(this.onChange);
    ExplorerStore.addNetworkChangeListener(this.onChange);
    // ExplorerStore.addParameterErrorListener.bind(this.onError);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeChangeListener(this.onChange);
    ExplorerStore.removeUrlChangeListener(this.onChange);
    ExplorerStore.removeNetworkChangeListener(this.onChange);
    // ExplorerStore.removeParameterErrorListener.bind(this.onError);
  },
  render: function() {
    if (this.state.params) {
      return <div className="so-chunk">
        <div className="optionsTable">
          {this.state.params.map(type => {
            let key = `${this.state.endpointId}.${type}`;
            let optional = !_.contains(this.state.requiredParams, type);

            return Picker(type, {
              key: key,
              optional: optional,
              onUpdate: this.onUpdateHandler,
              forceDirty: this.state.formDirty,
            })
          })}
          <hr className="optionsTable__separator" />
          <div className="optionsTable__blank EndpointSetup__url">
            <EasySelect className="">{this.state.url}</EasySelect>
          </div>
          <div className="optionsTable__blank">
            <button className="s-button" onClick={this.onSubmit}>Submit</button>
          </div>
        </div>
      </div>;
    } else {
      return null;
    }
  }
});
