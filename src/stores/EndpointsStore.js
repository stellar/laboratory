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

  getResponse() {
    return {
      "_embedded": {
        "records": [
          {
            "_links": {
              "effects": {
                "href": "/operations/1340931739488257/effects{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=1340931739488257\u0026order=asc"
              },
              "self": {
                "href": "/operations/1340931739488257"
              },
              "succeeds": {
                "href": "/operations?cursor=1340931739488257\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/50befb58d93b83a7a4de7fa5afe41f5b6032b7cb71a127919aa73f2c41a8d3d1"
              }
            },
            "account": "GD3N7GTKAOIRB5QUJKMFU2OHJ7HJNF3O2FFQNLIO4X7YEB44HSCM3LQG",
            "funder": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
            "id": 1340931739488257,
            "paging_token": "1340931739488257",
            "source_account": "GBS43BF24ENNS3KPACUZVKK2VYPOZVBQO2CISGZ777RYGOPYC2FT6S3K",
            "starting_balance": "10000.0",
            "type": "create_account",
            "type_i": 0
          },
          {
            "_links": {
              "effects": {
                "href": "/operations/1337001844412417/effects{?cursor,limit,order}",
                "templated": true
              },
              "precedes": {
                "href": "/operations?cursor=1337001844412417\u0026order=asc"
              },
              "self": {
                "href": "/operations/1337001844412417"
              },
              "succeeds": {
                "href": "/operations?cursor=1337001844412417\u0026order=desc"
              },
              "transaction": {
                "href": "/transactions/fe55a3714598af918d590c135b7ebd938d88e11f900df4b73f7e32d712780f1b"
              }
            },
            "amount": "1.488",
            "asset_type": "native",
            "from": "GBEXWUM5OH45UJTUEF5AYCXKLASHCNKBLERZ47GO3UOMLRDCXQDOXJFZ",
            "id": 1337001844412417,
            "paging_token": "1337001844412417",
            "source_account": "GBEXWUM5OH45UJTUEF5AYCXKLASHCNKBLERZ47GO3UOMLRDCXQDOXJFZ",
            "to": "GCR4I6RAUIJBEFEMURYE3AD3CRFWX4H4AJA2KZWXOCH5WVWHS3IOOJWT",
            "type": "payment",
            "type_i": 1
          }
        ]
      },
      "_links": {
        "next": {
          "href": "/operations?order=desc\u0026limit=2\u0026cursor=1337001844412417"
        },
        "prev": {
          "href": "/operations?order=asc\u0026limit=2\u0026cursor=1340931739488257"
        },
        "self": {
          "href": "/operations?order=desc\u0026limit=2\u0026cursor="
        }
      }
    };
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
