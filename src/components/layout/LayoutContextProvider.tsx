"use client";

import { createContext, useEffect, useState } from "react";
import { throttle } from "lodash";

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
  const MAX_WIDTH = 1040;

  const [layoutMode, setLayoutMode] = useState<LayoutMode>();
  const [windowWidth, setWindowWidth] = useState<number>();

  const getLayoutMode = (windowWidth: number) => {
    return windowWidth < MAX_WIDTH ? "mobile" : "desktop";
  };

  useEffect(() => {
    const setState = () => {
      setLayoutMode(getLayoutMode(document.documentElement.clientWidth));
      setWindowWidth(document.documentElement.clientWidth);
    };

    setState();

    const handleResize = throttle(() => {
      setState();
    }, 500);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <WindowContext.Provider value={{ layoutMode, windowWidth }}>
      {children}
    </WindowContext.Provider>
  );
};
