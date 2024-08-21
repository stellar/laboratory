"use client";

import { useState } from "react";
import { Alert, Card, Text, Button } from "@stellar/design-system";
import { TransactionBuilder } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { Box } from "@/components/layout/Box";
import { XdrPicker } from "@/components/FormElements/XdrPicker";

export const Import = () => {
  const { network, transaction } = useStore();
  const { updateSignActiveView, updateSignImportXdr, updateSignImportTx } =
    transaction;

  const [txXdr, setTxXdr] = useState<string>("");
  const [txErrMsg, setTxErrMsg] = useState<string>("");
  const [txSuccessMsg, setTxSuccessMsg] = useState<string>("");

  // on textarea onChange for 'import tx xdr'
  const onChange = (value: string) => {
    // reset messages onChange
    setTxErrMsg("");
    setTxSuccessMsg("");
    setTxXdr(value);

    if (value.length > 0) {
      const validatedXDR = validate.getXdrError(value);

      if (validatedXDR?.result && validatedXDR.message) {
        if (validatedXDR.result === "success") {
          setTxSuccessMsg(validatedXDR.message);
        } else {
          setTxErrMsg(validatedXDR.message);
        }
      }
    }
  };

  const onImport = () => {
    try {
      const transaction = TransactionBuilder.fromXDR(txXdr, network.passphrase);

      updateSignImportTx(transaction);
      updateSignImportXdr(txXdr);

      // change to 'overview' view when successfully imported
      updateSignActiveView("overview");
    } catch (e) {
      setTxErrMsg("Unable to import a transaction envelope");
      updateSignImportXdr("");
      updateSignActiveView("import");
    }
  };

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Sign Transaction
        </Text>
      </div>
      <Card>
        <div className="SignTx__xdr">
          <XdrPicker
            id="sign-tx-xdr"
            label="Import a transaction envelope in XDR format"
            value={txXdr || ""}
            error={txErrMsg}
            success={txSuccessMsg}
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
    </Box>
  );
};
