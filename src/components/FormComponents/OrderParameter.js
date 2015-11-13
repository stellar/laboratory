import React from 'react';

export default React.createClass({
  propTypes: {
    optional: React.PropTypes.bool.isRequired,
    forceError: React.PropTypes.string,
    forceDirty: React.PropTypes.bool,
  },
  getInitialState: function() {
    return {value: '', error: null, dirty: false};
  },
  validate: function(value) {
    let dirty = this.props.forceDirty || this.state.dirty;
    let optional = this.props.optional == true;

    if (dirty && !optional && value === '') {
      return 'This is a required field.';
    }
    return null;
  },
  onChange: function(event) {
    let value = event.target.value;
    this.setState({value});
    this.props.onUpdate(this.props.param, value);
  },
  render: function() {
    let errorMessage = this.validate(this.state.value);
    if (typeof this.props.forceError === 'string') {
      errorMessage = this.props.forceError;
    }

    let {optional} = this.props;
    return <div className="optionsTable__pair">
      <div className="optionsTable__pair__title">
        Order
        {optional && <span className="optionsTable__pair__title__optional"> (optional)</span>}
      </div>
      <div className="optionsTable__pair__content">
        <div className="s-buttonGroup">
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.param} onChange={this.onChange} value="asc" />
            <span className="s-button s-button__light">asc</span>
          </label>
          <label className="s-buttonGroup__wrapper">
            <input type="radio" className="s-buttonGroup__radio" name={this.props.param} onChange={this.onChange} value="desc" />
            <span className="s-button s-button__light">desc</span>
          </label>
        </div>
        {errorMessage ? <p className="optionsTable__pair__content__alert">
          {errorMessage}
        </p> : ''}
      </div>
    </div>
  }
});
