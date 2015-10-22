import _ from 'lodash';
import querystring from 'querystring';
import {EventEmitter} from 'events';
import ExplorerConstants from '../constants/ExplorerConstants'
import {AppDispatcher} from '../dispatcher/AppDispatcher';
import endpoints from '../endpoints.json'

const CHANGE_EVENT = 'change';
const URL_CHANGE_EVENT = 'url_change';

class EndpointsStoreClass extends EventEmitter {
  constructor(endpoints) {
    super();
    this.endpoints = endpoints;
    this.params = {};
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

    return `https://horizon-testnet.stellar.org${path}${query}`;
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  addUrlChangeListener(callback) {
    this.on(URL_CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  removeUrlChangeListener(callback) {
    this.removeListener(URL_CHANGE_EVENT, callback);
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  emitUrlChange() {
    this.emit(URL_CHANGE_EVENT);
  }

  selectResource(id) {
    let resource = this.get(id);
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

export let EndpointsStore = new EndpointsStoreClass(endpoints);

AppDispatcher.register(action => {
  switch(action.type) {
    case ExplorerConstants.RESOURCE_SELECT:
      EndpointsStore.selectResource(action.resourceId);
      break;
    case ExplorerConstants.ENDPOINT_SELECT:
      EndpointsStore.selectEndpoint(action.endpointId);
      break;
    default:
  }
});
