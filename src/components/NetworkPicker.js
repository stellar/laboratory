import React from 'react';
import {connect} from 'react-redux';
import {chooseNetwork} from "../actions/network";
import NETWORK from '../constants/network';

class NetworkPicker extends React.Component {
  render() {
    let {dispatch} = this.props;
    let {currentName, currentURL, availableNames} = this.props;

    let items = availableNames.map(n => {
      return <NetworkToggle
        name={n}
        key={n}
        selected={currentName === n}
        onToggle={() => dispatch(chooseNetwork(n))}
        />
    })

    return <div className="NetworkPicker">
      <form className="s-buttonGroup NetworkPicker__buttonGroup">
        {items}
      </form>
      <span className="NetworkPicker__url">{currentURL}</span>
    </div>
  }
}

const NetworkToggle = (props) => {
  let {name, onToggle, selected} = props;
  return <label className="s-buttonGroup__wrapper">
    <input
      type="radio"
      className="s-buttonGroup__radio"
      name="network-toggle"
      onChange={onToggle}
      checked={selected}
      value={name} />
    <span className="s-button s-button--light NetworkPicker__button">{name}</span>
  </label>
}

export default connect(chooseState)(NetworkPicker);

function chooseState(state) {
  return {
    availableNames: Object.keys(NETWORK.available),
    currentName:    state.network.current,
    currentURL:     NETWORK.available[state.network.current].url,
  };
}
