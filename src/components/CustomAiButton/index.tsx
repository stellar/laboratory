"use client";

import { Logo } from "@stellar/design-system";
import React, { useEffect, useState } from "react";
import "./styles.scss";

declare global {
  interface Window {
    Stella?: {
      open: () => void;
    };
  }
}

export const CustomAiButton = () => {
  const [isStellaAvailable, setIsStellaAvailable] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const checkStella = () => {
      if (window.Stella?.open) {
        setIsStellaAvailable(true);
        return true;
      }
      return false;
    };

    // Run an immediate check first
    if (checkStella()) {
      return;
    }

    const startTime = Date.now();
    const intervalId = window.setInterval(() => {
      const found = checkStella();
      const elapsed = Date.now() - startTime;

      // Stop polling once Stella is available or after a timeout
      if (found || elapsed > 10000) {
        window.clearInterval(intervalId);
      }
    }, 500);

    return () => {
      window.clearInterval(intervalId);
    };
  }, []);

  const handleClick = () => {
    if (typeof window !== "undefined" && window.Stella?.open) {
      window.Stella.open();
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`CustomAiButton ${isStellaAvailable ? "CustomAiButton--loaded" : "CustomAiButton--hidden"}`}
      aria-label="Open Stellar AI Assistant"
    >
      <Logo.StellarShort />
      Stella AI
    </button>
  );
};
