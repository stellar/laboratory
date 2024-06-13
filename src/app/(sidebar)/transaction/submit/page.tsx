"use client";

import { useEffect, useState } from "react";
import { Button, Card, Icon, Text } from "@stellar/design-system";
import { Horizon, TransactionBuilder } from "@stellar/stellar-sdk";

import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import * as StellarXdr from "@/helpers/StellarXdr";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";

import { useSubmitTx } from "@/query/useSubmitTx";

import { Box } from "@/components/layout/Box";
import { PrettyJson } from "@/components/PrettyJson";
import { Tabs } from "@/components/Tabs";
import { XdrPicker } from "@/components/FormElements/XdrPicker";

export default function SubmitTransaction() {
  const { network, transaction } = useStore();
  const { updateXdrBlob, submit } = transaction;

  const { xdrBlob } = submit;

  const isXdrInit = useIsXdrInit();

  const [activeTab, setActiveTab] = useState<string>("json");
  // const [txXdr, setTxXdr] = useState<string>("");
  const [txErrMsg, setTxErrMsg] = useState<string>("");
  const [txSuccessMsg, setTxSuccessMsg] = useState<string>("");

  const { mutate, status } = useSubmitTx();

  // const onChange = (value: string) => {
  //   // reset messages onChange
  //   setTxErrMsg("");
  //   setTxSuccessMsg("");
  //   setTxXdr(value);

  //   updateXdrBlob(value);

  //   if (value.length > 0) {
  //     const validatedXDR = validate.xdr(value);

  //     if (validatedXDR.result === "success") {
  //       setTxSuccessMsg(validatedXDR.message);
  //     } else {
  //       setTxErrMsg(validatedXDR.message);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (isLatestTxnSuccess && latestTxn) {
  //     updateXdrBlob(latestTxn);
  //     updateXdrType("TransactionEnvelope");
  //   }
  // }, [isLatestTxnSuccess, latestTxn, updateXdrBlob, updateXdrType]);

  const onSubmit = async () => {
    console.log("onSubmit");

    try {
      const transaction = TransactionBuilder.fromXDR(
        xdrBlob,
        network.passphrase,
      );
      // console.log("tx:")
      const server = new Horizon.Server(network.horizonUrl, {
        appName: "Laboratory",
      });
      const response = mutate(transaction, server);

      console.log("response: ", response);
    } catch (e) {
      setTxErrMsg("Unable to import a transaction envelope");
    }
  };

  const xdrDecodeJson = () => {
    const xdrType = "TransactionEnvelope";

    if (!(isXdrInit && xdrBlob)) {
      return null;
    }

    try {
      const xdrJson = StellarXdr.decode(xdrType, xdrBlob);

      return {
        jsonString: xdrJson,
        error: "",
      };
    } catch (e) {
      return {
        jsonString: "",
        error: `Unable to decode input as TransactionEnvelope`,
      };
    }
  };

  const xdrJsonDecoded = xdrDecodeJson();
  const isXdrData = Boolean(xdrJsonDecoded?.jsonString);

  return (
    <Box gap="md">
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Submit Transaction
        </Text>
      </div>
      <Card>
        <div className="SignTx__xdr">
          <XdrPicker
            id="submit-tx-xdr"
            label="Input a base-64 encoded TransactionEnvelope:"
            value={xdrBlob}
            error={xdrJsonDecoded?.error || ""}
            success={txSuccessMsg}
            onChange={(e) => {
              updateXdrBlob(e.target.value);
            }}
            note="Enter a base-64 encoded XDR blob to decode."
            hasCopyButton
          />

          <div className="SignTx__CTA">
            <Button
              disabled={!xdrBlob || Boolean(xdrJsonDecoded?.error)}
              size="md"
              variant={"secondary"}
              onClick={onSubmit}
            >
              Submit transaction
            </Button>
          </div>

          <Box gap="lg" direction="row" align="center" justify="end">
            <div>
              {isXdrData ? (
                <Tabs
                  tabs={[
                    { id: "json", label: "JSON" },
                    { id: "decoded", label: "Decoded XDR" },
                  ]}
                  activeTabId={activeTab}
                  onChange={(id) => {
                    setActiveTab(id);
                  }}
                />
              ) : null}
            </div>
          </Box>
          <>
            {activeTab === "json" && xdrJsonDecoded?.jsonString ? (
              <div className="PageBody__content PageBody__scrollable">
                <PrettyJson json={JSON.parse(xdrJsonDecoded.jsonString)} />
              </div>
            ) : null}

            {activeTab === "decoded" ? (
              <div className="PageBody__content PageBody__scrollable">
                TODO: Decoded XDR
              </div>
            ) : null}
          </>
        </div>
      </Card>
    </Box>
  );
}
