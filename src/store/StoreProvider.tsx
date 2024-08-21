"use client";
import { createContext, ReactNode, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { createStore } from "@/store/createStore";

export type StoreType = ReturnType<typeof createStore>;
export const ZustandContext = createContext<StoreType | null>(null);

export const StoreProvider = ({ children }: { children: ReactNode }) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const url = `${pathname}?${searchParams}`;

  const [store] = useState(() =>
    createStore({
      url,
    }),
  );

  return (
    <ZustandContext.Provider value={store}>{children}</ZustandContext.Provider>
  );
};
