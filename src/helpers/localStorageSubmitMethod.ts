import { LOCAL_STORAGE_SETTINGS } from "@/constants/settings";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { LabSettings } from "@/types/types";

export const localStorageSubmitMethod = {
  get: (key: string) => {
    const labSettings = getSettings();
    return labSettings[key];
  },
  set: ({ key, value }: LabSettings) => {
    const updatedSettings = {
      ...getSettings(),
      [key]: value,
    };

    return localStorage.setItem(
      LOCAL_STORAGE_SETTINGS,
      JSON.stringify(updatedSettings),
    );
  },
  remove: (key: string) => {
    const updatedSettings = { ...getSettings() };

    if (updatedSettings[key]) {
      delete updatedSettings[key];

      if (isEmptyObject(updatedSettings)) {
        return localStorage.removeItem(LOCAL_STORAGE_SETTINGS);
      }
    }

    return localStorage.setItem(
      LOCAL_STORAGE_SETTINGS,
      JSON.stringify(updatedSettings),
    );
  },
};

const getSettings = () => {
  const labSettings = localStorage.getItem(LOCAL_STORAGE_SETTINGS);
  return labSettings ? (JSON.parse(labSettings) as LabSettings) : {};
};
