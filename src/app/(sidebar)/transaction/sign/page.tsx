"use client";

import { useState } from "react";
import { Alert, Card, Icon, Text, Button } from "@stellar/design-system";

import { useStore } from "@/store/useStore";

import { ExpandBox } from "@/components/ExpandBox";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { MuxedAccountResult } from "@/components/MuxedAccountResult";
import { SdsLink } from "@/components/SdsLink";

import { muxedAccount } from "@/helpers/muxedAccount";

import { XdrPicker } from "@/components/FormElements/XdrPicker";

import { validate } from "@/validate";
import { collapseTextChangeRangesAcrossMultipleVersions } from "typescript";
import { unescape } from "querystring";

export default function SignTransaction() {
  const [txInput, setTxInput] = useState<string>("");
  const [isTxValid, setIsTxValid] = useState<boolean | undefined>(undefined);

  const [muxedFieldError, setMuxedFieldError] = useState<string>("");
  const [sdkError, setSdkError] = useState<string>("");

  const onChange = (value: string) => {
    setTxInput(value);

    const isValid = Boolean(validate.xdr(txInput));

    console.log("**LOG** validate.xdr(txInput): ", validate.xdr(txInput));
    console.log("**LOG** isValid: ", isValid);

    setIsTxValid(isValid);
  };

  console.log("**LOG** txInput: ", txInput);

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
            value={txInput || ""}
            error={sdkError}
            onChange={(e) => onChange(e.target.value)}
          />

          <div className="SignTx__CTA">
            <Button
              // disabled={!muxedAddress || Boolean(muxedFieldError)}
              size="md"
              variant={"secondary"}
              // onClick={parseMuxedAccount}
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
