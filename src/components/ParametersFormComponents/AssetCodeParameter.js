import React from 'react';
import {ExplorerActions} from '../../actions/ExplorerActions';
import {ExplorerStore} from '../../stores/ExplorerStore';

export let AssetCodeParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error = null;
    if (value.length > 12) {
      error = 'Asset code must be 12 characters at max.';
    }

    this.setState({value, error});
    ExplorerActions.parameterSet(this.props.param, value, error);
  },
  render: function() {
    let {value, error} = this.state;
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
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        {text}
      </div>
      <div className="optionsTable__pair__content">
        <input type="text" value={value} onChange={this.onChange}/>
        {error ? <p className="optionsTable__pair__content__alert">
          {error}
        </p> : ''}
      </div>
    </div>
  }
});
