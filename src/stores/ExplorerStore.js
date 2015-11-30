import _ from 'lodash';
import axios from 'axios';
import querystring from 'querystring';
import {EventEmitter} from 'events';
import ExplorerConstants from '../constants/ExplorerConstants'
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import {endpointsMap} from '../endpoints'
let endpoints = endpointsMap;

const CHANGE_EVENT = 'change';
const URL_CHANGE_EVENT = 'url_change';
const PARAMETER_CHANGE_EVENT = 'parameter_change';
const PARAMETER_ERROR_EVENT = 'parameter_error';
const SUBMIT_DISABLED_EVENT = 'submit_disabled';
const LOADING_EVENT = 'loading';
const NETWORK_CHANGE = 'network_change';
const RESPONSE_EVENT = 'response';

class ExplorerStoreClass extends EventEmitter {
  constructor(endpoints) {
    super();
    this.endpoints = endpoints;
    this.currentEndpointId = null;
    this.params = {};
    this.loading = false;
    this.response = null;
    this.submitDisabled = false;
    this.horizonRoot = {
      test: 'https://horizon-testnet.stellar.org',
      public: 'https://horizon.stellar.org'
    };
    this.useTestNetwork();
  }

  usePublicNetwork() {
    this.currentNetwork = 'public';
    this.emitNetworkChange();
  }

  useTestNetwork() {
    this.currentNetwork = 'test';
    this.emitNetworkChange();
  }

  useNetwork(network) {
    if (network === 'public') {
      this.usePublicNetwork();
    } else {
      this.useTestNetwork();
    }
  }

  setLoading(loading) {
    this.loading = loading;
    this.emit(LOADING_EVENT);
  }

  submitRequest() {
    // Check if all required fields are set
    if (this.submitDisabled) {
      // Show `Required field` error for all missing fields
      _.each(this.requiredEmptyFields, param => {
        this.emit(PARAMETER_ERROR_EVENT, {param, error: 'This is a required field.'});
      });
      return;
    }

    this.setLoading(true);
    axios.get(ExplorerStore.getCurrentUrl())
      .then(response => {
        this.response = {
          success: true,
          data: response.data
        };
        this.emitResponse();
      })
      .catch(response => {
        let data;
        if (response instanceof Error) {
          data = response.message;
        } else {
          data = response.data;
        }

        this.response = {
          success: false,
          data: data
        };
        this.emitResponse();
      });
  }

  get(id) {
    return this.endpoints[id]
  }

  /**
   * Returns array of resources
   */
  getResources() {
    return _(this.endpoints).reduce((result, resource, id) => {
      resource.id = id;
      result.push(resource);
      return result;
    }, []);
  }

  getCurrentEndpoints() {
    if (this.selectedResource) {
      return _(this.selectedResource.list).reduce((result, endpoint, id) => {
        endpoint.id = id;
        result.push(endpoint);
        return result;
      }, []);
    } else {
      return [];
    }
  }

  getCurrentEndpointId() {
    return this.currentEndpointId;
  }

  getCurrentEndpointParams() {
    if (this.selectedEndpoint) {
      return this.selectedEndpoint.params;
    } else {
      return null;
    }
  }

  getCurrentEndpointRequiredParams() {
    if (this.selectedEndpoint) {
      return this.selectedEndpoint.required;
    } else {
      return null;
    }
  }

  setParam(key, value, error) {
    if (value) {
      this.params[key] = {value, error};
    } else {
      delete this.params[key];
    }

    // Check if all required params are set and there
    // are no errors and update `submitDisabled` state
    let disabled = false;
    let requiredEmptyFields;
    if (this.selectedEndpoint.required) {
      requiredEmptyFields = _.clone(this.selectedEndpoint.required);
    } else {
      requiredEmptyFields = [];
    }

    _.each(this.params, ({value, error}, key) => {
      if (error) {
        disabled = true;
      } else {
        requiredEmptyFields = _.without(requiredEmptyFields, key);
      }
    });

    // If there are not errors check if all required
    // params are set
    if (!disabled) {
      disabled = requiredEmptyFields.length > 0;
    }

    // Extra checks for `order_book`: selling_asset_type
    if (this.params.selling_asset_type) {
      if (this.params.selling_asset_type.value === 'native') {
        delete this.params.selling_asset_code;
        delete this.params.selling_asset_issuer;
      } else {
        if (!this.params.selling_asset_code || !this.params.selling_asset_code.value) {
          requiredEmptyFields.push('selling_asset_code');
          disabled = true;
        }
        if (!this.params.selling_asset_issuer || !this.params.selling_asset_issuer.value) {
          requiredEmptyFields.push('selling_asset_issuer');
          disabled = true;
        }
      }
    }

    // Extra checks for `order_book`: buying_asset_type
    if (this.params.buying_asset_type) {
      if (this.params.buying_asset_type.value === 'native') {
        delete this.params.buying_asset_code;
        delete this.params.buying_asset_issuer;
      } else {
        if (!this.params.buying_asset_code || !this.params.buying_asset_code.value) {
          requiredEmptyFields.push('buying_asset_code');
          disabled = true;
        }
        if (!this.params.buying_asset_issuer || !this.params.buying_asset_issuer.value) {
          requiredEmptyFields.push('buying_asset_issuer');
          disabled = true;
        }
      }
    }

    // Extra checks for `paths`
    if (this.params.destination_asset_type) {
      if (this.params.destination_asset_type.value === 'native') {
        delete this.params.destination_asset_code;
        delete this.params.destination_asset_issuer;
      } else {
        if (!this.params.destination_asset_code || !this.params.destination_asset_code.value) {
          requiredEmptyFields.push('destination_asset_code');
          disabled = true;
        }
        if (!this.params.destination_asset_issuer || !this.params.destination_asset_issuer.value) {
          requiredEmptyFields.push('destination_asset_issuer');
          disabled = true;
        }
      }
    }

    this.requiredEmptyFields = requiredEmptyFields;
    this.submitDisabled = disabled;
    this.emit(PARAMETER_CHANGE_EVENT, {key, value});
    this.emit(SUBMIT_DISABLED_EVENT);
    this.emit(URL_CHANGE_EVENT);
  }

  getCurrentUrl() {
    let path = '';
    let params = _.cloneDeep(this.params);
    if (this.selectedEndpoint) {
      path = _.reduce(params, (path, {value, error}, key) => {
        let oldPath = path;
        let newPath = path.replace(`{${key}}`, value);
        if (oldPath != newPath) {
          delete params[key];
        }
        return newPath;
      }, this.selectedEndpoint.path);
    }

    let query = querystring.stringify(_.mapValues(params, ({value, error}) => value));
    if (query) {
      query = `?${query}`;
    }

    let root = this.horizonRoot[this.currentNetwork];
    return `${root}${path}${query}`;
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  addUrlChangeListener(callback) {
    this.on(URL_CHANGE_EVENT, callback);
  }

  addNetworkChangeListener(callback) {
    this.on(NETWORK_CHANGE, callback);
  }

  addResponseListener(callback) {
    this.on(RESPONSE_EVENT, callback);
  }

  addLoadingListener(callback) {
    this.on(LOADING_EVENT, callback);
  }

  addParameterChangeListener(callback) {
    this.on(PARAMETER_CHANGE_EVENT, callback);
  }

  addParameterErrorListener(callback) {
    this.on(PARAMETER_ERROR_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  removeUrlChangeListener(callback) {
    this.removeListener(URL_CHANGE_EVENT, callback);
  }

  removeNetworkChangeListener(callback) {
    this.removeListener(NETWORK_CHANGE, callback);
  }

  removeResponseListener(callback) {
    this.removeListener(RESPONSE_EVENT, callback);
  }

  removeLoadingListener(callback) {
    this.removeListener(LOADING_EVENT, callback);
  }

  removeParameterChangeListener(callback) {
    this.removeListener(PARAMETER_CHANGE_EVENT, callback);
  }

  removeParameterErrorListener(callback) {
    this.removeListener(PARAMETER_ERROR_EVENT, callback);
  }

  emitChange() {
    this.response = null;
    this.emit(RESPONSE_EVENT);
    this.emit(CHANGE_EVENT);
  }

  emitNetworkChange() {
    this.emit(NETWORK_CHANGE);
  }

  emitResponse() {
    this.loading = false;
    this.emit(RESPONSE_EVENT);
  }

  getResponse() {
    return this.response;
  }

  getLoadingState() {
    return this.loading;
  }

  selectResource(id) {
    let resource = this.get(id);

    if (resource === this.selectedResource) {
      // user selected the current endpoint. no action required
      return;
    }

    if (resource) {
      if (this.selectedResource) {
        this.selectedResource.selected = false;
      }
      if (this.selectedEndpoint) {
        this.selectedEndpoint.selected = false;
      }
      this.selectedResource = resource;
      this.selectedEndpoint = null;
      resource.selected = true;
      this.emitChange();
    } else {
      throw new Error(`Resource "${id}" not found.`)
    }
  }

  selectEndpoint(id) {
    let endpoint = this.selectedResource.list[id];

    if (endpoint === this.selectedEndpoint) {
      // user selected the current endpoint. no action required
      return;
    }

    if (endpoint) {
      this.currentEndpointId = id;
      if (this.selectedEndpoint) {
        this.selectedEndpoint.selected = false;
      }
      this.selectedEndpoint = endpoint;
      this.params = {};
      this.submitDisabled = !!endpoint.required;
      this.requiredEmptyFields = endpoint.required;
      endpoint.selected = true;
      this.emitChange();
    } else {
      throw new Error(`Endpoint "${id}" not found.`)
    }
  }
}

export let ExplorerStore = new ExplorerStoreClass(endpoints);

AppDispatcher.register(action => {
  switch(action.type) {
    case ExplorerConstants.RESOURCE_SELECT:
      ExplorerStore.selectResource(action.resourceId);
      break;
    case ExplorerConstants.ENDPOINT_SELECT:
      ExplorerStore.selectEndpoint(action.endpointId);
      break;
    case ExplorerConstants.NETWORK_SELECT:
      ExplorerStore.useNetwork(action.network);
      break;
    case ExplorerConstants.PARAMETER_SET:
      ExplorerStore.setParam(action.key, action.value, action.error);
      break;
    default:
  }
});
