"use client";

import { useContext } from "react";
import { useStore as useZustandStore } from "zustand";
import { Store } from "@/store/createStore";
import { ZustandContext } from "@/store/StoreProvider";

export const useStore = <T = Store>(selector?: (state: Store) => T) => {
  selector ??= (state) => state as T;
  const store = useContext(ZustandContext);
  if (!store) throw new Error("Store is missing the provider");
  return useZustandStore(store, selector);
};
