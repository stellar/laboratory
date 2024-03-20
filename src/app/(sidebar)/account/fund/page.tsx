"use client";

import { useEffect, useState } from "react";
import { Alert, Card, Input, Text, Button } from "@stellar/design-system";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { validatePublicKey } from "@/helpers/validatePublicKey";
import { useFriendBot } from "@/query/useFriendBot";
import { useStore } from "@/store/useStore";

import "../styles.scss";

export default function FundAccount() {
  const { account, network } = useStore();

  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>("");
  const [inlineErrorMessage, setInlineErrorMessage] = useState<string>("");

  const { error, isError, isLoading, isSuccess, refetch, isFetchedAfterMount } =
    useFriendBot({
      network: network.id,
      publicKey: generatedPublicKey,
    });

  useEffect(() => {
    if (isError || isSuccess) {
      setShowAlert(true);
    }
  }, [isError, isSuccess]);

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
            id="generate-keypair-publickey"
            fieldSize="md"
            label="Public Key"
            value={generatedPublicKey}
            onChange={(e) => {
              setGeneratedPublicKey(e.target.value);

              const error = validatePublicKey(e.target.value);
              setInlineErrorMessage(error);
            }}
            placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
            error={inlineErrorMessage}
          />

          <div className="Account__CTA">
            <Button
              disabled={!generatedPublicKey || Boolean(inlineErrorMessage)}
              size="md"
              variant={isFetchedAfterMount && isError ? "error" : "secondary"}
              isLoading={isLoading}
              onClick={() => {
                if (!inlineErrorMessage) {
                  refetch();
                }
              }}
            >
              Get lumens
            </Button>

            <Button
              disabled={!account.publicKey}
              size="md"
              variant="tertiary"
              onClick={() => {
                setInlineErrorMessage("");
                setGeneratedPublicKey(account.publicKey);
              }}
            >
              Fill in with generated key
            </Button>
          </div>
        </div>
      </Card>

      {showAlert && isFetchedAfterMount && isSuccess && (
        <Alert
          placement="inline"
          variant="primary"
          actionLabel="View on stellar.expert"
          actionLink={`https://stellar.expert/explorer/${network.id}/account/${account.publicKey}`}
          onClose={() => {
            setShowAlert(false);
          }}
        >
          <Text size="md" as="span" weight="medium">
            Successfully funded {shortenStellarAddress(account.publicKey)} on{" "}
            {network.id}
          </Text>
        </Alert>
      )}
      {showAlert && isFetchedAfterMount && isError && (
        <Alert
          placement="inline"
          variant="error"
          onClose={() => {
            setShowAlert(false);
          }}
        >
          <Text size="md" as="span" weight="medium">
            {error.message}
          </Text>
        </Alert>
      )}
    </div>
  );
}
