"use client";

import { useState } from "react";
import { Alert } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { FilePicker } from "@/components/FilePicker";

import { useStore } from "@/store/useStore";

export default function DeployContract() {
  const { walletKit } = useStore();
  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);

  const handleChange = (file?: File) => {
    setSelectedFile(file);
  };

  console.log(">>> selectedFile: ", selectedFile);

  return (
    <Box gap="lg">
      <PageCard heading="Contract Explorer">
        {!walletKit?.publicKey ? (
          <Alert variant="warning" placement="inline" title="Connect wallet">
            A connected wallet is required to deploy a contract. Please connect
            your wallet to get started.
          </Alert>
        ) : null}

        <FilePicker
          onChange={handleChange}
          acceptedExtension={[".wasm"]}
          isDisabled={!walletKit?.publicKey}
        />
      </PageCard>
    </Box>
  );
}
