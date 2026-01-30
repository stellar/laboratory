"use client";

import React from "react";
import Image from "next/image";

declare global {
  interface Window {
    Stella?: {
      open: () => void;
    };
  }
}

export const CustomAiButton = () => {
  const handleClick = () => {
    if (window.Stella?.open) {
      window.Stella.open();
    }
  };

  return (
    <button
      onClick={handleClick}
      className="custom-ai-button"
      aria-label="Open Stellar AI Assistant"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        zIndex: 1000,
        padding: 0,
      }}
    >
      <Image
        src="/images/stella-ai-button.png"
        alt="AI Assistant"
        width={100}
        height={32}
        priority
      />
    </button>
  );
};
