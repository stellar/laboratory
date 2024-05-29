"use client";

import { useStore } from "@/store/useStore";

import { Import } from "./components/Import";
import { Overview } from "./components/Overview";

export default function SignTransaction() {
  const { transaction } = useStore();
  const { sign } = transaction;

  return (
    <div className="SignTx">
      {sign.activeView === "overview" ? <Overview /> : <Import />}
    </div>
  );
}
