import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { localStorageSettings } from "@/helpers/localStorageSettings";
import { SETTINGS_CODE_WRAP } from "@/constants/settings";

export const useCodeWrappedSetting = (): [
  boolean,
  Dispatch<SetStateAction<boolean>>,
] => {
  const [isWrapped, setIsWrapped] = useState(false);

  useEffect(() => {
    const savedSetting = localStorageSettings.get(SETTINGS_CODE_WRAP);

    if (savedSetting) {
      setIsWrapped(savedSetting === "true" ? true : false);
    }
  }, []);

  return [isWrapped, setIsWrapped];
};
