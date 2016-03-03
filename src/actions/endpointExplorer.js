import axios from 'axios';
var EventSource = (typeof window === 'undefined') ? require('eventsource') : window.EventSource;

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
export function submitRequest(request) {
  return dispatch => {
    let id = resultIdNonce++;
    dispatch({
      type: START_REQUEST,
      id,
    });

    if (request.streaming) {
      streamingRequest(request.url, (message) => {
        dispatch({
          type: UPDATE_REQUEST,
          id,
          body: JSON.parse(message.data),
        })
      })
    } else {
      httpRequest(request)
        .then(r => dispatch({
          type: UPDATE_REQUEST,
          id,
          body: r.data,
        }))
        .catch(e => {
          dispatch({
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
  var es = new EventSource(url);
  es.onmessage = onmessage;
}
