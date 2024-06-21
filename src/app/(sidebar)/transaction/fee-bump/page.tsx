"use client";

import { useState } from "react";
import { Button, Card, Icon, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { txHelper, FeeBumpedTxResponse } from "@/helpers/txHelper";

import { useRouter } from "next/navigation";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { SdsLink } from "@/components/SdsLink";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";

export default function FeeBumpTransaction() {
  const router = useRouter();
  const { network, transaction } = useStore();
  const {
    feeBump,
    updateBaseFeeSource,
    updateBaseFeeBase,
    updateBaseFeeInnerXdr,
    updateSignActiveView,
    updateSignImportXdr,
    resetBaseFee,
  } = transaction;
  const { source_account, fee, innerTxXdr } = feeBump;

  // Sign tx status related
  const [feeBumpedTx, setFeeBumpedTx] = useState<FeeBumpedTxResponse>({
    errors: [],
    xdr: "",
  });
  const [xdrError, setXdrError] = useState<string>("");
  const [sourceErrorMessage, setSourceErrorMessage] = useState<string>("");
  const [baseErrorMessage, setBaseErrorMessage] = useState<string>("");

  const onXdrChange = (value: string) => {
    // reset messages onChange
    setXdrError("");
    setFeeBumpedTx({
      errors: [],
      xdr: "",
    });

    updateBaseFeeInnerXdr(value);

    if (value.length > 0) {
      const validatedXDR = validate.xdr(value);

      if (validatedXDR?.result && validatedXDR.message) {
        if (validatedXDR.result === "success") {
          const result = txHelper.buildFeeBumpTx({
            innerTxXDR: value,
            maxFee: fee,
            sourceAccount: source_account,
            networkPassphrase: network.passphrase,
          });

          setFeeBumpedTx(result);
        } else {
          setXdrError(validatedXDR.message);
        }
      }
    }
  };

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Fee Bump
        </Text>

        <Button
          size="md"
          variant="error"
          icon={<Icon.RefreshCw01 />}
          iconPosition="right"
          onClick={() => {
            resetBaseFee();
          }}
        >
          Clear and import new
        </Button>
      </div>
      <Card>
        <Box gap="lg">
          <PubKeyPicker
            id="source_account"
            label="Source Account"
            value={source_account}
            error={sourceErrorMessage}
            onChange={(e) => {
              const error = validate.publicKey(e.target.value);
              setSourceErrorMessage(error || "");
              updateBaseFeeSource(e.target.value);
            }}
            note={<>The account responsible for paying the transaction fee.</>}
            infoLink="https://developers.stellar.org/docs/learn/glossary#source-account"
          />

          <PositiveIntPicker
            id="fee"
            label="Base Fee"
            value={fee}
            error={baseErrorMessage}
            onChange={(e) => {
              const error = validate.positiveInt(e.target.value);
              setBaseErrorMessage(error || "");
              updateBaseFeeBase(e.target.value);
            }}
            note={
              <>
                The{" "}
                <SdsLink href="https://developers.stellar.org/docs/learn/fundamentals/fees-resource-limits-metering">
                  network base fee
                </SdsLink>{" "}
                fee is currently set to 100 stroops (0.00001 lumens). Based on
                current network activity, we suggest setting it to 100 stroops.
                Final transaction fee is equal to base fee times number of
                operations in this transaction.
              </>
            }
            infoLink="https://developers.stellar.org/docs/learn/glossary#base-fee"
          />

          <XdrPicker
            id="submit-tx-xdr"
            label="Input a base-64 encoded TransactionEnvelope:"
            value={innerTxXdr}
            error={xdrError}
            onChange={(e) => onXdrChange(e.target.value)}
            note="Enter a base-64 encoded XDR blob to decode."
            hasCopyButton
          />
        </Box>
      </Card>
      <>
        {feeBumpedTx.xdr ? (
          <ValidationResponseCard
            variant="success"
            title="Success! Transaction Envelope XDR:"
            response={
              <Box gap="xs">
                <TxResponse
                  label="Network Passphrase:"
                  value={network.passphrase}
                />
                <TxResponse label="XDR:" value={feeBumpedTx.xdr} />
              </Box>
            }
            note={<></>}
            footerLeftEl={
              <>
                <Button
                  size="md"
                  variant="secondary"
                  onClick={() => {
                    updateSignImportXdr(feeBumpedTx.xdr);
                    updateSignActiveView("overview");

                    router.push("/transaction/sign");
                  }}
                >
                  Sign in Transaction Signer
                </Button>
                <Button
                  size="md"
                  variant="tertiary"
                  onClick={() => {
                    alert("TODO: handle view in xdr flow");
                  }}
                >
                  View in XDR viewer
                </Button>
              </>
            }
          />
        ) : null}
      </>
      <>
        {feeBumpedTx.errors.length && innerTxXdr ? (
          <ValidationResponseCard
            variant="error"
            title="Transaction Sign Error:"
            response={feeBumpedTx.errors}
          />
        ) : null}{" "}
      </>
    </Box>
  );
}
