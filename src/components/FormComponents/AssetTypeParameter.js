import React from 'react';

export let AssetTypeParameter = React.createClass({
  getInitialState: function() {
    return {value: null, error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    this.setState({value, error: null});
    this.props.onUpdate(this.props.param, value);
  },
  onExternalError: function({param, error}) {
    if (param === this.props.param && !this.state.error) {
      this.setState(_.extend(this.state, {error}));
    }
  },
  componentDidMount: function() {
    this.props.addParameterErrorListener(this.onExternalError);
  },
  componentWillUnmount: function() {
    this.props.removeParameterErrorListener(this.onExternalError);
  },
  render: function() {
    let {error} = this.state;
    let {param, optional} = this.props;
    let text;
    switch (param) {
      case 'selling_asset_type':
        text = 'Selling Asset Type';
        break;
      case 'buying_asset_type':
        text = 'Buying Asset Type';
        break;
      case 'destination_asset_type':
        text = 'Destination Asset Type';
        break;
      default:
        text = 'Asset Type';
    }
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        {text}
        {optional && <span className="optionsTable__pair__title__optional"> (optional)</span>}
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
        {error ? <p className="optionsTable__pair__content__alert">
          {error}
        </p> : ''}
      </div>
    </div>
  }
});
