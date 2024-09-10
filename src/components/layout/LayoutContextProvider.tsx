"use client";

import { createContext, useEffect, useState } from "react";
import { throttle } from "lodash";

type LayoutMode = "desktop" | "mobile";

type WindowContextProps = {
  layoutMode?: LayoutMode;
};

export const WindowContext = createContext<WindowContextProps>({
  layoutMode: undefined,
});

export const LayoutContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const MAX_WIDTH = 1040;

  const [layoutMode, setLayoutMode] = useState<LayoutMode>();

  const getLayoutMode = (windowWidth: number) => {
    return windowWidth < MAX_WIDTH ? "mobile" : "desktop";
  };

  useEffect(() => {
    setLayoutMode(getLayoutMode(document.documentElement.clientWidth));

    const handleResize = throttle(() => {
      setLayoutMode(getLayoutMode(document.documentElement.clientWidth));
    }, 500);

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <WindowContext.Provider value={{ layoutMode }}>
      {children}
    </WindowContext.Provider>
  );
};
