"use client";

import { useState } from "react";
import { Alert, Card, Text, Button } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { ExpandBox } from "@/components/ExpandBox";
import { MuxedIdPicker } from "@/components/FormElements/MuxedIdPicker";
import { MuxedKeyPicker } from "@/components/FormElements/MuxedKeyPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";

import { muxedAccount } from "@/helpers/muxedAccount";

import { validate } from "@/validate";

import "../styles.scss";

export default function ParseMuxedAccount() {
  const { account } = useStore();
  const parsedMuxedAccount = account.parsedMuxedAccount;

  const [muxedAddress, setMuxedAddress] = useState<string>("");

  const [muxedFieldError, setMuxedFieldError] = useState<string | boolean>(
    false,
  );
  const [sdkError, setSdkError] = useState<string | boolean>("");

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

            <MuxedKeyPicker
              id="muxed-account-address"
              label="Muxed Account M Address"
              value={muxedAddress}
              error={muxedFieldError}
              copyButton={{
                position: "right",
              }}
              onChange={(e) => {
                setReset(true);
                setMuxedAddress(e.target.value);

                const error = validate.publicKey(e.target.value);
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
                value={account.parsedMuxedAccount.baseAddress}
                error={undefined}
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />

              <MuxedIdPicker
                id="muxed-account-id-result"
                label="Muxed Account Id"
                value={account.parsedMuxedAccount.id}
                error={false}
                readOnly={true}
                copyButton={{
                  position: "right",
                }}
              />

              <MuxedIdPicker
                id="muxed-account-address-result"
                label="Muxed Account M Address"
                value={account.parsedMuxedAccount.muxedAddress}
                error={false}
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
