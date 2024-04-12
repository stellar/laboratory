"use client";

import { useState } from "react";
import { Alert, Card, Icon, Text, Button } from "@stellar/design-system";
import {
  TransactionBuilder,
  FeeBumpTransaction,
  Transaction,
} from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { validate } from "@/validate";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

export default function SignTransaction() {
  const { network } = useStore();
  const [txEnv, setTxEnv] = useState<string>("");
  const [isTxValid, setIsTxValid] = useState<boolean | undefined>(undefined);
  const [txErrMsg, setTxErrMsg] = useState<string>("");
  const [txSuccessMsg, setTxSuccessMsg] = useState<string>("");
  const [tx, setTx] = useState<FeeBumpTransaction | Transaction | undefined>(
    undefined,
  );
  const [isTxImported, setIsTxImported] = useState<boolean | undefined>(
    undefined,
  );

  const onChange = (value: string) => {
    setTxErrMsg("");
    setTxSuccessMsg("");
    setTxEnv(value);

    if (value.length > 0) {
      const validatedXDR = validate.xdr(value);

      if (validatedXDR.result === "success") {
        setIsTxValid(true);
        setTxSuccessMsg(validatedXDR.message);
      } else if (validatedXDR.result === "error") {
        setIsTxValid(false);
        setTxErrMsg(validatedXDR.message);
      }
    }
  };

  const onImport = () => {
    try {
      const transaction = TransactionBuilder.fromXDR(txEnv, network.passphrase);
      setIsTxImported(true);
      setTx(transaction);
    } catch (e) {
      setIsTxImported(false);
      setTxErrMsg("Unable to parse input XDR into Transaction Envelope");
    }
  };

  const rendeDefaultView = () => {
    return (
      <>
        <Card>
          <div className="SignTx__xdr">
            <XdrPicker
              id="sign-transaction-xdr"
              label={
                <Text size="xs" as="span" weight="medium">
                  Import a transaction envelope in XDR format
                  <span className="SignTx__icon">
                    <Icon.AlertCircle />
                  </span>
                </Text>
              }
              value={txEnv || ""}
              error={txErrMsg}
              note={
                <Text size="xs" as="span" addlClassName="success-message">
                  {txSuccessMsg}
                </Text>
              }
              onChange={(e) => onChange(e.target.value)}
            />

            <div className="SignTx__CTA">
              <Button
                disabled={!txEnv || !isTxValid}
                size="md"
                variant={"secondary"}
                onClick={onImport}
              >
                Import transaction
              </Button>
            </div>
          </div>
        </Card>

        <Alert
          placement="inline"
          variant="primary"
          actionLink="https://developers.stellar.org/network/horizon/resources"
          actionLabel="Read more about signatures on the developer's site"
        >
          <Text size="sm" as="p">
            The transaction signer lets you add signatures to a Stellar
            transaction. Signatures are used in the network to prove that the
            account is authorized to perform the operations in the transaction.
          </Text>
          <Text size="sm" as="p">
            For simple transactions, you only need one signature from the
            correct account. Some advanced transactions may require more than
            one signature if there are multiple source accounts or signing keys.
          </Text>
        </Alert>
      </>
    );
  };

  const renderOverviewView = () => {
    if (!tx) {
      return;
    }

    const REQUIRED_FIELDS = [
      {
        label: "Signing for",
        value: network.passphrase,
      },
      {
        label: "Transaction Envelope XDR",
        value: txEnv,
      },
      {
        label: "Transaction Hash",
        value: tx.hash().toString("hex"),
      },
    ];

    let mergedFields;

    if (tx instanceof FeeBumpTransaction) {
      mergedFields = [...REQUIRED_FIELDS, ...FEE_BUMP_TX_FIELDS(tx)];
    } else {
      mergedFields = [...REQUIRED_FIELDS, ...TX_FIELDS(tx)];
    }

    return (
      <>
        <Card>
          <div className="SignTx__FieldViewer">
            {mergedFields.map((field) => {
              const className =
                field.value.toString().length >= MIN_LENGTH_FOR_FULL_WIDTH_FIELD
                  ? "full-width"
                  : "half-width";

              if (field.label.includes("XDR")) {
                return (
                  <div className={className} key={field.label}>
                    <XdrPicker
                      readOnly
                      id={field.label}
                      label={field.label}
                      value={field.value.toString()}
                    />
                  </div>
                );
              } else {
                return (
                  <div className={className} key={field.label}>
                    <TextPicker
                      readOnly
                      id={field.label}
                      label={field.label}
                      value={field.value.toString()}
                    />
                  </div>
                );
              }
            })}
          </div>
        </Card>
      </>
    );
  };

  return (
    <div className="SignTx">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          {isTxImported ? "Transaction Overview" : "Sign Transaction"}
        </Text>
      </div>
      {isTxValid && tx ? renderOverviewView() : rendeDefaultView()}
    </div>
  );
}
