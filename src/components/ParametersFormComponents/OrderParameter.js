import React from 'react';

export let OrderParameter = React.createClass({
  onChange: {
    //
  },
  render: function() {
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        Order
      </div>
      <div className="optionsTable__pair__content">
        <div className="s-buttonGroup">
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.key} value="default" />
            <span className="s-button s-button__light">default (asc)</span>
          </label>
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.key} value="asc" />
            <span className="s-button s-button__light">asc</span>
          </label>
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.key} value="desc" />
            <span className="s-button s-button__light">desc</span>
          </label>
        </div>
      </div>
    </div>
  }
});
