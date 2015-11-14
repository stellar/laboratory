import React from 'react';
import _ from 'lodash';

export default function(config) {
  return React.createClass({
    displayName: config.defaultLabel + 'Picker',
    propTypes: {
      optional: React.PropTypes.bool.isRequired,
      forceError: React.PropTypes.string,
      forceDirty: React.PropTypes.bool,
    },
    getInitialState: function() {
      let fields = {}; // stateful
      config.fieldMap = {}; // not mutable another representation of the fields array; more accessible but unsorted
      _.each(config.fields, (field) => {
        if (field.name in config.fieldMap) {
          throw new Error('PickerGenerator config.fields[].name must be unique');
        }

        fields[field.name] = {
          value: '',
          dirty: false,
        };
        config.fieldMap[field.name] = field;
        if (typeof field.default !== 'undefined') {
          fields[field.name].value = field.default;
        }
      });

      return {fields, error: null, dirty: false};
    },
    validate: function(fields) { // expects something like this.state.field
      return _.mapValues(fields, (field, fieldName) => {
        let dirty = this.props.forceDirty || field.dirty;
        let optional = this.props.optional || config.fieldMap[fieldName].optional;
        let showing = typeof config.fieldMap[fieldName].showIf === 'undefined' ||
          config.fieldMap[fieldName].showIf(fields);

        if (!showing) {
          return {message: null, complete: true}; // non-showing elements count as complete
        } else if (!dirty) {
          if (field.forceRequired) {
            return {message: 'This is a required field.', complete: false};
          } else if (optional) {
            return {message: null, complete: true};
          } else {
            return {message: null, complete: false};
          }
        } else if (field.value === '') {
          if (config.fieldMap[fieldName].forceRequired) {
            return {message: 'This is a required field.', complete: false};
          } else if (optional) {
            return {message: null, complete: true};
          } else {
            return {message: 'This is a required field.', complete: false};
          }
        } else {
          let validateMessage = config.fieldMap[fieldName].validator(field.value, fields);
          if (validateMessage === null) {
            return {message: null, complete: true}; // passed the validator
          }
          return {message: validateMessage, complete: false};
        }
      })
    },
    onChange: function(fieldName, event) {
      let fields =  _.assign({}, this.state.fields, {
        [fieldName]: {
          value: event.target.value,
          dirty: true,
        }
      });

      // When optional,
      let complete = _.reduce(this.validate(fields), (complete, fieldValidation) => {
        return complete && fieldValidation.complete;
      }, true);

      this.setState({fields});
      this.props.onUpdate(this.props.param, fields, complete);
    },
    render: function() {
      let label = config.defaultLabel;
      if (typeof config.labels !== 'undefined' && this.props.param in config.labels) {
        // TODO: refactor labels since it doesn't belong here. A custom prop should just be passed to it
        label = config.labels[this.props.param];
      }
      let validation = this.validate(this.state.fields);

      return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          {label}
          {this.props.optional && <span className="optionsTable__pair__title__optional"> (optional)</span>}
        </div>
        <div className="optionsTable__pair__content">
          {_.map(config.fields, (fieldConfig, index) => {
            if (typeof fieldConfig.showIf === 'undefined' || fieldConfig.showIf(this.state.fields)) {
              let formElement;
              switch(fieldConfig.type) {
                case 'radio':
                  formElement = <div className="s-buttonGroup">
                    {_.map(fieldConfig.options, option => {
                      return <label key={option.name} className="s-buttonGroup__wrapper">
                        <input type="radio" className="s-buttonGroup__radio" name={index + fieldConfig.name} onChange={this.onChange.bind(this, fieldConfig.name)} value={option.value} checked={this.state.fields[fieldConfig.name].value == option.value} />
                        <span className="s-button s-button__light">{option.label}</span>
                      </label>
                    })}
                  </div>;
                  break;
                case 'text':
                  formElement = <input type="text" value={this.state.fields[fieldConfig.name].value} placeholder={fieldConfig.placeholder} onChange={this.onChange.bind(this, fieldConfig.name)}/>
                  break;
                default:
                  throw new Error(`Unknown picker field type: ${fieldConfig.type}. Check the config object passed to PickerGenerator.`);
              }
              return <div key={fieldConfig.name}>
                {formElement}
                {validation[fieldConfig.name].message ? <p className="optionsTable__pair__content__alert">
                  {validation[fieldConfig.name].message}
                </p> : ''}
              </div>
            }
          })}
          {this.props.forceError ? <p className="optionsTable__pair__content__alert">
            {this.props.forceError}
          </p> : ''}
        </div>
      </div>;
    }
  });
}
