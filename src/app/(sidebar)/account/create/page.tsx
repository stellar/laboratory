"use client";
import { useRouter } from "next/navigation";
import { Card, Text, Button } from "@stellar/design-system";

import { GenerateKeypair } from "@/components/GenerateKeypair";
import { Routes } from "@/constants/routes";

import "../styles.scss";

export default function CreateAccount() {
  const router = useRouter();

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
          <div className="Account__CTA">
            <GenerateKeypair />

            <Button
              size="md"
              variant="tertiary"
              onClick={() => router.push(Routes.ACCOUNT_FUND)}
            >
              Fund account with Friendbot
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
