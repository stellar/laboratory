import React from 'react';

export let CursorParameter = React.createClass({
  getInitialState: function() {
    return {value: '', error: null};
  },
  onChange: function(event) {
    let value = event.target.value;
    let error;
    if (!value.match(/^[0-9]*$/g)) {
      error = 'Cursor is invalid.';
    }

    this.setState({value, error});
    this.props.onUpdate(this.props.param, value, error);
  },
  render: function() {
    let {value, error} = this.state;
    let {optional} = this.props;
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        Cursor
        {optional && <span className="optionsTable__pair__title__optional"> (optional)</span>}
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
