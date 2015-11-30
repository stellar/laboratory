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

export const START_REQUEST = "START_REQUEST"
export const FINISH_REQUEST = "FINISH_REQUEST"
export function submitRequest(request) {
  return dispatch => {
    dispatch({type: "START_REQUEST"});
    axios.get(request.url)
      .then(r => dispatch({type: "FINISH_REQUEST", payload: r}))
      .catch(e => dispatch({type: "FINISH_REQUEST", error: e}));
  }
}
