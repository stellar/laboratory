import { SavedEndpointHorizon } from "@/types/types";
import { localStorageSavedEndpointsHorizon } from "./localStorageSavedEndpointsHorizon";
import { arrayItem } from "./arrayItem";

export const saveEndpointHorizon = (endpoint: SavedEndpointHorizon) => {
  const currentSaved = localStorageSavedEndpointsHorizon.get();
  localStorageSavedEndpointsHorizon.set(arrayItem.add(currentSaved, endpoint));
};
