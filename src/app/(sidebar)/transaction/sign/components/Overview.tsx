"use client";

import { useEffect, useState } from "react";
import {
  Card,
  Icon,
  Text,
  Button,
  Select,
  Label,
} from "@stellar/design-system";
import {
  FeeBumpTransaction,
  Transaction,
  TransactionBuilder,
  xdr,
} from "@stellar/stellar-sdk";
import { useRouter } from "next/navigation";
import { set } from "lodash";

import { FEE_BUMP_TX_FIELDS, TX_FIELDS } from "@/constants/signTransactionPage";
import { XDR_TYPE_TRANSACTION_ENVELOPE } from "@/constants/settings";
import { Routes } from "@/constants/routes";

import { useStore } from "@/store/useStore";

import { txHelper } from "@/helpers/txHelper";
import { delayedAction } from "@/helpers/delayedAction";

import { validate } from "@/validate";

import { Box } from "@/components/layout/Box";
import { MultiPicker } from "@/components/FormElements/MultiPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { WithInfoText } from "@/components/WithInfoText";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";
import { XdrPicker } from "@/components/FormElements/XdrPicker";
import { ViewInXdrButton } from "@/components/ViewInXdrButton";

import { SignWithWallet } from "./SignWithWallet";

const MIN_LENGTH_FOR_FULL_WIDTH_FIELD = 30;

type TxSignatureType =
  | "secretKey"
  | "hardwareWallet"
  | "extensionWallet"
  | "signature";

export const Overview = () => {
  const { network, transaction, xdr } = useStore();
  const {
    sign,
    updateSignActiveView,
    updateSignImportTx,
    updateSignedTx,
    updateBipPath,
    resetSign,
    updateFeeBumpParams,
  } = transaction;

  const router = useRouter();

  // Secret key
  const [secretKeyInputs, setSecretKeyInputs] = useState<string[]>([""]);
  const [secretKeySignature, setSecretKeySignature] = useState<
    xdr.DecoratedSignature[]
  >([]);
  const [secretKeySuccessMsg, setSecretKeySuccessMsg] = useState("");
  const [secretKeyErrorMsg, setSecretKeyErrorMsg] = useState("");

  // Hardware wallet
  const [hardwareSignature, setHardwareSignature] = useState<
    xdr.DecoratedSignature[]
  >([]);
  const [hardwareSuccessMsg, setHardwareSuccessMsg] = useState("");
  const [hardwareErrorMsg, setHardwareErrorMsg] = useState("");

  const [selectedHardware, setSelectedHardware] = useState("");
  const [isHardwareLoading, setIsHardwareLoading] = useState(false);
  const [bipPathErrorMsg, setBipPathErrorMsg] = useState("");

  // Extension wallet
  const [extensionSignature] = useState<xdr.DecoratedSignature[]>([]);
  const [extensionSuccessMsg] = useState("");
  const [extensionErrorMsg] = useState("");

  const [isExtensionLoading] = useState(false);

  // Sign tx with wallet extension
  const [signWithExtensionError, setSignWithExtensionError] =
    useState<string>("");
  const [, setSignWithExtensionSuccess] = useState<string>("");

  const HAS_SECRET_KEYS = secretKeyInputs.some((input) => input !== "");
  const HAS_INVALID_SECRET_KEYS = secretKeyInputs.some((input) => {
    if (input.length) {
      return validate.getSecretKeyError(input);
    }
    return false;
  });

  useEffect(() => {
    if (sign.importXdr) {
      // used to persist page data when accessed by query string
      const transaction = TransactionBuilder.fromXDR(
        sign.importXdr,
        network.passphrase,
      );

      updateSignImportTx(transaction);
    } else {
      updateSignActiveView("import");
    }
  }, [
    network.passphrase,
    sign.importXdr,
    updateSignActiveView,
    updateSignImportTx,
  ]);

  const onViewSubmitTxn = () => {
    if (sign.signedTx) {
      xdr.updateXdrBlob(sign.signedTx);
      xdr.updateXdrType(XDR_TYPE_TRANSACTION_ENVELOPE);

      delayedAction({
        action: () => {
          router.push(Routes.SUBMIT_TRANSACTION);
        },
        delay: 200,
      });
    }
  };

  const onWrapWithFeeBump = () => {
    if (sign.signedTx) {
      updateFeeBumpParams(set({}, "xdr", sign.signedTx));

      delayedAction({
        action: () => {
          router.push(Routes.FEE_BUMP_TRANSACTION);
        },
        delay: 200,
      });
    }
  };

  const handleSign = async (sigType: TxSignatureType, isClear?: boolean) => {
    // Initial state
    let secretKeySigs: xdr.DecoratedSignature[] = [];
    let hardwareSigs: xdr.DecoratedSignature[] = [];
    let extensionSigs: xdr.DecoratedSignature[] = [];
    let errorMsg = "";

    switch (sigType) {
      case "secretKey":
        // eslint-disable-next-line no-case-declarations
        const { signature: skSignature, errorMsg: skErrorMsg } =
          signSecretKey(isClear);

        secretKeySigs = skSignature;
        errorMsg = skErrorMsg;
        break;
      case "hardwareWallet":
        // eslint-disable-next-line no-case-declarations
        const { signature: hwSignature, errorMsg: hwErrorMsg } =
          await signHardwareWallet(isClear);

        hardwareSigs = hwSignature;
        errorMsg = hwErrorMsg;
        break;
      case "extensionWallet":
        extensionSigs = extensionSignature;
        break;
      case "signature":
        // TODO: handle in next PR
        break;
      default:
      // Do nothing
    }

    // If any signType has error, clear signed transaction and return
    if (errorMsg) {
      updateSignedTx("");
      return;
    }

    // Previously added signatures from other types
    if (sigType !== "secretKey" && secretKeySuccessMsg) {
      secretKeySigs = secretKeySignature;
    }

    if (sigType !== "hardwareWallet" && hardwareSuccessMsg) {
      hardwareSigs = hardwareSignature;
    }

    if (sigType !== "extensionWallet" && extensionSuccessMsg) {
      extensionSigs = extensionSignature;
    }

    const tx = TransactionBuilder.fromXDR(sign.importXdr, network.passphrase);
    const allSigs = [...secretKeySigs, ...hardwareSigs, ...extensionSigs];

    console.log(">>> secretKeySigs: ", secretKeySigs);
    console.log(">>> hardwareSigs: ", hardwareSigs);
    console.log(">>> extensionSigs: ", extensionSigs);

    console.log(">>> allSigs: ", allSigs);

    if (allSigs.length > 0) {
      tx.signatures.push(...allSigs);

      const signedTx = tx.toEnvelope().toXDR("base64");

      console.log(">>> signedTx: ", signedTx);
      console.log(">>> tx.signatures: ", tx.signatures);

      updateSignedTx(signedTx);
    } else {
      updateSignedTx("");
    }
  };

  const signSecretKey = (isClear?: boolean) => {
    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      const txSig = txHelper.secretKeySignature({
        txXdr: sign.importXdr,
        networkPassphrase: network.passphrase,
        signers: secretKeyInputs,
      });

      signature = txSig.signature;
      successMsg = txSig.successMsg || "";
      errorMsg = txSig.errorMsg || "";
    }

    setSecretKeySignature(signature);
    setSecretKeySuccessMsg(successMsg);
    setSecretKeyErrorMsg(errorMsg);

    return { signature, errorMsg };
  };

  const signHardwareWallet = async (isClear?: boolean) => {
    setIsHardwareLoading(true);

    let signature: xdr.DecoratedSignature[] = [];
    let successMsg = "";
    let errorMsg = "";

    if (!isClear) {
      try {
        if (selectedHardware === "ledger") {
          const { signature: ledgerSig, error } = await txHelper.signWithLedger(
            {
              bipPath: sign.bipPath,
              transaction: sign.importTx as FeeBumpTransaction | Transaction,
              isHash: false,
            },
          );

          signature = ledgerSig ?? [];
          errorMsg = error || "";
        }

        if (selectedHardware === "ledger_hash") {
          const { signature: ledgerSig, error } = await txHelper.signWithLedger(
            {
              bipPath: sign.bipPath,
              transaction: sign.importTx as FeeBumpTransaction | Transaction,
              isHash: true,
            },
          );

          signature = ledgerSig ?? [];
          errorMsg = error || "";
        }

        if (selectedHardware === "trezor") {
          const path = `m/${sign.bipPath}`;

          const { signature: trezorSig, error } = await txHelper.signWithTrezor(
            {
              bipPath: path,
              transaction: sign.importTx as Transaction,
            },
          );

          signature = trezorSig ?? [];
          errorMsg = error || "";
        }

        successMsg = errorMsg
          ? ""
          : "Successfully added a hardware wallet signature";
      } catch (err) {
        errorMsg = `An unexpected error occurred: ${err}`;
      }
    }

    setIsHardwareLoading(false);
    setHardwareSignature(signature);
    setHardwareSuccessMsg(successMsg);
    setHardwareErrorMsg(errorMsg);

    return { signature, errorMsg };
  };

  // const signExtensionWallet = (isClear?: boolean) => {
  //   setIsExtensionLoading(true);

  //   let signature: xdr.DecoratedSignature[] = [];
  //   let successMsg = "";
  //   let errorMsg = "";

  //   if (!isClear) {
  //     // TODO:
  //   }

  //   setIsExtensionLoading(false);
  //   setExtensionSignature(signature);
  //   setExtensionSuccessMsg(successMsg);
  //   setExtensionErrorMsg(errorMsg);

  //   return { signature, errorMsg };
  // }

  const REQUIRED_FIELDS = [
    {
      label: "Signing for",
      value: network.passphrase,
    },
    {
      label: "Transaction Envelope XDR",
      value: sign.importXdr,
    },
    {
      label: "Transaction Hash",
      value: sign.importTx?.hash().toString("hex"),
    },
  ];

  let mergedFields;

  if (sign.importTx instanceof FeeBumpTransaction) {
    mergedFields = [...REQUIRED_FIELDS, ...FEE_BUMP_TX_FIELDS(sign.importTx)];
  } else if (sign.importTx) {
    mergedFields = [...REQUIRED_FIELDS, ...TX_FIELDS(sign.importTx)];
  }

  const MessageField = ({
    message,
    isError,
  }: {
    message: string;
    isError?: boolean;
  }) => {
    return (
      <Box
        gap="xs"
        addlClassName={`SignTx__note FieldNote FieldNote--${isError ? "error" : "success"}`}
        direction="row"
        align="center"
      >
        <span>{message}</span>
        {isError ? <Icon.XCircle /> : <Icon.CheckCircle />}
      </Box>
    );
  };

  const SignTxButton = ({
    label = "Sign transaction",
    onSign,
    onClear,
    isDisabled,
    isLoading,
    successMsg,
    errorMsg,
  }: {
    label?: string;
    onSign: () => void;
    onClear: () => void;
    isDisabled?: boolean;
    isLoading?: boolean;
    successMsg: string;
    errorMsg: string;
  }) => {
    return (
      <Box gap="md" direction="row" align="center" wrap="wrap">
        {successMsg ? (
          <Button size="md" variant="tertiary" onClick={onClear}>
            Clear signature
          </Button>
        ) : (
          <Button
            disabled={isDisabled}
            size="md"
            variant="tertiary"
            onClick={onSign}
            isLoading={isLoading}
          >
            {label}
          </Button>
        )}

        <>
          {successMsg || errorMsg ? (
            <MessageField
              message={successMsg || errorMsg}
              isError={Boolean(errorMsg)}
            />
          ) : null}
        </>
      </Box>
    );
  };

  return (
    <>
      <Box gap="md">
        <div className="PageHeader">
          <Text size="md" as="h1" weight="medium">
            Transaction Overview
          </Text>

          <Button
            size="md"
            variant="error"
            icon={<Icon.RefreshCw01 />}
            iconPosition="right"
            onClick={() => {
              resetSign();
            }}
          >
            Clear and import new
          </Button>
        </div>

        <Card>
          <div className="SignTx__FieldViewer">
            {mergedFields?.map((field) => {
              const className =
                field.value &&
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
                      value={field.value ? field.value.toString() : ""}
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
                      value={field.value ? field.value.toString() : ""}
                      copyButton={{
                        position: "right",
                      }}
                    />
                  </div>
                );
              }
            })}
          </div>
        </Card>
      </Box>

      <div className="SignTx__Signs">
        <div className="PageHeader">
          <WithInfoText href="https://developers.stellar.org/docs/learn/encyclopedia/signatures-multisig">
            <Text size="md" as="h1" weight="medium">
              Signatures
            </Text>
          </WithInfoText>
        </div>

        <Card>
          <Box gap="lg">
            <Box gap="md" addlClassName="PageBody__content">
              <MultiPicker
                id="signer"
                label="Sign with secret key"
                value={secretKeyInputs}
                onChange={(val) => {
                  if (secretKeySuccessMsg || secretKeyErrorMsg) {
                    handleSign("secretKey", true);
                  }

                  setSecretKeyInputs(val);
                }}
                validate={validate.getSecretKeyError}
                placeholder="Secret key (starting with S) or hash preimage (in hex)"
                autocomplete="off"
                useAutoAdd
                note="Paste a secret key to add an additional signer"
              />
              <SignTxButton
                onSign={() => {
                  handleSign("secretKey", false);
                }}
                onClear={() => {
                  handleSign("secretKey", true);
                }}
                isDisabled={!HAS_SECRET_KEYS || HAS_INVALID_SECRET_KEYS}
                successMsg={secretKeySuccessMsg}
                errorMsg={secretKeyErrorMsg}
              />
            </Box>

            <Box gap="md" addlClassName="PageBody__content">
              <Box gap="sm" direction="row">
                <TextPicker
                  id="bip-path"
                  label="Sign with hardware wallet"
                  placeholder="BIP path in format: 44'/148'/0'"
                  onChange={(e) => {
                    updateBipPath(e.target.value);

                    const error = validate.getBipPathError(e.target.value);

                    if (error) {
                      setBipPathErrorMsg(error);
                    } else {
                      setBipPathErrorMsg("");
                    }
                  }}
                  error={bipPathErrorMsg}
                  value={sign.bipPath}
                  note="Note: Trezor devices require upper time bounds to be set (non-zero), otherwise the signature will not be verified"
                  rightElement={
                    <>
                      <div className="InputSideElement InputSideElement--right SignTx__hardwareDropdown">
                        <Select
                          fieldSize="md"
                          id="hardware-wallet-select"
                          onChange={(
                            event: React.ChangeEvent<HTMLSelectElement>,
                          ) => {
                            if (hardwareSuccessMsg || hardwareErrorMsg) {
                              handleSign("hardwareWallet", true);
                            }

                            setSelectedHardware(event.target.value);
                          }}
                        >
                          <option value="">Select operation type</option>
                          <option value="ledger">Ledger</option>
                          <option value="ledger_hash">Hash with Ledger</option>
                          <option value="trezor">Trezor</option>
                        </Select>
                      </div>
                    </>
                  }
                />
              </Box>

              <SignTxButton
                onSign={() => {
                  handleSign("hardwareWallet", false);
                }}
                onClear={() => {
                  handleSign("hardwareWallet", true);
                }}
                isLoading={isHardwareLoading}
                isDisabled={!selectedHardware || !sign.bipPath}
                successMsg={hardwareSuccessMsg}
                errorMsg={hardwareErrorMsg}
              />
            </Box>

            <Box gap="md" addlClassName="PageBody__content">
              <Label size="md" htmlFor="">
                Sign with wallet extension
              </Label>

              <SignTxButton
                onSign={() => {
                  handleSign("extensionWallet", false);
                }}
                onClear={() => {
                  handleSign("extensionWallet", true);
                }}
                isLoading={isExtensionLoading}
                successMsg={extensionSuccessMsg}
                errorMsg={extensionErrorMsg}
              />
              <div className="SignTx__Buttons">
                <div>
                  {/* TODO: update this to get the last signature after tx signed with wallet */}
                  <SignWithWallet
                    setSignError={setSignWithExtensionError}
                    setSignSuccess={setSignWithExtensionSuccess}
                  />
                </div>
              </div>
              <div>
                {signWithExtensionError ? (
                  <Text
                    as="div"
                    size="xs"
                    weight="regular"
                    addlClassName="FieldNote--error"
                  >
                    {signWithExtensionError}
                  </Text>
                ) : null}
              </div>
            </Box>
          </Box>
        </Card>

        {sign.signedTx &&
        !(secretKeyErrorMsg || hardwareErrorMsg || extensionErrorMsg) ? (
          <ValidationResponseCard
            variant="success"
            title="Transaction signed!"
            // TODO: handle total signatures message
            subtitle={""}
            response={
              <Box gap="xs">
                <div>
                  <div>{sign.signedTx}</div>
                </div>
              </Box>
            }
            note={
              <>
                Now that this transaction is signed, you can submit it to the
                network. Horizon provides an endpoint called Post Transaction
                that will relay your transaction to the network and inform you
                of the result.
              </>
            }
            footerLeftEl={
              <Button size="md" variant="secondary" onClick={onViewSubmitTxn}>
                Submit in Transaction Submitter
              </Button>
            }
            footerRightEl={
              <div className="SignTx__Buttons">
                <ViewInXdrButton xdrBlob={sign.signedTx} />

                <Button
                  size="md"
                  variant="tertiary"
                  onClick={onWrapWithFeeBump}
                >
                  Wrap with Fee Bump
                </Button>
              </div>
            }
          />
        ) : null}

        {secretKeyErrorMsg || hardwareErrorMsg || extensionErrorMsg ? (
          <ValidationResponseCard
            variant="error"
            title="Transaction Sign Error:"
            response={
              secretKeyErrorMsg || hardwareErrorMsg || extensionErrorMsg
            }
          />
        ) : null}
      </div>
    </>
  );
};
