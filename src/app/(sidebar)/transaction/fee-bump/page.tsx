"use client";

import { useEffect, useState } from "react";
import { Button, Card, Icon, Text } from "@stellar/design-system";
import { get, omit, set } from "lodash";
import { useRouter } from "next/navigation";

import { FeeBumpParams } from "@/store/createStore";
import { useStore } from "@/store/useStore";

import { validate } from "@/validate";

import { sanitizeObject } from "@/helpers/sanitizeObject";
import { txHelper, FeeBumpedTxResponse } from "@/helpers/txHelper";

import { Box } from "@/components/layout/Box";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { SdsLink } from "@/components/SdsLink";
import { TxResponse } from "@/components/TxResponse";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";

import { Routes } from "@/constants/routes";
import { KeysOfUnion } from "@/types/types";

export default function FeeBumpTransaction() {
  const router = useRouter();
  const { network, transaction } = useStore();
  const {
    feeBump,
    updateFeeBumpParams,
    updateSignActiveView,
    updateSignImportXdr,
    resetBaseFee,
  } = transaction;
  const { source_account, fee, xdr } = feeBump;

  type ParamsField = KeysOfUnion<typeof feeBump>;

  type ParamsError = {
    [K in keyof FeeBumpParams]?: any;
  };

  // buildFeeBumpTransaction status result
  const [feeBumpedTx, setFeeBumpedTx] = useState<FeeBumpedTxResponse>({
    errors: [],
    xdr: "",
  });
  const [paramsError, setParamsError] = useState<ParamsError>({});

  useEffect(() => {
    Object.entries(feeBump).forEach(([key, val]) => {
      if (val) {
        handleParamsError(key, validateParam(key as ParamsField, val));
      }
    });

    // Run this only when page loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (source_account && fee && xdr) {
      handleFieldChange(source_account, fee, xdr);
    }

    // Not inlcuding handleFieldChange
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [source_account, fee, xdr]);

  const resetResult = () => {
    // reset messages onChange
    setFeeBumpedTx({
      errors: [],
      xdr: "",
    });
  };

  const validateParam = (param: ParamsField, value: any) => {
    switch (param) {
      case "source_account":
        return validate.getPublicKeyError(value);
      case "fee":
        return validate.getPositiveIntError(value);
      case "xdr":
        if (validate.getXdrError(value)?.result === "success") {
          return false;
        }
        return validate.getXdrError(value)?.message;
      default:
        return false;
    }
  };

  const getFieldLabel = (field: ParamsField) => {
    switch (field) {
      case "fee":
        return "Base Fee";
      case "source_account":
        return "Source Account";
      case "xdr":
        return "Inner Transaction";
      default:
        return "";
    }
  };

  const getMissingFieldErrors = () => {
    const allErrorMessages: string[] = [];
    const missingParams = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(feeBump).filter(([_, value]) => !value),
    );

    const missingParamsKeys = Object.keys(missingParams);

    if (missingParamsKeys.length > 0) {
      const errorMsg = missingParamsKeys.reduce((res, cur) => {
        return [
          ...res,
          `${getFieldLabel(cur as ParamsField)} is a required field`,
        ];
      }, [] as string[]);

      allErrorMessages.push(...errorMsg);
    }

    return allErrorMessages;
  };

  const handleParamsChange = <T,>(paramPath: string, value: T) => {
    updateFeeBumpParams(set({}, `${paramPath}`, value));
  };

  const handleParamsError = <T,>(id: string, error: T) => {
    if (error) {
      setParamsError(set({ ...paramsError }, id, error));
    } else if (get(paramsError, id)) {
      setParamsError(sanitizeObject(omit({ ...paramsError }, id), true));
    }
  };

  const handleFieldChange = (
    source_account: string,
    fee: string,
    xdr: string,
  ) => {
    const result = txHelper.buildFeeBumpTx({
      innerTxXdr: xdr,
      maxFee: fee,
      sourceAccount: source_account,
      networkPassphrase: network.passphrase,
    });

    if (result) {
      setFeeBumpedTx(result);
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
            resetResult();
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
            error={paramsError.source_account}
            onChange={(e) => {
              const id = "source_account";

              resetResult();

              handleParamsError(id, validateParam(id, e.target.value));
              handleParamsChange(id, e.target.value);
            }}
            note="The account responsible for paying the transaction fee."
            infoLink="https://developers.stellar.org/docs/learn/glossary#source-account"
          />

          <PositiveIntPicker
            id="fee"
            label="Base Fee"
            value={fee}
            error={paramsError.fee}
            onChange={(e) => {
              const id = "fee";

              resetResult();

              handleParamsError(id, validateParam(id, e.target.value));
              handleParamsChange(id, e.target.value);
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
            id="xdr"
            label="Input a base-64 encoded TransactionEnvelope:"
            value={xdr}
            error={paramsError.xdr}
            onChange={(e) => {
              const id = "xdr";

              resetResult();

              handleParamsError(id, validateParam(id, e.target.value));
              handleParamsChange(id, e.target.value);
            }}
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

                    router.push(Routes.SIGN_TRANSACTION);
                  }}
                >
                  Sign in Transaction Signer
                </Button>

                <ViewInXdrButton xdrBlob={feeBumpedTx.xdr} />
              </>
            }
          />
        ) : null}
      </>
      <>
        {feeBumpedTx.errors.length ? (
          <ValidationResponseCard
            variant="error"
            title="Transaction Sign Error:"
            response={feeBumpedTx.errors}
          />
        ) : null}
      </>

      <>
        {getMissingFieldErrors().length > 0 ? (
          <ValidationResponseCard
            variant="primary"
            title="Fee bump errors:"
            response={
              <ul>
                {getMissingFieldErrors().map((e, i) => (
                  <li key={`e-${i}`}>{e}</li>
                ))}
              </ul>
            }
          />
        ) : null}
      </>
    </Box>
  );
}
