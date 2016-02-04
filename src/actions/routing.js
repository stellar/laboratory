export const UPDATE_LOCATION = "UPDATE_LOCATION";
export function updateLocation(location) {
  return {
    type: UPDATE_LOCATION,
    location
  }
}

export const LOAD_STATE = "LOAD_STATE";
export function loadState(slug, payload) {
  return {
    type: LOAD_STATE,
    slug,
    payload
  }
}
