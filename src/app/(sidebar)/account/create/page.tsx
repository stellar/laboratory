"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Card, Text, Button } from "@stellar/design-system";
import { Keypair } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";
import { useFriendBot } from "@/query/useFriendBot";
import { useQueryClient } from "@tanstack/react-query";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";

import { GenerateKeypair } from "@/components/GenerateKeypair";
import { ExpandBox } from "@/components/ExpandBox";

import "../styles.scss";

export default function CreateAccount() {
  const { account, network } = useStore();
  const [secretKey, setSecretKey] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const IS_TESTING_NETWORK = useIsTestingNetwork();
  const IS_CUSTOM_NETWORK_WITH_HORIZON =
    network.id === "custom" && network.horizonUrl;

  const resetQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["friendBot"],
      }),
    [queryClient],
  );

  const resetStates = useCallback(() => {
    account.reset();
    resetQuery();
  }, [resetQuery]);

  const { error, isError, isLoading, isSuccess, refetch, isFetchedAfterMount } =
    useFriendBot({
      network,
      publicKey: account.publicKey!,
    });

  useEffect(() => {
    if (isError || isSuccess) {
      setShowAlert(true);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (
      account.registeredNetwork?.id &&
      account.registeredNetwork.id !== network.id
    ) {
      resetStates();
      setShowAlert(false);
    }
  }, [account.registeredNetwork, network.id]);

  const generateKeypair = () => {
    const keypair = Keypair.random();

    if (IS_TESTING_NETWORK) {
      account.updateKeypair(keypair.publicKey(), keypair.secret());
    } else {
      account.updateKeypair(keypair.publicKey());
    }

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

            {IS_TESTING_NETWORK || IS_CUSTOM_NETWORK_WITH_HORIZON ? (
              <Button
                size="md"
                disabled={!account.publicKey || isLoading}
                variant="tertiary"
                onClick={() => refetch()}
                data-testid="fundAccount-button"
              >
                Fund account with Friendbot
              </Button>
            ) : null}
          </div>

          {Boolean(account.publicKey) && (
            <ExpandBox isExpanded={Boolean(account.publicKey)} offsetTop="xl">
              <div className="Account__result">
                <GenerateKeypair
                  publicKey={account.publicKey}
                  secretKey={IS_TESTING_NETWORK ? account.secretKey : secretKey}
                />
              </div>
            </ExpandBox>
          )}
        </div>
      </Card>

      {showAlert && isFetchedAfterMount && isSuccess && account.publicKey && (
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
