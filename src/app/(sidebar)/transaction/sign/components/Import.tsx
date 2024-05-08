"use client";

import { useState } from "react";
import { Alert, Card, Icon, Text, Button } from "@stellar/design-system";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { XdrPicker } from "@/components/FormElements/XdrPicker";

export const Import = () => {
  const { network, transaction } = useStore();
  const { updateSignActiveView, updateSignImportXdr, updateSignImportTx } =
    transaction;
  const [txXdr, setTxXdr] = useState<string>("");
  const [txErrMsg, setTxErrMsg] = useState<string>("");
  const [txSuccessMsg, setTxSuccessMsg] = useState<string>("");

  const onChange = (value: string) => {
    setTxErrMsg("");
    setTxSuccessMsg("");
    setTxXdr(value);

    if (value.length > 0) {
      const validatedXDR = validate.xdr(value);

      if (validatedXDR.result === "success") {
        setTxSuccessMsg(validatedXDR.message);
      } else {
        setTxErrMsg(validatedXDR.message);
      }
    }
  };

  const onImport = () => {
    try {
      const transaction = TransactionBuilder.fromXDR(txXdr, network.passphrase);

      updateSignImportTx(transaction);
      updateSignImportXdr(txXdr);
      updateSignActiveView("overview");
    } catch (e) {
      setTxErrMsg("Unable to import a transaction envelope");
      updateSignActiveView("import");
    }
  };

  return (
    <div className="SignTx__Overview">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Sign Transaction
        </Text>
      </div>
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
            value={txXdr || ""}
            error={txErrMsg}
            success={
              <Text size="xs" as="span" addlClassName="success-message">
                {txSuccessMsg}
              </Text>
            }
            onChange={(e) => onChange(e.target.value)}
          />

          <div className="SignTx__CTA">
            <Button
              disabled={!txXdr || Boolean(txErrMsg)}
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
};
