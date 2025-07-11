import { useEffect, useState } from "react";
import { throttle } from "lodash";

type LayoutMode = "desktop" | "mobile";

export const useWindowSize = () => {
  const MAX_WIDTH = 940;

  const [layoutMode, setLayoutMode] = useState<LayoutMode>();
  const [windowWidth, setWindowWidth] = useState<number>();

  const getLayoutMode = (windowWidth: number) => {
    return windowWidth < MAX_WIDTH ? "mobile" : "desktop";
  };

  useEffect(() => {
    const setState = () => {
      setWindowWidth(document.documentElement.clientWidth);
      setLayoutMode(getLayoutMode(document.documentElement.clientWidth));
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

  return { windowWidth, layoutMode };
};
