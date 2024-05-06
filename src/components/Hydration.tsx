"use client";

import { useEffect, useState } from "react";

// Component to detect when client is ready to be rendered.
export const Hydration = ({ children }: { children: React.ReactNode }) => {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? children : null;
};
