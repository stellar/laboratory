import axios from 'axios';

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
export const FINISH_REQUEST = "FINISH_REQUEST"
export function submitRequest(request) {
  return dispatch => {
    dispatch({type: "START_REQUEST"});
    httpRequest(request)
      .then(r => dispatch({type: "FINISH_REQUEST", payload: r}))
      .catch(e => dispatch({type: "FINISH_REQUEST", error: e}));
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
