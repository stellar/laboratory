"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert, Card, Text, Button } from "@stellar/design-system";
import { Keypair } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";
import { useFriendBot } from "@/query/useFriendBot";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";
import { GenerateKeypair } from "@/components/GenerateKeypair";
import { ExpandBox } from "@/components/ExpandBox";

import "../styles.scss";

export default function CreateAccount() {
  const { account, network } = useStore();
  const router = useRouter();
  const [secretKey, setSecretKey] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const IS_TESTING_NETWORK = useIsTestingNetwork();

  const { error, isError, isLoading, isSuccess, refetch, isFetchedAfterMount } =
    useFriendBot({
      network: network.id,
      publicKey: account.publicKey,
    });

  useEffect(() => {
    if (isError || isSuccess) {
      setShowAlert(true);
    }
  }, [isError, isSuccess]);

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

            {IS_TESTING_NETWORK ? (
              <Button
                size="md"
                variant="tertiary"
                onClick={() => {
                  if (account.publicKey) {
                    refetch();
                  }
                }}
              >
                Fund account with Friendbot
              </Button>
            ) : null}
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

      {showAlert && isFetchedAfterMount && isSuccess && (
        <Alert
          placement="inline"
          variant="success"
          actionLabel="View on stellar.expert"
          actionLink={`https://stellar.expert/explorer/${network.id}/account/${account.publicKey}`}
          onClose={() => {
            setShowAlert(false);
          }}
          title={`Successfully funded ${shortenStellarAddress(account.publicKey)} on 
          ${network.id}`}
        >
          {""}
        </Alert>
      )}

      {showAlert && isFetchedAfterMount && isError && (
        <Alert
          placement="inline"
          variant="error"
          onClose={() => {
            setShowAlert(false);
          }}
          title={error?.message}
        >
          {""}
        </Alert>
      )}
    </div>
  );
}
