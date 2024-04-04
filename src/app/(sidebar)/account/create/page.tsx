"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, Text, Button } from "@stellar/design-system";
import { Keypair } from "@stellar/stellar-sdk";

import { Routes } from "@/constants/routes";
import { useStore } from "@/store/useStore";
import { GenerateKeypair } from "@/components/GenerateKeypair";
import { ExpandBox } from "@/components/ExpandBox";

import "../styles.scss";

export default function CreateAccount() {
  const { account } = useStore();
  const router = useRouter();
  const [secretKey, setSecretKey] = useState("");

  const generateKeypair = () => {
    const keypair = Keypair.random();

    account.updatePublicKey(keypair.publicKey());
    setSecretKey(keypair.secret());
  };

  return (
    <div className="Account">
      <Card>
        <div className="Account__card">
          <div className="CardText">
            <Text size="lg" as="h1" weight="medium">
              Keypair Generator
            </Text>

            <Text size="sm" as="p">
              These keypairs can be used on the Stellar network where one is
              required. For example, it can be used as an account master key,
              account signer, and/or as a stellar-core node key.
            </Text>
          </div>
          <div className="Account__CTA" data-testid="createAccount-buttons">
            <Button size="md" variant="secondary" onClick={generateKeypair}>
              Generate keypair
            </Button>

            <Button
              size="md"
              variant="tertiary"
              onClick={() => router.push(Routes.ACCOUNT_FUND)}
            >
              Fund account with Friendbot
            </Button>
          </div>

          <ExpandBox isExpanded={Boolean(account.publicKey)} offsetTop="xl">
            <div className="Account__result">
              <GenerateKeypair
                publicKey={account.publicKey}
                secretKey={secretKey}
              />
            </div>
          </ExpandBox>
        </div>
      </Card>
    </div>
  );
}
