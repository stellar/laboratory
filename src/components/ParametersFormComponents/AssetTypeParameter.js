import React from 'react';
import {ExplorerActions} from '../../actions/ExplorerActions';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let AssetTypeParameter = React.createClass({
  getInitialState: function() {
    return {value: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    this.setState({value});
    ExplorerActions.parameterSet(this.props.param, value);
  },
  render: function() {
    let text;
    switch (this.props.param) {
      case 'selling_asset_type':
        text = 'Selling Asset Type';
        break;
      case 'buying_asset_type':
        text = 'Buying Asset Type';
        break;
      default:
        text = 'Asset Type';
    }
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        {text}
      </div>
      <div className="optionsTable__pair__content">
        <div className="s-buttonGroup">
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.param} onChange={this.onChange} value="native" />
            <span className="s-button s-button__light">native</span>
          </label>
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.param} onChange={this.onChange} value="credit_alphanum4" />
            <span className="s-button s-button__light">credit_alphanum4</span>
          </label>
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.param} onChange={this.onChange} value="credit_alphanum12" />
            <span className="s-button s-button__light">credit_alphanum12</span>
          </label>
        </div>
      </div>
    </div>
  }
});
