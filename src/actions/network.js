export const CHOOSE_NETWORK = "CHOOSE_NETWORK";
export function chooseNetwork(name) {
  return {
    type: CHOOSE_NETWORK,
    name
  }
}

export const SET_NETWORKS = "SET_NETWORKS";
export function setNetworks(networks) {
  return {
    type: SET_NETWORKS,
    networks
  }
}
