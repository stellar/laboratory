"use client";

import { Box } from "@/components/layout/Box";
import { Tabs } from "@/components/Tabs";

import { ImportFlow } from "./components/ImportFlow";

import "../build/styles.scss";

export default function ImportTransaction() {
  return (
    <Box gap="xxl">
      <div className="BuildTransaction__tabs">
        <Tabs
          tabs={[
            {
              id: "new-transaction",
              label: "Build transaction",
              href: "/transaction/build",
            },
            {
              id: "import-xdr",
              label: "Import transaction XDR",
              href: "/transaction/import",
            },
          ]}
          addlClassName="Tabs--gap-md"
        />
      </div>

      <ImportFlow />
    </Box>
  );
}
