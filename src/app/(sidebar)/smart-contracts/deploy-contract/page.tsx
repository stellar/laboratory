"use client";

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Alert,
  Button,
  Card,
  Notification,
  Textarea,
  Link,
} from "@stellar/design-system";
import { Address, contract, Operation } from "@stellar/stellar-sdk";
import { parse } from "lossless-json";
import { parseContractMetadata } from "@stellar-expert/contract-wasm-interface-parser";
import { JSONSchema7 } from "json-schema";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { FilePicker } from "@/components/FilePicker";
import { WalletKitContext } from "@/components/WalletKit/WalletKitContextProvider";
import { JsonSchemaRenderer } from "@/components/SmartContractJsonSchema/JsonSchemaRenderer";
import { SwitchNetworkButtons } from "@/components/SwitchNetworkButtons";

import { useStore } from "@/store/useStore";
import { useBuildRpcTransaction } from "@/query/useBuildRpcTransaction";
import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";
import { DereferencedSchemaType } from "@/constants/jsonSchema";
import { Routes } from "@/constants/routes";

import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import * as StellarXdr from "@/helpers/StellarXdr";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { delayedAction } from "@/helpers/delayedAction";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getScValsFromArgs } from "@/helpers/sorobanUtils";
import { scrollElIntoView } from "@/helpers/scrollElIntoView";

export default function DeployContract() {
  const CONSTRUCTOR_KEY = "__constructor";

  const { walletKit, network, smartContracts, txDashboard } = useStore();
  const walletKitInstance = useContext(WalletKitContext);
  const router = useRouter();

  const [currentStep, setCurrentStep] = useState(1);

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [isWalletLoading, setIsWalletLoading] = useState<boolean>(false);

  // Constructor
  const [constructorSchema, setConstructorSchema] =
    useState<DereferencedSchemaType | null>(null);
  const [constructorFormValue, setConstructorFormValue] = useState<any>({
    // We only need args here
    contract_id: "",
    function_name: "",
    args: {},
  });
  const [constructorFormError, setConstructorFormError] = useState<any>(null);
  const [isConstructorArgsFilled, setIsConstructorArgsFilled] =
    useState<boolean>(false);

  // Page-level error
  const [pageError, setPageError] = useState<string>("");

  // Upload
  const [uploadOp, setUploadOp] = useState<any>(null);
  const [signedUploadTx, setSignedUploadTx] = useState<string | null>(null);
  const [signUploadError, setSignUploadError] = useState<string | null>(null);

  // Deploy
  const [deployOp, setDeployOp] = useState<any>(null);
  const [signedDeployTx, setSignedDeployTx] = useState<string | null>(null);
  const [signDeployError, setSignDeployError] = useState<string | null>(null);

  const step1Ref = useRef<HTMLDivElement>(null as any);
  const step2Ref = useRef<HTMLDivElement>(null as any);
  const step3Ref = useRef<HTMLDivElement>(null as any);
  const step4Ref = useRef<HTMLDivElement>(null as any);
  const step5Ref = useRef<HTMLDivElement>(null as any);
  const step6Ref = useRef<HTMLDivElement>(null as any);

  let timeout: NodeJS.Timeout | null = null;
  const hasFormErrors =
    constructorFormError && Object.keys(constructorFormError).length > 0;

  const getConstructorSchema = useCallback(async (wasmFile: File) => {
    try {
      const wasmBinary = await fileToBuffer(wasmFile);
      const parsedContractData = parseContractMetadata(wasmBinary);
      const hasConstructor = Boolean(
        parsedContractData?.functions?.[CONSTRUCTOR_KEY],
      );

      if (hasConstructor) {
        const contractSpec = await contract.Spec.fromWasm(wasmBinary);
        const constructorSpec = contractSpec?.jsonSchema(CONSTRUCTOR_KEY);
        const constructorSchema = dereferenceSchema(
          constructorSpec as JSONSchema7,
          CONSTRUCTOR_KEY,
        );

        return constructorSchema ?? null;
      }

      return null;
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setPageError(`Error getting constructor schema: ${e}.`);
      return null;
    }
  }, []);

  const getStepRef = (stepNumber: number) => {
    switch (stepNumber) {
      case 1:
        return step1Ref;
      case 2:
        return step2Ref;
      case 3:
        return step3Ref;
      case 4:
        return step4Ref;
      case 5:
        return step5Ref;
      case 6:
        return step6Ref;
      default:
        return null;
    }
  };

  useIsXdrInit();

  // Queries
  const {
    data: uploadTx,
    error: uploadTxError,
    isSuccess: isUploadTxSuccess,
  } = useBuildRpcTransaction({
    publicKey: walletKit?.publicKey,
    networkPassphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
    operation: uploadOp,
  });

  const {
    mutate: submitUploadTx,
    data: submitUploadTxResponse,
    error: submitUploadTxError,
    isPending: isSubmitUploadTxPending,
    isSuccess: isSubmitUploadTxSuccess,
    reset: resetSubmitUploadTx,
  } = useSubmitRpcTx();

  const {
    data: deployTx,
    error: deployTxError,
    isSuccess: isDeployTxSuccess,
  } = useBuildRpcTransaction({
    publicKey: walletKit?.publicKey,
    networkPassphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
    operation: deployOp,
  });

  const {
    mutate: submitDeployTx,
    data: submitDeployTxResponse,
    error: submitDeployTxError,
    isPending: isSubmitDeployTxPending,
    isSuccess: isSubmitDeployTxSuccess,
    reset: resetSubmitDeployTx,
  } = useSubmitRpcTx();

  const resetAll = () => {
    setSelectedFile(undefined);
    setCurrentStep(1);
    setIsWalletLoading(false);

    setConstructorSchema(null);
    setConstructorFormValue({
      contract_id: "",
      function_name: "",
      args: {},
    });
    setConstructorFormError(null);

    setUploadOp(null);
    setSignedUploadTx(null);
    setSignUploadError(null);

    setDeployOp(null);
    setSignedDeployTx(null);
    setSignDeployError(null);

    resetSubmitUploadTx();
    resetSubmitDeployTx();
  };

  useEffect(() => {
    if (selectedFile) {
      const fn = async () => {
        const schema = await getConstructorSchema(selectedFile);
        setConstructorSchema(schema);
        // If there are no constructor arguments, set validation to true
        setIsConstructorArgsFilled(!schema);
      };

      fn();
    }
  }, [getConstructorSchema, selectedFile]);

  useEffect(() => {
    if (isUploadTxSuccess) {
      setCurrentStep(2);
    }
  }, [isUploadTxSuccess]);

  useEffect(() => {
    if (isSubmitUploadTxSuccess) {
      setCurrentStep(4);
    }
  }, [isSubmitUploadTxSuccess]);

  useEffect(() => {
    if (isDeployTxSuccess) {
      setCurrentStep(5);
    }
  }, [isDeployTxSuccess]);

  useEffect(() => {
    if (isSubmitDeployTxSuccess) {
      setCurrentStep(0);
    }
  }, [isSubmitDeployTxSuccess]);

  useEffect(() => {
    if (selectedFile && currentStep > 0) {
      const stepRef = getStepRef(currentStep);

      if (stepRef?.current) {
        scrollElIntoView(stepRef);
      }
    }

    if (currentStep === 0 && isSubmitDeployTxSuccess) {
      const stepRef = getStepRef(6);

      if (stepRef?.current) {
        scrollElIntoView(stepRef);
      }
    }
  }, [currentStep, selectedFile, isSubmitDeployTxSuccess]);

  const handleFileChange = (file?: File) => {
    resetAll();

    // Adding a slight delay to make sure the previous state was reset
    delayedAction({
      action: () => {
        setSelectedFile(file);
      },
      delay: 300,
    });
  };

  const handleNavigateToContractExplorer = (contractId: string) => {
    smartContracts.updateExplorerContractId(contractId);

    delayedAction({
      action: () => {
        router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
      },
      delay: 0,
    });
  };

  const handleNavigateToTxDashboard = (txHash: string) => {
    txDashboard.updateTransactionHash(txHash);

    delayedAction({
      action: () => {
        router.push(Routes.TRANSACTION_DASHBOARD);
      },
      delay: 0,
    });
  };

  const signTx = async (txnXdr: string, type: "upload" | "deploy") => {
    if (!(walletKitInstance && walletKit?.publicKey)) {
      return;
    }

    if (timeout) {
      clearTimeout(timeout);
    }

    setIsWalletLoading(true);

    try {
      // Add timeout to prevent endless loading when the user exits the extension
      const timeoutPromise = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          reject(new Error("Transaction signing timed out. Please try again."));
        }, 20000);
      });

      const signPromise = walletKitInstance?.walletKit?.signTransaction(
        txnXdr,
        {
          address: walletKit.publicKey,
          networkPassphrase: network.passphrase,
        },
      );

      const result = await Promise.race([signPromise, timeoutPromise]);

      if (result?.signedTxXdr && result.signedTxXdr !== "") {
        return result.signedTxXdr;
      } else {
        throw new Error("Transaction signing failed. Please try again.");
      }
    } catch (error) {
      if (type === "upload") {
        setSignUploadError(
          `Error signing "Upload Wasm" transaction: ${error}.`,
        );
      } else {
        setSignDeployError(
          `Error signing "Deploy Contract" transaction: ${error}.`,
        );
      }
    } finally {
      setIsWalletLoading(false);

      if (timeout) {
        clearTimeout(timeout);
      }
    }

    return null;
  };

  const fileToBuffer = async (file: File): Promise<Buffer> => {
    const arrayBuffer = await file.arrayBuffer();
    return Buffer.from(arrayBuffer);
  };

  const getContractId = () => {
    try {
      const xdr = submitDeployTxResponse?.result?.envelopeXdr?.toXDR("base64");

      if (StellarXdr && xdr) {
        const decodedString = StellarXdr.decode("TransactionEnvelope", xdr);
        const parsedDecoded = parse(decodedString) as any;

        return parsedDecoded?.tx?.tx?.ext?.v1?.resources?.footprint
          ?.read_write?.[0]?.contract_data?.contract;
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      return null;
    }
  };

  const isArgsFilled = (constrArgs: any) => {
    const required = constructorSchema?.required;

    if (!required || !Array.isArray(required) || !constrArgs) {
      return false;
    }

    return required.every((key) => key in constrArgs);
  };

  const getOrderedConstructorArgs = (
    formArgs: any,
    schema: DereferencedSchemaType | null,
  ) => {
    if (!schema || !schema.required || !Array.isArray(schema.required)) {
      return [];
    }

    const orderedArgValues = schema.required
      .map((paramName: string) => {
        return formArgs[paramName];
      })
      .filter(Boolean);

    return orderedArgValues.map(
      (arg) => getScValsFromArgs({ temp: arg }, [])[0],
    );
  };

  const Step = ({
    stepNumber,
    title,
    actionLabel,
    isActionDisabled,
    isActionLoading,
    onAction,
    errorMessage,
    successMessage,
    children,
  }: {
    stepNumber: number;
    title: string;
    actionLabel: string;
    isActionDisabled: boolean;
    isActionLoading?: boolean;
    onAction: () => void;
    errorMessage: React.ReactNode | undefined;
    successMessage: React.ReactNode | undefined;
    children?: React.ReactNode | null;
  }) => {
    return (
      <div ref={getStepRef(stepNumber)}>
        <Card>
          <Box gap="md" key={`step-num-${stepNumber}`}>
            <Box gap="md" addlClassName="DeployContract__step">
              <div>{`${stepNumber}. ${title}`}</div>

              {children ? <Card variant="secondary">{children}</Card> : null}

              <Button
                variant="tertiary"
                size="md"
                disabled={isActionDisabled}
                isLoading={isActionLoading}
                onClick={onAction}
              >
                {actionLabel}
              </Button>
            </Box>

            {errorMessage ? (
              <Notification title="Error" variant="error">
                {errorMessage}
              </Notification>
            ) : null}
            {successMessage ? (
              <Notification title="Success" variant="success">
                {successMessage}
              </Notification>
            ) : null}
          </Box>
        </Card>
      </div>
    );
  };

  const renderContractIdLink = () => {
    const contractId = getContractId();
    return contractId ? (
      <Link onClick={() => handleNavigateToContractExplorer(contractId)}>
        {contractId}
      </Link>
    ) : null;
  };

  const renderContent = () => {
    if (network.id === "mainnet") {
      return null;
    }

    return (
      <>
        {!walletKit?.publicKey ? (
          <Alert variant="warning" placement="inline" title="Connect wallet">
            A connected wallet is required to deploy a contract. Please connect
            your wallet to get started.
          </Alert>
        ) : null}

        <FilePicker
          onChange={handleFileChange}
          acceptedExtension={[".wasm"]}
          isDisabled={!walletKit?.publicKey}
        />

        {pageError ? (
          <Notification title="Error" variant="error" isFilled={true}>
            {pageError}
          </Notification>
        ) : null}

        {/* Step 1 */}
        <Step
          stepNumber={1}
          title={`Build the upload transaction`}
          actionLabel="Build"
          isActionDisabled={!selectedFile || currentStep !== 1}
          onAction={async () => {
            if (selectedFile) {
              const operation = Operation.uploadContractWasm({
                wasm: await fileToBuffer(selectedFile),
              });

              setUploadOp(operation);
            }
          }}
          errorMessage={
            uploadTxError
              ? `Build upload transaction error: ${uploadTxError.toString()}`
              : undefined
          }
          successMessage={
            uploadTx?.preparedXdr ? (
              <Box gap="sm">
                <div>{`Build upload transaction XDR`}</div>
                <Textarea
                  id="step-1-xdr"
                  fieldSize="md"
                  hasCopyButton={true}
                  rows={5}
                  value={uploadTx.preparedXdr}
                  readOnly={true}
                ></Textarea>
              </Box>
            ) : undefined
          }
        />

        {/* Step 2 */}
        <Step
          stepNumber={2}
          title={`Sign the upload transaction`}
          actionLabel="Sign"
          isActionDisabled={!uploadTx || currentStep !== 2}
          isActionLoading={currentStep === 2 && isWalletLoading}
          onAction={async () => {
            if (uploadTx) {
              const res = await signTx(uploadTx.preparedXdr, "upload");

              if (res) {
                setSignedUploadTx(res);
                setCurrentStep(3);
              }
            }
          }}
          errorMessage={signUploadError}
          successMessage={
            signedUploadTx ? (
              <Box gap="sm">
                <div>{`Signed upload transaction XDR`}</div>
                <Textarea
                  id="step-2-xdr"
                  fieldSize="md"
                  hasCopyButton={true}
                  rows={5}
                  value={signedUploadTx}
                  readOnly={true}
                ></Textarea>
              </Box>
            ) : undefined
          }
        />

        {/* Step 3 */}
        <Step
          stepNumber={3}
          title={`Submit the upload transaction`}
          actionLabel="Submit"
          isActionDisabled={!signedUploadTx || currentStep !== 3}
          isActionLoading={currentStep === 3 && isSubmitUploadTxPending}
          onAction={() => {
            if (signedUploadTx) {
              submitUploadTx({
                rpcUrl: network.rpcUrl,
                transactionXdr: signedUploadTx,
                networkPassphrase: network.passphrase,
                headers: getNetworkHeaders(network, "rpc"),
              });
            }
          }}
          errorMessage={
            submitUploadTxError
              ? `Submit upload transaction error: ${submitUploadTxError}`
              : undefined
          }
          successMessage={
            submitUploadTxResponse?.result?.txHash ? (
              <Box gap="sm">
                <div>{`Submitted upload transaction hash`}</div>
                <Textarea
                  id="step-3-hash"
                  fieldSize="md"
                  hasCopyButton={true}
                  rows={1}
                  value={submitUploadTxResponse.result.txHash}
                  readOnly={true}
                ></Textarea>
              </Box>
            ) : undefined
          }
        />

        {/* Step 4 */}
        <Step
          stepNumber={4}
          title={`Build the deploy transaction`}
          actionLabel="Build"
          isActionDisabled={
            !submitUploadTxResponse ||
            currentStep !== 4 ||
            hasFormErrors ||
            !isConstructorArgsFilled
          }
          onAction={async () => {
            if (
              walletKit?.publicKey &&
              submitUploadTxResponse?.result?.returnValue?.bytes()
            ) {
              const operation = Operation.createCustomContract({
                wasmHash: submitUploadTxResponse.result.returnValue.bytes(),
                address: Address.fromString(walletKit.publicKey),
                constructorArgs: getOrderedConstructorArgs(
                  constructorFormValue.args,
                  constructorSchema,
                ),
              });

              setDeployOp(operation);
            }
          }}
          errorMessage={
            deployTxError
              ? `Build deploy transaction error: ${deployTxError}`
              : undefined
          }
          successMessage={
            deployTx?.preparedXdr ? (
              <Box gap="sm">
                <div>{`Build deploy transaction XDR`}</div>
                <Textarea
                  id="step-4-xdr"
                  fieldSize="md"
                  hasCopyButton={true}
                  rows={5}
                  value={deployTx.preparedXdr}
                  readOnly={true}
                ></Textarea>
              </Box>
            ) : undefined
          }
        >
          {constructorSchema && submitUploadTxResponse ? (
            <JsonSchemaRenderer
              formError={constructorFormError}
              setFormError={setConstructorFormError}
              name={CONSTRUCTOR_KEY}
              schema={constructorSchema as JSONSchema7}
              onChange={(val) => {
                setConstructorFormValue(val);
                setIsConstructorArgsFilled(isArgsFilled(val.args));
              }}
              parsedSorobanOperation={constructorFormValue}
            />
          ) : null}
        </Step>

        {/* Step 5 */}
        <Step
          stepNumber={5}
          title={`Sign the deploy transaction`}
          actionLabel="Sign"
          isActionDisabled={!deployTx || currentStep !== 5}
          isActionLoading={currentStep === 5 && isWalletLoading}
          onAction={async () => {
            if (deployTx) {
              const res = await signTx(deployTx.preparedXdr, "deploy");

              if (res) {
                setSignedDeployTx(res);
                setCurrentStep(6);
              }
            }
          }}
          errorMessage={signDeployError}
          successMessage={
            signedDeployTx ? (
              <Box gap="sm">
                <div>{`Signed deploy transaction XDR`}</div>
                <Textarea
                  id="step-5-xdr"
                  fieldSize="md"
                  hasCopyButton={true}
                  rows={5}
                  value={signedDeployTx}
                  readOnly={true}
                ></Textarea>
              </Box>
            ) : undefined
          }
        />

        {/* Step 6 */}
        <Step
          stepNumber={6}
          title={`Submit the deploy transaction`}
          actionLabel="Submit"
          isActionDisabled={!signedDeployTx || currentStep !== 6}
          isActionLoading={currentStep === 6 && isSubmitDeployTxPending}
          onAction={() => {
            if (signedDeployTx) {
              submitDeployTx({
                rpcUrl: network.rpcUrl,
                transactionXdr: signedDeployTx,
                networkPassphrase: network.passphrase,
                headers: getNetworkHeaders(network, "rpc"),
              });
            }
          }}
          errorMessage={
            submitDeployTxError
              ? `Submit deploy transaction error: ${submitDeployTxError}`
              : undefined
          }
          successMessage={
            submitDeployTxResponse?.result?.txHash ? (
              <Box gap="sm">
                <div>
                  Submitted deploy tx hash:{" "}
                  <Link
                    onClick={() => {
                      handleNavigateToTxDashboard(
                        submitDeployTxResponse.result.txHash,
                      );
                    }}
                  >
                    {submitDeployTxResponse.result.txHash}
                  </Link>
                </div>
                <div>Contract ID: {renderContractIdLink()}</div>
              </Box>
            ) : undefined
          }
        />
      </>
    );
  };

  return (
    <Box gap="lg">
      <PageCard heading="Contract Explorer">
        <Notification title="Attention" variant="warning" isFilled={true}>
          <Box gap="md">
            This feature is experimental and available only on test networks.
            {network.id === "mainnet" ? (
              <Box gap="md" direction="row">
                <SwitchNetworkButtons
                  includedNetworks={["testnet", "futurenet", "custom"]}
                  buttonSize="md"
                  page="deploy contract"
                />
              </Box>
            ) : null}
          </Box>
        </Notification>

        {renderContent()}
      </PageCard>
    </Box>
  );
}
