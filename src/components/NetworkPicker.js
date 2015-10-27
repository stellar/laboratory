import React from 'react';
import {ExplorerActions} from '../actions/ExplorerActions';
import {ExplorerStore} from '../stores/ExplorerStore';

export let NetworkPicker = React.createClass({
  getInitialState: function() {
    return {
      networkState: ExplorerStore.horizonRoot[ExplorerStore.currentNetwork]
    };
  },
  onToggle: function(event) {
    ExplorerActions.networkSelect(event.target.value);
  },
  onNetworkChange: function() {
    this.setState({
      networkState: ExplorerStore.horizonRoot[ExplorerStore.currentNetwork]
    });
  },
  componentDidMount: function() {
    ExplorerStore.addNetworkChangeListener(this.onNetworkChange);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeNetworkChangeListener(this.onNetworkChange);
  },
  render: function() {
    return <div className="NetworkPicker">
      <form className="s-buttonGroup NetworkPicker__buttonGroup">
        <label className="s-buttonGroup__wrapper">
          <input type="radio" className="s-buttonGroup__radio" name="network-toggle" onClick={this.onToggle} defaultChecked="checked" value="public" />
          <span className="s-button s-button__light NetworkPicker__button">public</span>
        </label>
        <label className="s-buttonGroup__wrapper">
          <input type="radio" className="s-buttonGroup__radio" name="network-toggle" onClick={this.onToggle} value="test" />
          <span className="s-button s-button__light NetworkPicker__button">test</span>
        </label>
      </form>
      <span className="NetworkPicker__url">{this.state.networkState}</span>
    </div>
  }
});
