"use client";

import { createContext } from "react";
import { useWindowSize } from "@/hooks/useWindowSize";

type LayoutMode = "desktop" | "mobile";

type WindowContextProps = {
  layoutMode?: LayoutMode;
  windowWidth?: number;
};

export const WindowContext = createContext<WindowContextProps>({
  layoutMode: undefined,
  windowWidth: undefined,
});

export const LayoutContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { windowWidth, layoutMode } = useWindowSize();

  return (
    <WindowContext.Provider value={{ layoutMode, windowWidth }}>
      {children}
    </WindowContext.Provider>
  );
};
