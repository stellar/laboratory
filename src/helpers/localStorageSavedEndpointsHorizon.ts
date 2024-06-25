import { LOCAL_STORAGE_SAVED_ENDPOINTS_HORIZON } from "@/constants/settings";
import { SavedEndpointHorizon } from "@/types/types";

export const localStorageSavedEndpointsHorizon = {
  get: () => {
    const savedEndpointsString = localStorage.getItem(
      LOCAL_STORAGE_SAVED_ENDPOINTS_HORIZON,
    );
    return savedEndpointsString
      ? (JSON.parse(savedEndpointsString) as SavedEndpointHorizon[])
      : [];
  },
  set: (savedEndpoints: SavedEndpointHorizon[]) => {
    return localStorage.setItem(
      LOCAL_STORAGE_SAVED_ENDPOINTS_HORIZON,
      JSON.stringify(savedEndpoints),
    );
  },
  remove: () => {
    return localStorage.removeItem(LOCAL_STORAGE_SAVED_ENDPOINTS_HORIZON);
  },
};
