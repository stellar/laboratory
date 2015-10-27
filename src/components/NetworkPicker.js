import React from 'react';
import {ExplorerStore} from '../stores/ExplorerStore';

export let NetworkPicker = React.createClass({
  getInitialState: function() {
    return {
      networkState: ExplorerStore.horizonRoot[ExplorerStore.currentNetwork],
      horizonRoots: ExplorerStore.horizonRoot
    };
  },
  onToggle: function(event) {
    ExplorerStore.setNetwork(event.target.value);
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
  mapRoots: function(callback) {
    return Object.keys(this.state.horizonRoots).map((name) => {
      let current = false;
      if (this.state.networkState == this.state.horizonRoots[name]) {
        current = true;
      }
      return callback(name, current);
    });
  },
  render: function() {
    return <div className="NetworkPicker">
      <form className="s-buttonGroup NetworkPicker__buttonGroup">
        {this.mapRoots((name, current) => {
          return <label className="s-buttonGroup__wrapper" key={name}>
            <input type="radio" className="s-buttonGroup__radio" name="network-toggle" onClick={this.onToggle} defaultChecked={current} value={name} />
            <span className="s-button s-button__light NetworkPicker__button">{name}</span>
          </label>
        })}
      </form>
      <span className="NetworkPicker__url">{this.state.networkState}</span>
    </div>
  }
});
