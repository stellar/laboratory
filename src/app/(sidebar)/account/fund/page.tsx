"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, Input, Text, Button } from "@stellar/design-system";
import { useQueryClient } from "@tanstack/react-query";

import { useFriendBot } from "@/query/useFriendBot";
import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { SuccessMsg } from "@/components/FriendBot/SuccessMsg";
import { ErrorMsg } from "@/components/FriendBot/ErrorMsg";

import { SwitchNetwork } from "./components/SwitchNetwork";

import "../styles.scss";

export default function FundAccount() {
  const { account, network } = useStore();
  const { reset } = account;

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>("");
  const [inlineErrorMessage, setInlineErrorMessage] = useState<string>("");

  const networkRef = useRef(network);

  const {
    error,
    isError,
    isFetching,
    isLoading,
    isSuccess,
    refetch,
    isFetchedAfterMount,
  } = useFriendBot({
    network,
    publicKey: generatedPublicKey,
    key: { type: "fund" },
  });

  const queryClient = useQueryClient();

  const resetQuery = useCallback(
    () =>
      queryClient.resetQueries({
        queryKey: ["friendBot", { type: "fund" }],
      }),
    [queryClient],
  );

  const resetStates = useCallback(() => {
    reset();
    resetQuery();
  }, [reset, resetQuery]);

  useEffect(() => {
    // when switching network, reset the state
    if (networkRef.current.id !== network.id) {
      networkRef.current = network;
      resetStates();
    }
  }, [networkRef.current.id, network.id]);

  useEffect(() => {
    if (isError || isSuccess) {
      setShowAlert(true);
    }
  }, [isError, isSuccess]);

  if (network.id === "mainnet") {
    return <SwitchNetwork />;
  }
  return (
    <div className="Account">
      <Card>
        <div className="Account__card">
          <div className="CardText">
            <Text size="lg" as="h1" weight="medium">
              Friendbot: fund a {network.id} network account
            </Text>

            <Text size="sm" as="p">
              The friendbot is a horizon API endpoint that will fund an account
              with 10,000 lumens on the {network.id} network.
            </Text>
          </div>

          <Input
            id="fund-public-key-input"
            fieldSize="md"
            label="Public Key"
            value={generatedPublicKey}
            onChange={(e) => {
              setGeneratedPublicKey(e.target.value);
              const error = validate.getPublicKeyError(e.target.value);
              setInlineErrorMessage(error || "");
            }}
            placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
            error={inlineErrorMessage}
          />

          <div className="Account__CTA" data-testid="fundAccount-buttons">
            <Button
              disabled={!generatedPublicKey || Boolean(inlineErrorMessage)}
              size="md"
              variant="secondary"
              isLoading={isLoading || isFetching}
              onClick={() => {
                if (!inlineErrorMessage) {
                  refetch();
                }
              }}
            >
              Get lumens
            </Button>

            <Button
              disabled={!account.publicKey || isLoading || isFetching}
              size="md"
              variant="tertiary"
              onClick={() => {
                setInlineErrorMessage("");
                setGeneratedPublicKey(account.publicKey!);
              }}
            >
              Fill in with generated key
            </Button>
          </div>
        </div>
      </Card>

      <SuccessMsg
        isVisible={Boolean(showAlert && isFetchedAfterMount && isSuccess)}
        publicKey={generatedPublicKey}
        onClose={() => {
          setShowAlert(false);
        }}
      />

      <ErrorMsg
        isVisible={Boolean(showAlert && isFetchedAfterMount && isError)}
        errorMsg={error?.message}
        onClose={() => {
          setShowAlert(false);
        }}
      />
    </div>
  );
}
