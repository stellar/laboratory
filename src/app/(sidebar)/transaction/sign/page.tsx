"use client";

import { useState } from "react";
import { Alert, Card, Icon, Text, Button } from "@stellar/design-system";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { validate } from "@/validate";

export default function SignTransaction() {
  const { network } = useStore();
  const [txEnv, setTxEnv] = useState<string>("");
  const [isTxValid, setIsTxValid] = useState<boolean | undefined>(undefined);
  const [txError, setTxError] = useState<string>("");

  const onChange = (value: string) => {
    setTxError("");
    setTxEnv(value);

    if (value.length > 0) {
      const validatedXDR = validate.xdr(value);

      if (validatedXDR.result === "success") {
        setIsTxValid(true);
      } else if (validatedXDR.result === "error") {
        setIsTxValid(false);
        setTxError(validatedXDR.message);
      }
    }
  };

  const onImport = () => {
    let transaction = TransactionBuilder.fromXDR(txEnv, network.passphrase);

    console.log("[onImport] transaction: ", transaction);
  };

  return (
    <div className="SignTx">
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
            error={txError}
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
          For simple transactions, you only need one signature from the correct
          account. Some advanced transactions may require more than one
          signature if there are multiple source accounts or signing keys.
        </Text>
      </Alert>
    </div>
  );
}
