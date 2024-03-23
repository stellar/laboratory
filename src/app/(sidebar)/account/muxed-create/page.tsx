"use client";

import { useState } from "react";
import { Alert, Card, Text, Button } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { ExpandBox } from "@/components/ExpandBox";
import { MuxedIdPicker } from "@/components/FormElements/MuxedIdPicker";
import { MuxedKeyPicker } from "@/components/FormElements/MuxedKeyPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { SdsLink } from "@/components/SdsLink";
import { muxedAccount } from "@/helpers/muxedAccount";

import { validate } from "@/validate";

import "../styles.scss";

export default function CreateMuxedAccount() {
  const { account } = useStore();

  const [baseAddress, setBaseAddress] = useState<string>("");
  const [muxedId, setMuxedId] = useState<string>("");

  const [baseFieldErrorMessage, setBaseFieldErrorMessage] =
    useState<string>("");
  const [muxedFieldErrorMessage, setMuxedFieldErrorMessage] = useState<
    string | false
  >("");
  const [sdkError, setSdkError] = useState<string | boolean>("");

  const [isReset, setReset] = useState<boolean>(false);

  const generateMuxedAccount = () => {
    const result = muxedAccount.generate({
      baseAddress,
      muxedAccountId: muxedId,
    });

    const { errorMessage, muxedAddress } = result;

    if (muxedAddress) {
      setReset(false);
      account.updateGeneratedMuxedAccount({
        id: muxedId,
        baseAddress,
        muxedAddress,
      });

      setSdkError("");
      return;
    }

    if (errorMessage) {
      setSdkError(errorMessage);
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
              value={baseAddress}
              onChange={(e) => {
                setReset(true);
                setBaseAddress(e.target.value);

                const error = validate.publicKey(e.target.value);
                console.log("error: ", error);
                setBaseFieldErrorMessage(error);
              }}
              error={baseFieldErrorMessage}
              copyButton={{
                position: "right",
              }}
            />

            <MuxedIdPicker
              id="muxed-account-id"
              label="Muxed Account Id"
              value={muxedId}
              onChange={(e) => {
                setReset(true);
                setMuxedId(e.target.value);

                const error = validate.positiveInt(e.target.value);
                setMuxedFieldErrorMessage(error);
              }}
              error={muxedFieldErrorMessage}
              copyButton={{
                position: "right",
              }}
            />

            <div className="Account__CTA">
              <Button
                disabled={!baseAddress || Boolean(baseFieldErrorMessage)}
                size="md"
                variant={"secondary"}
                onClick={generateMuxedAccount}
              >
                Create
              </Button>
            </div>
          </div>

          <ExpandBox
            isExpanded={
              !isReset && Boolean(account.generatedMuxedAccount.muxedAddress)
            }
          >
            <div className="Account__content__inputs">
              <PubKeyPicker
                id="muxed-public-key-result"
                label="Base Account G Address"
                value={account.generatedMuxedAccount.baseAddress}
                error={undefined}
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />

              <MuxedIdPicker
                id="muxed-account-id-result"
                label="Muxed Account Id"
                value={account.generatedMuxedAccount.id}
                error={undefined}
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />

              <MuxedKeyPicker
                id="muxed-account-address-result"
                label="Muxed Account M Address"
                value={account.generatedMuxedAccount.muxedAddress}
                error={undefined}
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
            setSdkError(false);
          }}
          title={sdkError}
        >
          {""}
        </Alert>
      )}
    </div>
  );
}
