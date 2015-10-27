import _ from 'lodash';
import axios from 'axios';
import querystring from 'querystring';
import {EventEmitter} from 'events';
import ExplorerConstants from '../constants/ExplorerConstants'
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import endpoints from '../endpoints.json'

const CHANGE_EVENT = 'change';
const URL_CHANGE_EVENT = 'url_change';
const NETWORK_CHANGE = 'network_change';
const RESPONSE_EVENT = 'response';

class ExplorerStoreClass extends EventEmitter {
  constructor(endpoints) {
    super();
    this.endpoints = endpoints;
    this.params = {};
    this.response = null;
    this.horizonRoot = {
      test: 'https://horizon-testnet.stellar.org',
      public: 'https://horizon.stellar.org'
    };
    this.usePublicNetwork();
  }

  usePublicNetwork() {
    this.currentNetwork = 'public';
    this.emitNetworkChange();
  }

  useTestNetwork() {
    this.currentNetwork = 'test';
    this.emitNetworkChange();
  }

  submitRequest() {
    axios.get(ExplorerStore.getCurrentUrl())
      .then(response => {
        this.response = response.data;
        this.emitResponse();
      })
      .catch(error => {
        // TODO
        throw new Error('Network error');
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

  getCurrentEndpointParams() {
    if (this.selectedEndpoint) {
      return this.selectedEndpoint.params;
    } else {
      return null;
    }
  }

  setParam(key, value) {
    if (value) {
      this.params[key] = value;
    } else {
      delete this.params[key];
    }
    this.emitUrlChange();
  }

  getCurrentUrl() {
    let path = '';
    let params = _.clone(this.params);
    if (this.selectedEndpoint) {
      path = _.reduce(params, (path, value, key) => {
        let oldPath = path;
        let newPath = path.replace(`{${key}}`, value);
        if (oldPath != newPath) {
          delete params[key];
        }
        return newPath;
      }, this.selectedEndpoint.path);
    }

    let query = querystring.stringify(params);
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

  emitChange() {
    this.response = null;
    this.emit(RESPONSE_EVENT);
    this.emit(CHANGE_EVENT);
  }

  emitUrlChange() {
    this.emit(URL_CHANGE_EVENT);
  }

  emitNetworkChange() {
    this.emit(NETWORK_CHANGE);
  }

  emitResponse() {
    this.emit(RESPONSE_EVENT);
  }

  getResponse() {
    return this.response;
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
      if (this.selectedEndpoint) {
        this.selectedEndpoint.selected = false;
      }
      this.selectedEndpoint = endpoint;
      this.params = {};
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
    default:
  }
});
