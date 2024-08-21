"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Text, Button } from "@stellar/design-system";
import { Keypair } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";
import { useFriendBot } from "@/query/useFriendBot";
import { useQueryClient } from "@tanstack/react-query";

import { useIsTestingNetwork } from "@/hooks/useIsTestingNetwork";

import { GenerateKeypair } from "@/components/GenerateKeypair";
import { ExpandBox } from "@/components/ExpandBox";
import { SuccessMsg } from "@/components/FriendBot/SuccessMsg";
import { ErrorMsg } from "@/components/FriendBot/ErrorMsg";

import "../styles.scss";

export default function CreateAccount() {
  const { account, network } = useStore();
  const { reset } = account;

  const [secretKey, setSecretKey] = useState("");
  const [showAlert, setShowAlert] = useState<boolean>(false);

  const queryClient = useQueryClient();
  const IS_TESTING_NETWORK = useIsTestingNetwork();
  const IS_CUSTOM_NETWORK_WITH_HORIZON =
    network.id === "custom" && network.horizonUrl;

  const networkRef = useRef(network);

  const resetQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["friendBot", { type: "create" }],
      }),
    [queryClient],
  );

  const resetStates = useCallback(() => {
    reset();
    resetQuery();
  }, [reset, resetQuery]);

  const { error, isError, isFetching, isLoading, isSuccess, refetch } =
    useFriendBot({
      network,
      publicKey: account.publicKey!,
      key: { type: "create" },
    });

  useEffect(() => {
    if (isError || isSuccess) {
      setShowAlert(true);
    }
  }, [isError, isSuccess]);

  useEffect(() => {
    if (networkRef.current.id !== network.id) {
      networkRef.current = network;
      resetStates();
    }
  }, [networkRef.current.id, network.id]);

  const generateKeypair = () => {
    resetStates();

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
            <Button
              disabled={isLoading || isFetching}
              size="md"
              variant="secondary"
              onClick={generateKeypair}
            >
              Generate keypair
            </Button>

            {IS_TESTING_NETWORK || IS_CUSTOM_NETWORK_WITH_HORIZON ? (
              <Button
                size="md"
                disabled={!account.publicKey || isLoading}
                variant="tertiary"
                isLoading={isLoading || isFetching}
                onClick={() => {
                  resetQuery();
                  refetch();
                }}
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

      <SuccessMsg
        publicKey={account.publicKey!}
        isVisible={Boolean(showAlert && isSuccess && account.publicKey)}
        onClose={() => {
          setShowAlert(false);
        }}
      />

      <ErrorMsg
        isVisible={Boolean(showAlert && isError)}
        errorMsg={error?.message}
        onClose={() => {
          setShowAlert(false);
        }}
      />
    </div>
  );
}
