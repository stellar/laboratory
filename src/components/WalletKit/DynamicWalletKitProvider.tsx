"use client";

import dynamic from "next/dynamic";

// Dynamically import WalletKitContextProvider with SSR disabled
// This ensures the StellarWalletsKit only loads on the client side
export const DynamicWalletKitProvider = dynamic(
  () =>
    import("@/components/WalletKit/WalletKitContextProvider").then(
      (mod) => mod.WalletKitContextProvider,
    ),
  {
    ssr: false,
  },
);
