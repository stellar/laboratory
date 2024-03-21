"use client";

import { useEffect, useState } from "react";
import { Alert, Card, Input, Text, Button } from "@stellar/design-system";
import { Keypair, Account, MuxedAccount } from "stellar-sdk";

import { useFriendBot } from "@/query/useFriendBot";
import { useStore } from "@/store/useStore";

import { SdsLink } from "@/components/SdsLink";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

import { validate } from "@/validate";

import "../styles.scss";

export default function CreateMuxedAccount() {
  const { network } = useStore();

  const [generatedPublicKey, setGeneratedPublicKey] = useState<string>("");
  const [muxedId, setMuxedId] = useState<string>("");
  const [pubFieldErrorMessage, setPubFieldErrorMessage] = useState<string>("");
  const [muxedFieldErrorMessage, setMuxedFieldErrorMessage] = useState<
    string | boolean
  >("");

  const { error, isError, isLoading, isSuccess, refetch, isFetchedAfterMount } =
    useFriendBot({
      network: network.id,
      publicKey: generatedPublicKey,
    });

  return (
    <div className="Account">
      <Card>
        <div className="Account__card">
          <div className="CardText">
            <Text size="lg" as="h1" weight="medium">
              Create Multiplexed Account
            </Text>

            <Text size="sm" as="p">
              A muxed (or multiplexed) account (defined in{" "}
              <SdsLink href="https://github.com/stellar/stellar-protocol/blob/master/core/cap-0027.md">
                CAP-27
              </SdsLink>{" "}
              and briefly{" "}
              <SdsLink href="https://github.com/stellar/stellar-protocol/blob/master/ecosystem/sep-0023.md">
                SEP-23
              </SdsLink>
              ) is one that resolves a single Stellar G...account to many
              different underlying IDs.
            </Text>
          </div>

          <PubKeyPicker
            id="muxed-public-key"
            label="Base Account G Address"
            value={generatedPublicKey}
            onChange={(e) => {
              setGeneratedPublicKey(e.target.value);

              const error = validate.publicKey(e.target.value);
              setPubFieldErrorMessage(error);
            }}
            error={pubFieldErrorMessage}
          />

          <Input
            id="muxed-account-id"
            fieldSize="md"
            label="Muxed Account Id"
            value={muxedId}
            onChange={(e) => {
              setMuxedId(e.target.value);

              const error = validate.positiveInt(e.target.value);
              setMuxedFieldErrorMessage(error);
            }}
            placeholder="12345"
            error={muxedFieldErrorMessage}
          />

          <div className="Account__CTA">
            <Button
              disabled={!generatedPublicKey || Boolean(pubFieldErrorMessage)}
              size="md"
              variant={isFetchedAfterMount && isError ? "error" : "secondary"}
              isLoading={isLoading}
              onClick={() => {
                if (!pubFieldErrorMessage) {
                  refetch();
                }
              }}
            >
              Create
            </Button>
          </div>
        </div>
      </Card>

      <Alert
        placement="inline"
        variant="warning"
        title="Muxed accounts are uncommon"
      >
        Don’t use in a production environment unless you know what you’re doing.
      </Alert>
    </div>
  );
}
