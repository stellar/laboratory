import axios from 'axios';
import _ from 'lodash';
import dispatchInNewStack from '../utilities/dispatchInNewStack';
import {CallBuilder} from 'stellar-sdk/lib/call_builder';
import URI from 'urijs';

export const CHOOSE_ENDPOINT = "CHOOSE_ENDPOINT";
export function chooseEndpoint(resource, endpoint) {
  return {
    type: CHOOSE_ENDPOINT,
    resource,
    endpoint
  }
}
export const CHANGE_PENDING_REQUEST_PROPS = "CHANGE_PENDING_REQUEST_PROPS";
export function changePendingRequestProps(props) {
  return {
    type: CHANGE_PENDING_REQUEST_PROPS,
    props,
  }
}

export const UPDATE_VALUE = "UPDATE_VALUE";
export function updateValue(param, value) {
  return {
    type: UPDATE_VALUE,
    param,
    value,
  }
}

export const START_REQUEST = "START_REQUEST"
export const ERROR_REQUEST = "ERROR_REQUEST"
export const UPDATE_REQUEST = "UPDATE_REQUEST"
let resultIdNonce = 0;
let closeStreamFn;
export function submitRequest(request) {
  return dispatch => {
    // Close old stream if it exists
    if (typeof closeStreamFn === 'function') {
      closeStreamFn();
      closeStreamFn = null;
    }

    let id = resultIdNonce++;
    dispatch({
      type: START_REQUEST,
      id,
    });

    if (request.streaming) {
      closeStreamFn = streamingRequest(request.url, (message) => {
        // dispatchInNewStack is not needed for streaming since there is no catch here
        dispatch({
          type: UPDATE_REQUEST,
          id,
          body: message,
        })
      })
    } else {
      // dispatchInNewStack will only be called at most one time.
      httpRequest(request)
        .then(r => {
          dispatchInNewStack(dispatch, {
            type: UPDATE_REQUEST,
            id,
            body: r.data,
          });
        })
        .catch(e => {
          dispatchInNewStack(dispatch, {
            type: ERROR_REQUEST,
            id,
            errorStatus: e.status,
            body: e.data,
          })
        });
    }
  }
}

function httpRequest(request) {
  if (request.method === 'POST') {
    if (typeof request.formData !== 'string') {
      throw new Error('Network POST requests require the form data to be in string format.');
    }
    return axios.post(request.url, request.formData);
  }
  return axios.get(request.url);
}

function streamingRequest(url, onmessage) {
  var callBuilder = new CallBuilder(URI(url));
  return callBuilder.stream({onmessage});
}
