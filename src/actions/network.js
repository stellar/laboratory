import NETWORK from '../constants/network';

export const SET_NETWORKS = "SET_NETWORKS";
export function setNetworks(networks) {
  return {
    type: SET_NETWORKS,
    networks
  }
}

export const SHOW_MODAL = "SHOW_MODAL";
export const HIDE_MODAL = "HIDE_MODAL";
export function setModalVisibility(visible) {
  return {
    type: visible ? SHOW_MODAL : HIDE_MODAL
  }
}

export const UPDATE_MODAL = "UPDATE_MODAL";
export function updateModal(key, value) {
  return {
    type: UPDATE_MODAL,
    key,
    value
  }
}

export const SET_PARAMS = "SET_PARAMS";
export function chooseNetwork(name) {
  return {
    type: SET_PARAMS,
    params: {
      name,
      horizonURL: NETWORK.available[name].horizonURL,
      networkPassphrase: NETWORK.available[name].networkPassphrase,
    }
  }
}

export function setCustomParams(params) {
  params.name = 'custom';
  return {
    type: SET_PARAMS,
    params
  }
}
