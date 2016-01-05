import React from 'react';
import {chooseEndpoint, submitRequest, updateValues} from "../actions/endpointExplorer"
import {connect} from 'react-redux';
import {EndpointPicker} from './EndpointPicker';
import {EndpointSetup} from './EndpointSetup';
import {EndpointResult} from './EndpointResult';
import {getEndpoint} from '../data/endpoints';
import UriTemplates from 'uri-templates';
import querystring from 'querystring';

class EndpointExplorer extends React.Component {
  render() {
    let {dispatch} = this.props;
    let {
      currentResource,
      currentEndpoint,
      currentRequest,
      pendingRequest,
    } = this.props.state;

    let endpoint = getEndpoint(currentResource, currentEndpoint);
    let request = buildRequest(this.props.baseURL, endpoint, pendingRequest);

    let endpointSetup;
    if (currentEndpoint !== '') {
      endpointSetup = <EndpointSetup
        request={request}
        params={pendingRequest.params}
        onSubmit={() => dispatch(submitRequest(request.url, request.method, request.formData))}
        onUpdate={(param, values, complete) => dispatch(updateValues(param, values, complete))}
      />
    }

    return <div className="so-back">
      <div className="so-chunk">
        <div className="EndpointExplorer">
          <div className="EndpointExplorer__picker">
            <EndpointPicker
              currentResource={currentResource}
              currentEndpoint={currentEndpoint}
              onChange={(r,e)=> dispatch(chooseEndpoint(r,e))}
              />
          </div>

          <div className="EndpointExplorer__setup">
            {endpointSetup}
          </div>

          <div className="EndpointExplorer__result">
            <EndpointResult {...currentRequest} />
          </div>
        </div>
      </div>
    </div>
  }
}

export default connect(chooseState)(EndpointExplorer)

function chooseState(state) {
  return {
    state: state.endpointExplorer,
    baseURL: state.network.available[state.network.current].url,
  };
}

function buildRequest(baseUrl, endpoint, pendingRequest) {
  let request = {
    url: buildRequestUrl(baseUrl, endpoint, pendingRequest.values),
    formData: '',
  };

  if (typeof endpoint !== 'undefined') {
    request.method = endpoint.method;
  }

  if (request.method === 'POST') {
    let postData = {};
    _.each(pendingRequest.params, (param) => {
      let paramValue = pendingRequest.values[param.id];
      if (typeof paramValue === 'undefined') {
        return;
      }
      postData[param.id] = paramValue.value;
    });

    request.formData = querystring.stringify(postData);
  }

  return request;
}

function buildRequestUrl (baseUrl, endpoint, values) {
  if (typeof endpoint === 'undefined') {
    return '';
  }
  let uriTemplate = baseUrl + endpoint.path.template;
  let template = new UriTemplates(uriTemplate);

  // uriParams contains what we want to fill the url with
  let uriParams = {};
  _.each(template.varNames, (varName) => {
    let objectPath = (varName in endpoint.path) ?
      endpoint.path[varName] : varName + '.value';
    let value = _.get(values, objectPath);
    if (typeof value !== 'undefined' && value !== '') {
      uriParams[varName] = value;
    }
  });

  // Fill in unfilled parameters with placeholders (like {source_account})
  // Also create a map to unescape these placeholders
  let unescapeMap = [];
  _.each(template.fromUri(uriTemplate), (placeholder, param) => {
    if (!(param in uriParams)) {
      uriParams[param] = placeholder;
      unescapeMap.push({
        oldStr: encodeURIComponent(placeholder),
        newStr: placeholder
      });
    }
  });

  let builtUrl = _.reduce(unescapeMap, (url, replacement) => {
    return url.replace(replacement.oldStr, replacement.newStr);
  }, template.fill(uriParams));

  return builtUrl;
};
