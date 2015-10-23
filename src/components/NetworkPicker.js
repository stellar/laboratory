import React from 'react';

export let NetworkPicker = React.createClass({
  render: function() {
    return <div className="NetworkPicker">
      <form className="s-buttonGroup NetworkPicker__buttonGroup">
        <label className="s-buttonGroup__wrapper">
          <input type="radio" className="s-buttonGroup__radio" name="favorite-letter" value="live" />
          <span className="s-button s-button__light NetworkPicker__button">live</span>
        </label>
        <label className="s-buttonGroup__wrapper">
          <input type="radio" className="s-buttonGroup__radio" name="favorite-letter" value="test" />
          <span className="s-button s-button__light NetworkPicker__button">test</span>
        </label>
      </form>
      <span className="NetworkPicker__url">horizon-testnet.stellar.org</span>
    </div>
  }
});
