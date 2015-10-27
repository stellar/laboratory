import React from 'react';
import _ from 'lodash';
import {ExplorerActions} from '../../actions/ExplorerActions';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let AssetCodeParameter = React.createClass({
  getInitialState: function() {
    let state = {value: '', error: null, hidden: false};
    if (this.props.param !== 'address') {
      state.hidden = true;
    }
    return state;
  },
  onChange: function(event) {
    let value = event.target.value;
    let error = null;
    if (value.length > this.maxLength) {
      error = `Asset code must be ${this.maxLength} characters at max.`;
    }

    this.setState({value, error});
    ExplorerActions.parameterSet(this.props.param, value, error);
  },
  onParameterChange({key, value}) {
    let hidden = value === 'native';
    if (this.props.param === 'selling_asset_code' && key === 'selling_asset_type') {
      this.maxLength = value === 'credit_alphanum4' ? 4 : 12;
      this.setState(_.extend(this.state, {hidden}));
    } else if (this.props.param === 'buying_asset_code' && key === 'buying_asset_type') {
      this.maxLength = value === 'credit_alphanum4' ? 4 : 12;
      this.setState(_.extend(this.state, {hidden}));
    }
  },
  componentDidMount: function() {
    ExplorerStore.addParameterChangeListener(this.onParameterChange);
  },
  componentWillUnmount: function() {
    ExplorerStore.removeParameterChangeListener(this.onParameterChange);
  },
  render: function() {
    let {value, error, hidden} = this.state;
    let text;
    switch (this.props.param) {
      case 'selling_asset_code':
        text = 'Selling Asset Code';
        break;
      case 'buying_asset_code':
        text = 'Buying Asset Code';
        break;
      default:
        text = 'Asset Code';
    }
    return hidden ?
      <div></div>
      :
      <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          {text}
        </div>
        <div className="optionsTable__pair__content">
          <input type="text" value={value} onChange={this.onChange}/>
          {error ? <p className="optionsTable__pair__content__alert">
            {error}
          </p> : ''}
        </div>
      </div>;
  }
});
