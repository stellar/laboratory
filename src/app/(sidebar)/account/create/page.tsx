"use client";

import { useStore } from "@/store/useStore";

export default function CreateAccount() {
  const { network } = useStore();

  return (
    <div>
      Create Account
      <div>{`Current network: ${network?.id}`}</div>
    </div>
  );
}
