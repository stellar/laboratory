"use client";
import { createContext, ReactNode, useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createStore } from "@/store/createStore";
import { useBuildFlowStore } from "@/store/createTransactionFlowStore";

export type StoreType = ReturnType<typeof createStore>;
export const ZustandContext = createContext<StoreType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;

  const [store] = useState(() => createStore({ url }));

  useEffect(() => {
    const unsubscribe = store.subscribe((state, prevState) => {
      if (prevState.network.id && state.network.id !== prevState.network.id) {
        useBuildFlowStore.getState().resetAll();
      }
    });

    return unsubscribe;
  }, [store]);

  return (
    <ZustandContext.Provider value={store}>{children}</ZustandContext.Provider>
  );
};
