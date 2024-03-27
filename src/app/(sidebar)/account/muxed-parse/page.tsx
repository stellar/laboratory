"use client";

import { useState } from "react";
import { Alert, Card, Input, Text, Button } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { ExpandBox } from "@/components/ExpandBox";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

import { muxedAccount } from "@/helpers/muxedAccount";

import { validate } from "@/validate";

import "../styles.scss";

export default function ParseMuxedAccount() {
  const { account } = useStore();
  const parsedMuxedAccount = account.parsedMuxedAccount;

  const [muxedAddress, setMuxedAddress] = useState<string>("");

  const [muxedFieldError, setMuxedFieldError] = useState<string>("");
  const [sdkError, setSdkError] = useState<string>("");

  const [isReset, setReset] = useState<boolean>(false);

  const parseMuxedAccount = () => {
    const result = muxedAccount.parse({
      muxedAddress,
    });

    const { error, id, baseAddress } = result;

    if (baseAddress && id) {
      setReset(false);
      account.updateParsedMuxedAccount({
        id,
        baseAddress,
        muxedAddress,
      });

      setSdkError("");
      return;
    }

    if (error) {
      setSdkError(error);
      return;
    }
  };

  return (
    <div className="Account">
      <Card>
        <div className="Account__content">
          <div className="Account__card">
            <div className="CardText">
              <Text size="lg" as="h1" weight="medium">
                Get Muxed Account from M address
              </Text>
            </div>

            <PubKeyPicker
              id="muxed-account-address"
              label="Muxed Account M Address"
              placeholder="Ex: MBRWSVNURRYVIYSWLRFQ5AAAUWPKOZZNZVVVIXHFGUSGIRVKLVIDYAAAAAAAAAAD5GJ4U"
              value={muxedAddress}
              error={muxedFieldError}
              copyButton={{
                position: "right",
              }}
              onChange={(e) => {
                setReset(true);
                setMuxedAddress(e.target.value);

                let error = "";

                if (e.target.value.startsWith("G")) {
                  error = "Muxed account address should start with M";
                } else {
                  error = validate.publicKey(e.target.value) || "";
                }

                setMuxedFieldError(error);
              }}
            />

            <div className="Account__CTA">
              <Button
                disabled={!muxedAddress || Boolean(muxedFieldError)}
                size="md"
                variant={"secondary"}
                onClick={parseMuxedAccount}
              >
                Parse
              </Button>
            </div>
          </div>

          <ExpandBox
            isExpanded={
              !isReset &&
              Boolean(
                parsedMuxedAccount.baseAddress &&
                  parsedMuxedAccount.id &&
                  parsedMuxedAccount.muxedAddress,
              )
            }
          >
            <div className="Account__content__inputs">
              <PubKeyPicker
                id="muxed-public-key-result"
                label="Base Account G Address"
                value={account.parsedMuxedAccount.baseAddress || ""}
                error=""
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />

              <Input
                id="muxed-account-id-result"
                fieldSize="md"
                label="Muxed Account Id"
                placeholder="Ex: 1"
                value={account.parsedMuxedAccount.id}
                error=""
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />

              <Input
                id="muxed-account-address-result"
                fieldSize="md"
                label="Muxed Account M Address"
                value={account.parsedMuxedAccount.muxedAddress}
                error=""
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />
            </div>
          </ExpandBox>
        </div>
      </Card>

      <Alert
        placement="inline"
        variant="warning"
        title="Muxed accounts are uncommon"
      >
        Don’t use in a production environment unless you know what you’re doing.
      </Alert>

      {Boolean(sdkError) && (
        <Alert
          placement="inline"
          variant="error"
          onClose={() => {
            setSdkError("");
          }}
          title={sdkError}
        >
          {""}
        </Alert>
      )}
    </div>
  );
}
