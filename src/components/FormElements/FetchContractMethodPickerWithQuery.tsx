import React, { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { contract } from "@stellar/stellar-sdk";
import { Button } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ContractMethodSelectPicker } from "@/components/FormElements/ContractMethodSelectPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { MessageField } from "@/components/MessageField";

import { useStore } from "@/store/useStore";
import { validate } from "@/validate";
import { useContractClientFromRpc } from "@/query/useContractClientFromRpc";
import { useGetContractTypeFromRpcById } from "@/query/useGetContractTypeFromRpcById";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { useSacXdrData } from "@/hooks/useSacXdrData";

import { SorobanInvokeValue } from "@/types/types";

interface FetchContractMethodPickerWithQueryProps {
  id: string;
  value: SorobanInvokeValue | undefined;
  error?: string | undefined;
  label?: string;
  disabled?: boolean;
  onChange: (val: SorobanInvokeValue | undefined) => void;
}

/**
 * This component is used to fetch the contract methods for a given contract id.
 * It is used in the SorobanOperation component.
 */
export const FetchContractMethodPickerWithQuery = ({
  id,
  value,
  error,
  label,
  disabled,
  onChange,
}: FetchContractMethodPickerWithQueryProps) => {
  const { network } = useStore();
  const queryClient = useQueryClient();

  const [contractIdError, setContractIdError] = useState<string>("");
  const [contractMethods, setContractMethods] = useState<string[]>([]);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const [fetchType, setFetchType] = useState<"sac" | "contract" | null>(null);

  const contractIdInput = value?.contract_id || "";

  const {
    data: contractType,
    isLoading: isContractTypeLoading,
    isFetching: isContractTypeFetching,
    error: contractTypeError,
    refetch: fetchContractType,
  } = useGetContractTypeFromRpcById({
    contractId: contractIdInput,
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
  });

  const isSacType = contractType
    ? contractType === "contractExecutableStellarAsset"
    : false;

  const {
    data: contractClient,
    isSuccess: isContractClientSuccess,
    isFetching: isContractClientFetching,
    error: contractClientError,
    refetch: fetchContractClient,
  } = useContractClientFromRpc({
    contractId: contractIdInput,
    networkPassphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
  });

  const {
    sacXdrData,
    isSacDataSuccess,
    sacDataError,
    isSacDataFetching,
    isSacDataLoading,
  } = useSacXdrData({
    isActive: Boolean(network.rpcUrl && fetchType === "sac"),
  });

  let invokeContractSpec;

  if (sacXdrData && isSacType) {
    invokeContractSpec = new contract.Spec(sacXdrData);
  } else {
    invokeContractSpec = contractClient?.spec;
  }

  const memoizedMethods = useMemo(() => {
    return invokeContractSpec?.funcs();
  }, [invokeContractSpec]);

  // Set the fetch type from the contract type
  useEffect(() => {
    if (contractType) {
      setFetchType(isSacType ? "sac" : "contract");
    }

    if (contractTypeError) {
      setFetchError(contractTypeError?.message);
    }
  }, [contractType, contractTypeError, isSacType]);

  // Fetch contract data for a standard Stellar smart contract (SAC will trigger automatically in the hook)
  useEffect(() => {
    if (fetchType === "contract") {
      fetchContractClient();
    }
  }, [fetchContractClient, fetchType]);

  // Format contract methods and set the error
  useEffect(() => {
    if ((isSacDataSuccess || isContractClientSuccess) && memoizedMethods) {
      const methodNames = memoizedMethods
        ?.filter((func) => !func.name().toString().includes("__"))
        ?.map((func) => func.name().toString());

      setContractMethods(methodNames);
    }

    const errorMsg = contractClientError?.message || sacDataError?.message;

    if (errorMsg) {
      setFetchError(errorMsg);
    }
  }, [
    isSacDataSuccess,
    isContractClientSuccess,
    contractClientError,
    sacDataError,
  ]);

  const handleContractIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // reset the error and methods
    setFetchError("");
    setContractMethods([]);

    // reset queries
    if (contractType) {
      queryClient.resetQueries({
        queryKey: [
          "useGetContractTypeFromRpcById",
          "useClientFromRpc",
          "useGitHubFile",
        ],
      });
    }

    // validate the contract id
    if (e.target.value) {
      const validatedContractIdError = validate.getContractIdError(
        e.target.value,
      );
      if (validatedContractIdError) {
        setContractIdError(validatedContractIdError);
      } else {
        setContractIdError("");
      }
    }

    const newValue: SorobanInvokeValue = {
      contract_id: e.target.value || "",
      function_name: value?.function_name || "",
      args: value?.args || {},
    };

    onChange(newValue);
  };

  const handleFetch = async () => {
    // Fetch type which will trigger the contract client or SAC data fetch
    await fetchContractType();
    setFetchError("");
  };

  return (
    <Box gap="md">
      <TextPicker
        key={id}
        id={id}
        label={label}
        placeholder="Ex: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
        value={contractIdInput}
        error={error || contractIdError}
        onChange={handleContractIdChange}
        disabled={disabled}
      />

      <Box gap="sm">
        <Box gap="md" direction="row" wrap="wrap">
          <Button
            disabled={!contractIdInput || Boolean(contractIdError)}
            isLoading={
              isSacDataFetching ||
              isSacDataLoading ||
              isContractClientFetching ||
              isContractTypeFetching ||
              isContractTypeLoading
            }
            variant="secondary"
            size="md"
            onClick={handleFetch}
            type="button"
          >
            Fetch contract methods
          </Button>
        </Box>
        <>{fetchError ? <MessageField message={fetchError} isError /> : null}</>
      </Box>

      <>
        {contractMethods.length && invokeContractSpec && value ? (
          <ContractMethodSelectPicker
            value={value}
            onChange={onChange}
            spec={invokeContractSpec}
            methods={contractMethods}
            id={`${id}-method`}
          />
        ) : null}
      </>
    </Box>
  );
};
