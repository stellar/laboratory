export const UPDATE_LOCATION = "UPDATE_LOCATION";
export function updateLocation(slug) {
  return {
    type: UPDATE_LOCATION,
    slug
  }
}

export const LOAD_STATE = "LOAD_STATE";
export function loadState(slug, queryObj) {
  return {
    type: LOAD_STATE,
    slug,
    queryObj
  }
}
