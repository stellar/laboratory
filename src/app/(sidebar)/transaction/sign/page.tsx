"use client";

import { SignTxActiveView } from "@/store/createStore";
import { useStore } from "@/store/useStore";

import { Import } from "./components/Import";
import { Overview } from "./components/Overview";

export default function SignTransaction() {
  const { transaction } = useStore();
  const { sign } = transaction;

  return (
    <div className="SignTx">
      {sign.activeView === SignTxActiveView.overview ? (
        <Overview />
      ) : (
        <Import />
      )}
    </div>
  );
}
