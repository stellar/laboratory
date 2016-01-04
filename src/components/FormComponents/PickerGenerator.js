import React from 'react';
import _ from 'lodash';

export default function(config) {
  config.fieldMap = {}; // do not mutate; another representation of the fields array; more accessible but unsorted
  _.each(config.fields, (configField) => {
    if (configField.name in config.fieldMap) {
      throw new Error('PickerGenerator config.fields[].name must be unique');
    }
    config.fieldMap[configField.name] = configField;
  });

  return React.createClass({
    displayName: config.pickerName + 'Picker',
    propTypes: {
      label: React.PropTypes.string.isRequired,
      required: React.PropTypes.bool,
      forceError: React.PropTypes.string,
      forceDirty: React.PropTypes.bool,
    },
    getInitialState: function() {
      let fields = {}; // stateful
      let uniqueKey = '' + (+new Date()) + Math.random(); // ensures radiobuttons have a unique name attribute
      _.each(config.fields, (configField) => {
        fields[configField.name] = {
          value: typeof configField.default === 'undefined' ? '' : configField.default,
          dirty: false,
        };
      });

      return {fields, uniqueKey};
    },
    validate: function(fields) { // expects something like this.state.field
      return _.mapValues(fields, (field, fieldName) => {
        let dirty = this.props.forceDirty || field.dirty;
        let required = config.fieldMap[fieldName].forceRequired ||
          this.props.required || config.fieldMap[fieldName].required;
        let showing = typeof config.fieldMap[fieldName].showIf === 'undefined' ||
          config.fieldMap[fieldName].showIf(fields);

        if (!showing) {
          return {message: null, complete: true}; // non-showing elements count as complete
        } else if (!dirty) {
          if (required) {
            return {message: null, complete: false};
          }
          return {message: null, complete: true};
        } else if (field.value === '') {
          if (required) {
            return {message: 'This is a required field.', complete: false};
          }
          return {message: null, complete: true};
        }

        let validateMessage = config.fieldMap[fieldName].validator(field.value, fields);
        return {message: validateMessage, complete: validateMessage === null};
      })
    },
    onChange: function(fieldName, event) {
      let fields =  _.assign({}, this.state.fields);
      fields[fieldName] = {
        value: event.target.value,
        dirty: true,
      };
      this.setState({fields});

      // When optional, complete will be true (unless there is a forceRequire)
      let complete = _.reduce(this.validate(fields), (complete, fieldValidation) => {
        return complete && fieldValidation.complete;
      }, true);

      let values;
      if (config.fields.length === 1) {
        values = {
          value: event.target.value
        }
      } else {
        values = _.mapValues(fields, fieldState => {
          return fieldState.value;
        });
      }
      this.props.onUpdate(values, complete);
    },
    render: function() {
      let validation = this.validate(this.state.fields);

      return <div className="optionsTable__pair">
        <div className="optionsTable__pair__title">
          {this.props.label}
          {!this.props.required && <span className="optionsTable__pair__title__optional"> (optional)</span>}
        </div>
        <div className="optionsTable__pair__content">
          {_.map(config.fields, (fieldConfig, index) => {
            if (typeof fieldConfig.showIf === 'undefined' || fieldConfig.showIf(this.state.fields)) {
              let formElement;
              switch(fieldConfig.type) {
                case 'radio':
                  formElement = <div className="s-buttonGroup picker picker--radio">
                    {_.map(fieldConfig.options, option => {
                      return <label key={option.name} className="s-buttonGroup__wrapper">
                        <input type="radio" className="s-buttonGroup__radio" name={this.state.uniqueKey + fieldConfig.name} onChange={this.onChange.bind(this, fieldConfig.name)} value={option.value} checked={this.state.fields[fieldConfig.name].value == option.value} />
                        <span className="s-button s-button__light">{option.label}</span>
                      </label>
                    })}
                  </div>;
                  break;
                case 'text':
                  formElement = <input type="text" value={this.state.fields[fieldConfig.name].value} placeholder={fieldConfig.placeholder} onChange={this.onChange.bind(this, fieldConfig.name)}
                  className="picker picker--textInput"/>
                  break;
                case 'textarea':
                  formElement = <textarea value={this.state.fields[fieldConfig.name].value} placeholder={fieldConfig.placeholder} onChange={this.onChange.bind(this, fieldConfig.name)}
                  className="picker picker--textArea"></textarea>
                  break;
                default:
                  throw new Error(`Unknown picker field type: ${fieldConfig.type}. Check the config object passed to PickerGenerator.`);
              }
              return <div key={fieldConfig.name} className="optionsTable__pair__content__field">
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
