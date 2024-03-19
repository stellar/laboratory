"use client";

import { useState } from "react";
import Link from "next/link";

import {
  Card,
  Icon,
  IconButton,
  Input,
  Text,
  Button,
} from "@stellar/design-system";

import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { validatePublicKey } from "@/helpers/validatePublicKey";
import { useStore } from "@/store/useStore";

import { AlertBox } from "@/components/AlertBox";

import "../styles.scss";

const callFriendBot = async ({
  network,
  publicKey,
}: {
  network: string;
  publicKey: string;
}) => {
  const friendbotURL =
    network === "futurenet"
      ? "https://friendbot-futurenet.stellar.org"
      : "https://friendbot.stellar.org";
  const response = await fetch(`${friendbotURL}/?addr=${publicKey}`);

  return response;
};

export default function FundAccount() {
  const { account, network } = useStore();

  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [generatedPublicKey, setGeneratedPublicKey] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const fundAccount = async () => {
    try {
      setIsLoading(true);
      setError("");

      const data = await callFriendBot({
        network: network.id,
        publicKey: account.publicKey,
      });

      if (!data.ok) {
        const errorBody = await data.json();

        throw new Error(errorBody.status || "An error occurred");
      }

      setIsSuccess(true);
    } catch (error: any) {
      let errorMessage = "";

      if (error.status === 0) {
        errorMessage = `Unable to reach Friendbot server at ${network.id}`;
      } else {
        errorMessage = `Failed to fund ${account.publicKey} on the ${network.id}`;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

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
            }}
            placeholder="Ex: GCEXAMPLE5HWNK4AYSTEQ4UWDKHTCKADVS2AHF3UI2ZMO3DPUSM6Q4UG"
            rightElement={<Icon.Wallet03 />}
            error={errorMessage}
          />

          <div className="Account__CTA">
            <Button
              disabled={!generatedPublicKey}
              size="md"
              variant={error ? "error" : "secondary"}
              isLoading={isLoading}
              onClick={() => {
                const error = validatePublicKey(generatedPublicKey);
                setErrorMessage(error);

                if (!error) {
                  fundAccount();
                }
              }}
            >
              Get lumens
            </Button>

            <Button
              disabled={!account.publicKey}
              size="md"
              variant="tertiary"
              onClick={() => setGeneratedPublicKey(account.publicKey)}
            >
              Fill in with generated key
            </Button>
          </div>
        </div>
      </Card>

      {isSuccess && (
        <AlertBox>
          <div className="Account__alertbox">
            <div className="Account__alertbox__icon">
              <IconButton
                altText="Info"
                icon={<Icon.InfoCircle />}
                variant="success"
              />
            </div>
            <div className="Account__alertbox__content">
              <Text
                size="md"
                as="span"
                weight="medium"
                addlClassName="Text--dark"
              >
                Successfully funded {shortenStellarAddress(account.publicKey)}{" "}
                on {network.id}
              </Text>
              <div className="Account__alertbox__CTA">
                <Text size="md" as="span" weight="semi-bold">
                  Dismiss
                </Text>
                <Text
                  size="md"
                  as="span"
                  weight="semi-bold"
                  addlClassName="Text--purple"
                >
                  <Link
                    href={`https://stellar.expert/explorer/${network.id}/account/${account.publicKey}`}
                    passHref
                    legacyBehavior
                  >
                    <a target="_blank" rel="noopener noreferrer">
                      View on stellar.expert
                    </a>
                  </Link>
                </Text>
              </div>
            </div>
          </div>
        </AlertBox>
      )}
    </div>
  );
}
