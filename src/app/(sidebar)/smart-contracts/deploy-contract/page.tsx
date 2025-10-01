"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Button,
  Card,
  Notification,
  Link,
  Icon,
  Text,
} from "@stellar/design-system";
import { Address, contract, Operation } from "@stellar/stellar-sdk";
import { parseContractMetadata } from "@stellar-expert/contract-wasm-interface-parser";
import { parse } from "lossless-json";
import { JSONSchema7 } from "json-schema";
import { useQueryClient } from "@tanstack/react-query";

import { Box } from "@/components/layout/Box";
import { PageCard } from "@/components/layout/PageCard";
import { FilePicker } from "@/components/FilePicker";
import { JsonSchemaRenderer } from "@/components/SmartContractJsonSchema/JsonSchemaRenderer";
import { SourceAccountPicker } from "@/components/SourceAccountPicker";
import { ExpandBox } from "@/components/ExpandBox";
import { SignTransactionXdr } from "@/components/SignTransactionXdr";
import { TransactionSuccessCard } from "@/components/TransactionSuccessCard";
import { RpcErrorResponse } from "@/components/TxErrorResponse";
import { SdsLink } from "@/components/SdsLink";

import { useStore } from "@/store/useStore";
import { useBuildRpcTransaction } from "@/query/useBuildRpcTransaction";
import { useSubmitRpcTx } from "@/query/useSubmitRpcTx";
import { DereferencedSchemaType } from "@/constants/jsonSchema";
import { Routes } from "@/constants/routes";
import { useIsXdrInit } from "@/hooks/useIsXdrInit";
import { validate } from "@/validate";

import * as StellarXdr from "@/helpers/StellarXdr";
import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { delayedAction } from "@/helpers/delayedAction";
import { dereferenceSchema } from "@/helpers/dereferenceSchema";
import { getScValsFromArgs } from "@/helpers/sorobanUtils";
import { stellarExpertTransactionLink } from "@/helpers/stellarExpertTransactionLink";
import { stellarExpertAccountLink } from "@/helpers/stellarExpertAccountLink";

import { NetworkType } from "@/types/types";

// TODO: handle futurenet
export default function DeployContract() {
  const CONSTRUCTOR_KEY = "__constructor";

  const { network, smartContracts, addFloatNotification } = useStore();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [sourceAccount, setSourceAccount] = useState("");
  const [sourceAccountError, setSourceAccountError] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | undefined>(undefined);
  const [resetFilePicker, setResetFilePicker] = useState(0);

  // Constructor
  const [parsedContractData, setParsedContractData] = useState<any>(null);
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
  const [signTxResetKey, setSignTxResetKey] = useState(0);

  // Upload
  const [uploadOp, setUploadOp] = useState<any>(null);
  const [signedUploadTx, setSignedUploadTx] = useState<string | null>(null);
  const [signUploadError, setSignUploadError] = useState<string | null>(null);
  const [signUploadSuccess, setSignUploadSuccess] = useState<string | null>(
    null,
  );
  const [isUploadExpanded, setIsUploadExpanded] = useState<boolean>(true);

  // Deploy
  const [deployOp, setDeployOp] = useState<any>(null);
  const [signedDeployTx, setSignedDeployTx] = useState<string | null>(null);
  const [signDeployError, setSignDeployError] = useState<string | null>(null);
  const [signDeploySuccess, setSignDeploySuccess] = useState<string | null>(
    null,
  );
  const [isDeployExpanded, setIsDeployExpanded] = useState<boolean>(false);

  const hasFormErrors =
    constructorFormError && Object.keys(constructorFormError).length > 0;

  const getConstructorSchema = useCallback(async (wasmFile: File) => {
    try {
      const wasmBinary = await fileToBuffer(wasmFile);
      const parsedData = parseContractMetadata(wasmBinary);

      setParsedContractData(parsedData);

      const hasConstructor = Boolean(parsedData?.functions?.[CONSTRUCTOR_KEY]);

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

  useIsXdrInit();

  // ===========================================================================
  // Queries
  // ===========================================================================
  const {
    data: uploadTx,
    error: uploadTxError,
    isLoading: isUploadTxLoading,
    isFetching: isUploadTxFetching,
    isSuccess: isUploadTxSuccess,
  } = useBuildRpcTransaction({
    publicKey: sourceAccount,
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
    isLoading: isDeployTxLoading,
    isFetching: isDeployTxFetching,
    isSuccess: isDeployTxSuccess,
  } = useBuildRpcTransaction({
    publicKey: sourceAccount,
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

  const resetContractState = () => {
    setSelectedFile(undefined);

    setParsedContractData(null);
    setConstructorSchema(null);
    setConstructorFormValue({
      contract_id: "",
      function_name: "",
      args: {},
    });
    setConstructorFormError(null);
    setIsConstructorArgsFilled(false);

    setPageError("");

    setUploadOp(null);
    setSignedUploadTx(null);
    setSignUploadError(null);
    setSignUploadSuccess(null);
    setIsUploadExpanded(true);

    setDeployOp(null);
    setSignedDeployTx(null);
    setSignDeployError(null);
    setSignDeploySuccess(null);
    setIsDeployExpanded(false);

    queryClient.resetQueries({
      queryKey: ["buildRpcTransaction"],
    });

    resetSubmitUploadTx();
    resetSubmitDeployTx();

    setSignTxResetKey((prev) => prev + 1);
  };

  const resetSourceAccount = () => {
    setSourceAccount("");
    setSourceAccountError("");
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

  // ===========================================================================
  // Upload effects
  // ===========================================================================

  // Show float notification on upload tx created success
  useEffect(() => {
    if (isUploadTxSuccess) {
      addFloatNotification({
        id: "upload-build-tx-success",
        title: "Upload transaction created",
        description:
          "Upload transaction was created successfully. You can sign it next.",
        type: "success",
      });
    }
  }, [addFloatNotification, isUploadTxSuccess]);

  // Show float notification when upload tx is signed
  useEffect(() => {
    if (signUploadSuccess) {
      addFloatNotification({
        id: "upload-sign-tx-success",
        title: "Upload transaction signed",
        description: `${signUploadSuccess}. You can submit it to the network next.`,
        type: "success",
      });
    }
  }, [addFloatNotification, signUploadSuccess]);

  // Show float notification when upload tx is submitted
  useEffect(() => {
    if (isSubmitUploadTxSuccess) {
      addFloatNotification({
        id: "upload-submit-tx-success",
        title: "Contract uploaded to the network",
        description: `${selectedFile?.name} file has been uploaded successfully.`,
        type: "success",
      });

      // Collapse the upload block on success
      delayedAction({
        action: () => {
          setIsUploadExpanded(false);
          setIsDeployExpanded(true);
        },
        delay: 300,
      });
    }
  }, [addFloatNotification, isSubmitUploadTxSuccess, selectedFile?.name]);

  // ===========================================================================
  // Deploy effects
  // ===========================================================================

  // Show float notification on deploy tx created success
  useEffect(() => {
    if (isDeployTxSuccess) {
      addFloatNotification({
        id: "deploy-build-tx-success",
        title: "Deploy transaction created",
        description:
          "Deploy transaction was created successfully. You can sign it next.",
        type: "success",
      });
    }
  }, [addFloatNotification, isDeployTxSuccess]);

  // Show float notification when deploy tx is signed
  useEffect(() => {
    if (signDeploySuccess) {
      addFloatNotification({
        id: "deploy-sign-tx-success",
        title: "Deploy transaction signed",
        description: `${signDeploySuccess}. You can submit it to the network next.`,
        type: "success",
      });
    }
  }, [addFloatNotification, signDeploySuccess]);

  // Show float notification when deploy tx is submitted
  useEffect(() => {
    if (isSubmitDeployTxSuccess) {
      addFloatNotification({
        id: "deploy-submit-tx-success",
        title: "Contract deployed!",
        description: `${selectedFile?.name} file has been successfully deployed.`,
        type: "success",
      });
    }
  }, [addFloatNotification, isSubmitDeployTxSuccess, selectedFile?.name]);

  useEffect(() => {
    // Collapse deploy block on success
    if (isSubmitDeployTxSuccess) {
      delayedAction({
        action: () => {
          setIsDeployExpanded(false);
        },
        delay: 300,
      });
    }
  }, [isSubmitDeployTxSuccess]);

  const handleFileChange = (file?: File) => {
    resetContractState();

    // Adding a slight delay to make sure the previous state was reset
    delayedAction({
      action: () => {
        setSelectedFile(file);
      },
      delay: 300,
    });
  };

  const handleNavigateToContractExplorer = () => {
    const contractId = getContractId();
    smartContracts.updateExplorerContractId(contractId);

    delayedAction({
      action: () => {
        router.push(Routes.SMART_CONTRACTS_CONTRACT_EXPLORER);
      },
      delay: 0,
    });
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

  const renderContractIdExternalLink = () => {
    const contractId = getContractId();
    return contractId ? (
      <SdsLink href={stellarExpertAccountLink(contractId, network.id)}>
        {contractId || ""}
        <Icon.LinkExternal01 />
      </SdsLink>
    ) : (
      ""
    );
  };

  const renderContent = () => {
    if (network.id === "mainnet") {
      return null;
    }

    return (
      <>
        <SourceAccountPicker
          value={sourceAccount}
          error={sourceAccountError}
          onChange={(value: string) => {
            setSourceAccount(value);

            const validationError = validate.getPublicKeyError(value);
            setSourceAccountError(validationError || "");
          }}
        />

        {/* ====================================================================
        Upload card
        ==================================================================== */}
        <div className="DeployContract__container">
          <Card>
            <Box gap="sm">
              <CardHeading
                title="Upload contract"
                isActive={isSubmitUploadTxSuccess}
                isExpanded={isUploadExpanded}
                onDoneAction={setIsUploadExpanded}
                txHash={submitUploadTxResponse?.result?.txHash}
                networkId={network.id}
              />

              <ExpandBox offsetTop="sm" isExpanded={isUploadExpanded}>
                <Box gap="md">
                  <FilePicker
                    key={`filePicker-${resetFilePicker}`}
                    onChange={handleFileChange}
                    acceptedExtension={[".wasm"]}
                    isDisabled={!sourceAccount || isSubmitUploadTxSuccess}
                  />

                  {/* TODO: check if wasm hash already uploaded */}

                  {uploadTxError ? (
                    <Notification
                      title="Upload transaction error"
                      variant="error"
                    >
                      {`There was an error building the Upload transaction: ${uploadTxError.toString()}`}
                    </Notification>
                  ) : null}

                  <Box gap="sm" direction="row" justify="end">
                    <Button
                      variant="secondary"
                      size="md"
                      disabled={!selectedFile || Boolean(uploadTx?.preparedXdr)}
                      isLoading={isUploadTxLoading || isUploadTxFetching}
                      onClick={async () => {
                        if (selectedFile) {
                          const operation = Operation.uploadContractWasm({
                            wasm: await fileToBuffer(selectedFile),
                          });

                          // Will trigger useBuildRpcTransaction upload hook
                          setUploadOp(operation);
                        }
                      }}
                    >
                      Build Upload transaction
                    </Button>
                  </Box>

                  <SignTransactionXdr
                    key={`upload-tx-${signTxResetKey}`}
                    id="upload-tx"
                    title="Add signature to upload"
                    xdrToSign={uploadTx?.preparedXdr || null}
                    onDoneAction={({
                      signedXdr,
                      successMessage,
                      errorMessage,
                    }) => {
                      setSignedUploadTx(signedXdr);
                      setSignUploadSuccess(successMessage);
                      setSignUploadError(errorMessage);
                    }}
                    isDisabled={
                      !uploadTx?.preparedXdr || isSubmitUploadTxSuccess
                    }
                  />

                  {signUploadError ? (
                    <Notification
                      title="Sign upload transaction error"
                      variant="error"
                    >
                      There was an error signing the Upload transaction:{" "}
                      {signUploadError}
                    </Notification>
                  ) : null}

                  <Box gap="sm" direction="row" justify="end">
                    <Button
                      variant="secondary"
                      size="md"
                      disabled={!signedUploadTx || isSubmitUploadTxSuccess}
                      isLoading={isSubmitUploadTxPending}
                      onClick={() => {
                        if (submitUploadTxError) {
                          resetSubmitUploadTx();
                        }

                        if (signedUploadTx) {
                          delayedAction({
                            action: () => {
                              submitUploadTx({
                                rpcUrl: network.rpcUrl,
                                transactionXdr: signedUploadTx,
                                networkPassphrase: network.passphrase,
                                headers: getNetworkHeaders(network, "rpc"),
                              });
                            },
                            delay: submitUploadTxError ? 300 : 0,
                          });
                        }
                      }}
                    >
                      Upload contract
                    </Button>
                  </Box>

                  {submitUploadTxResponse ? (
                    <TransactionSuccessCard
                      response={submitUploadTxResponse}
                      network={network.id}
                      isBlockExplorerEnabled={false}
                    />
                  ) : null}

                  {submitUploadTxError ? (
                    <RpcErrorResponse error={submitUploadTxError} />
                  ) : null}
                </Box>
              </ExpandBox>
            </Box>
          </Card>
        </div>

        {/* ====================================================================
        Deploy card
        ==================================================================== */}
        <div className="DeployContract__container">
          <Card>
            <Box gap="xl">
              <CardHeading
                title="Deploy contract"
                isActive={isSubmitDeployTxSuccess}
                isExpanded={isDeployExpanded}
                onDoneAction={setIsDeployExpanded}
                txHash={submitDeployTxResponse?.result?.txHash}
                networkId={network.id}
              />

              <ExpandBox offsetTop="xl" isExpanded={isDeployExpanded}>
                <Box gap="md">
                  {/* Generic deploy error */}
                  {pageError ? (
                    <Notification title="Error" variant="error">
                      {pageError}
                    </Notification>
                  ) : null}

                  {constructorSchema ? (
                    <Card>
                      <Box gap="md">
                        <Text
                          as="div"
                          size="sm"
                          weight="semi-bold"
                          addlClassName="DeployContract__darkHeading"
                        >
                          {CONSTRUCTOR_KEY}
                        </Text>

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
                      </Box>
                    </Card>
                  ) : null}

                  {deployTxError ? (
                    <Notification
                      title="Deploy transaction error"
                      variant="error"
                    >
                      {`There was an error building the Deploy transaction: ${deployTxError.toString()}`}
                    </Notification>
                  ) : null}

                  <Box gap="sm" direction="row" justify="end">
                    <Button
                      variant="secondary"
                      size="md"
                      isLoading={isDeployTxLoading || isDeployTxFetching}
                      disabled={
                        !submitUploadTxResponse ||
                        hasFormErrors ||
                        !isConstructorArgsFilled ||
                        isSubmitDeployTxSuccess
                      }
                      onClick={async () => {
                        if (
                          sourceAccount &&
                          submitUploadTxResponse?.result?.returnValue?.bytes()
                        ) {
                          const operation = Operation.createCustomContract({
                            wasmHash:
                              submitUploadTxResponse.result.returnValue.bytes(),
                            address: Address.fromString(sourceAccount),
                            constructorArgs: getOrderedConstructorArgs(
                              constructorFormValue.args,
                              constructorSchema,
                            ),
                          });

                          setDeployOp(operation);
                        }
                      }}
                    >
                      Build Deploy transaction
                    </Button>
                  </Box>

                  <SignTransactionXdr
                    key={`deploy-tx-${signTxResetKey}`}
                    id="deploy-tx"
                    title="Add signature to deploy"
                    xdrToSign={deployTx?.preparedXdr || null}
                    onDoneAction={({
                      signedXdr,
                      successMessage,
                      errorMessage,
                    }) => {
                      setSignedDeployTx(signedXdr);
                      setSignDeploySuccess(successMessage);
                      setSignDeployError(errorMessage);
                    }}
                    isDisabled={
                      !deployTx?.preparedXdr || isSubmitDeployTxSuccess
                    }
                  />

                  {signDeployError ? (
                    <Notification
                      title="Sign deploy transaction error"
                      variant="error"
                    >
                      There was an error signing the Deploy transaction:{" "}
                      {signDeployError}
                    </Notification>
                  ) : null}

                  <Box gap="sm" direction="row" justify="end">
                    <Button
                      variant="secondary"
                      size="md"
                      disabled={!signedDeployTx || isSubmitDeployTxSuccess}
                      isLoading={isSubmitDeployTxPending}
                      onClick={() => {
                        if (submitDeployTxError) {
                          resetSubmitDeployTx();
                        }

                        if (signedDeployTx) {
                          delayedAction({
                            action: () => {
                              submitDeployTx({
                                rpcUrl: network.rpcUrl,
                                transactionXdr: signedDeployTx,
                                networkPassphrase: network.passphrase,
                                headers: getNetworkHeaders(network, "rpc"),
                              });
                            },
                            delay: submitDeployTxError ? 300 : 0,
                          });
                        }
                      }}
                    >
                      Deploy contract
                    </Button>
                  </Box>

                  {submitDeployTxResponse ? (
                    <TransactionSuccessCard
                      response={submitDeployTxResponse}
                      network={network.id}
                      isBlockExplorerEnabled={false}
                    />
                  ) : null}

                  {submitDeployTxError ? (
                    <RpcErrorResponse error={submitDeployTxError} />
                  ) : null}
                </Box>
              </ExpandBox>
            </Box>
          </Card>
        </div>

        {/* ====================================================================
        Contract card
        ==================================================================== */}
        {submitDeployTxResponse ? (
          <div className="DeployContract__container">
            <Card>
              <Box gap="lg">
                <Text as="div" size="sm" weight="medium">
                  Contract details
                </Text>

                <Box gap="sm">
                  <DetailsItem label="Name" value={selectedFile?.name || ""} />

                  <DetailsItem
                    label="Contract ID"
                    value={renderContractIdExternalLink()}
                  />

                  <DetailsItem
                    label="Wasm Hash"
                    value={
                      submitUploadTxResponse?.result?.returnValue?.bytes()
                        ? Buffer.from(
                            submitUploadTxResponse.result.returnValue.bytes(),
                          ).toString("hex")
                        : ""
                    }
                  />

                  <DetailsItem
                    label="Versions"
                    value={
                      <>
                        {parsedContractData?.rustVersion ? (
                          <div>{parsedContractData.rustVersion} (Rust)</div>
                        ) : null}
                        {parsedContractData?.sdkVersion ? (
                          <div>
                            {parsedContractData.sdkVersion} (soroban-sdk)
                          </div>
                        ) : null}
                      </>
                    }
                  />
                </Box>

                <Box gap="sm" direction="row" justify="left">
                  <Button
                    variant="secondary"
                    size="md"
                    disabled={!submitDeployTxResponse}
                    onClick={() => handleNavigateToContractExplorer()}
                  >
                    View Contract in Contract Explorer
                  </Button>
                </Box>
              </Box>
            </Card>
          </div>
        ) : null}
      </>
    );
  };

  return (
    <Box gap="lg">
      <PageCard
        heading="Upload and Deploy Contract"
        rightElement={
          <Button
            variant="error"
            size="md"
            icon={<Icon.RefreshCw01 />}
            iconPosition="right"
            onClick={() => {
              setSelectedFile(undefined);
              setResetFilePicker((prev) => prev + 1);

              resetSourceAccount();
              resetContractState();
            }}
          >
            Clear
          </Button>
        }
      >
        {renderContent()}
      </PageCard>
    </Box>
  );
}

// =============================================================================
// Local Components
// =============================================================================
const ExpandArrow = ({
  gap,
  isExpanded,
  isActive = false,
  children = null,
  onDoneAction,
}: {
  gap: "xs" | "sm" | "md" | "lg" | "xl";
  isExpanded: boolean;
  isActive: boolean;
  onDoneAction: () => void;
  children?: React.ReactNode;
}) => {
  return (
    <Box
      gap={gap}
      direction="row"
      align="center"
      addlClassName="ExpandArrow"
      data-is-expanded={isExpanded}
      data-is-active={isActive}
      {...(isActive
        ? {
            onClick: onDoneAction,
          }
        : {})}
    >
      {children}

      {/* TODO: maybe fix arrow animation */}
      {isActive ? (
        <div className="ExpandArrow__arrow">
          <Icon.ChevronRight />
        </div>
      ) : null}
    </Box>
  );
};

const CardHeading = ({
  title,
  isActive,
  isExpanded,
  onDoneAction,
  txHash,
  networkId,
}: {
  title: string;
  isActive: boolean;
  isExpanded: boolean;
  onDoneAction: (isExpanded: boolean) => void;
  txHash: string | undefined;
  networkId: NetworkType;
}) => {
  return (
    <Box
      gap="md"
      direction="row"
      justify="space-between"
      align="center"
      wrap="wrap"
    >
      <ExpandArrow
        gap="xs"
        isActive={isActive}
        isExpanded={isExpanded}
        onDoneAction={() => {
          onDoneAction(!isExpanded);
        }}
      >
        <Box
          gap="sm"
          direction="row"
          align="center"
          addlClassName="DeployContract__container__header"
          data-is-success={isActive}
        >
          {isActive ? <Icon.CheckCircle /> : null}

          <Text as="div" size="sm" weight="medium">
            {title}
          </Text>
        </Box>
      </ExpandArrow>

      {txHash ? (
        <Link
          href={stellarExpertTransactionLink(txHash, networkId)}
          icon={<Icon.LinkExternal01 />}
          size="xs"
        >
          {txHash}
        </Link>
      ) : null}
    </Box>
  );
};

const DetailsItem = ({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) => {
  return (
    <Box
      gap="md"
      direction="row"
      align="center"
      wrap="wrap"
      addlClassName="DeployContract__detailsItem"
    >
      <div className="DeployContract__detailsItem__label">{label}</div>
      <div className="DeployContract__detailsItem__value">{value}</div>
    </Box>
  );
};
