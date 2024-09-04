"use client";

import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";
import { Loader } from "@stellar/design-system";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CliSignTransaction() {
  const { network, transaction } = useStore();
  const { sign } = transaction;
  const router = useRouter();
  useEffect(() => {
    router.push(Routes.SIGN_TRANSACTION);
  }, [sign.importXdr, network, router]);

  return <Loader />;
}
