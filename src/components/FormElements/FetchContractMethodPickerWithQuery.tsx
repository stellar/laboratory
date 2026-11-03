"use client";

import { useEffect, useState, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ContractMethodSelectPicker } from "@/components/FormElements/ContractMethodSelectPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { MessageField } from "@/components/MessageField";
import { AddressSelector } from "@/components/AddressSelector";

import { useStore } from "@/store/useStore";
import { validate } from "@/validate";
import { useContractClientFromRpc } from "@/query/useContractClientFromRpc";
import { useGetContractDataFromRpcById } from "@/query/useGetContractDataFromRpcById";

import { getNetworkHeaders } from "@/helpers/getNetworkHeaders";
import { SAC_SPEC } from "@/helpers/sacSpec";

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
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const [fetchType, setFetchType] = useState<"sac" | "contract" | null>(null);

  const contractIdInput = value?.contract_id || "";

  const {
    data: contractData,
    isLoading: isContractDataLoading,
    isFetching: isContractDataFetching,
    error: contractDataError,
    refetch: fetchContractData,
  } = useGetContractDataFromRpcById({
    contractId: contractIdInput,
    rpcUrl: network.rpcUrl,
    headers: getNetworkHeaders(network, "rpc"),
  });

  const contractType = contractData?.contractType;

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

  const invokeContractSpec = isSacType ? SAC_SPEC : contractClient?.spec;

  const memoizedMethods = useMemo(() => {
    return invokeContractSpec?.funcs();
  }, [invokeContractSpec]);

  const contractMethods = useMemo(() => {
    if ((isSacType || isContractClientSuccess) && memoizedMethods) {
      return (
        memoizedMethods
          ?.filter((func) => !func.name.toString().includes("__"))
          ?.map((func) => func.name.toString()) || []
      );
    }
    return [];
  }, [isSacType, isContractClientSuccess, memoizedMethods]);

  // Set the fetch type from the contract type
  useEffect(() => {
    if (contractType) {
      setFetchType(isSacType ? "sac" : "contract");
    }

    if (contractDataError) {
      setFetchError(contractDataError?.message);
    }
  }, [contractType, contractDataError, isSacType]);

  // Fetch contract data for a standard Stellar smart contract (the SAC spec is bundled)
  useEffect(() => {
    if (fetchType === "contract") {
      fetchContractClient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchType]);

  // Set the error
  useEffect(() => {
    if (contractClientError?.message) {
      setFetchError(contractClientError.message);
    }
  }, [contractClientError]);

  // Auto-fetch contract methods once a valid contract id is filled in.
  // Debounced so we only fetch after the user stops typing/pasting, and
  // gated on validation so we never fetch an incomplete/invalid id. This also
  // covers remounting with a saved contract_id.
  useEffect(() => {
    if (!contractIdInput || validate.getContractIdError(contractIdInput)) {
      return;
    }

    const timeoutId = setTimeout(() => {
      fetchContractData();
    }, 500);

    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractIdInput]);

  const handleContractIdChange = (contractId: string) => {
    // reset the error
    setFetchError("");

    // reset fetch type so the fetch chain re-triggers on next fetch
    setFetchType(null);

    // reset queries
    queryClient.resetQueries({ queryKey: ["useGetContractDataFromRpcById"] });
    queryClient.resetQueries({ queryKey: ["useClientFromRpc"] });

    // validate the contract id
    if (contractId) {
      const validatedContractIdError = validate.getContractIdError(contractId);
      if (validatedContractIdError) {
        setContractIdError(validatedContractIdError);
      } else {
        setContractIdError("");
      }
    }

    // Clear stale method and args from the previous contract
    const newValue: SorobanInvokeValue = {
      contract_id: contractId || "",
      function_name: "",
      args: {},
    };

    onChange(newValue);
  };

  const handleFetch = async () => {
    // Fetch type which will trigger the contract client or SAC data fetch
    await fetchContractData();
    setFetchError("");
  };

  return (
    <Box gap="md" addlClassName="FetchContractMethodPicker">
      <TextPicker
        key={id}
        id={id}
        label={label}
        placeholder="Ex: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
        value={contractIdInput}
        error={error || contractIdError}
        onChange={(e) => handleContractIdChange(e.target.value)}
        disabled={disabled}
        rightElement={
          !disabled && (
            <AddressSelector.Button
              mode="contract"
              onClick={() => setIsSelectorOpen(!isSelectorOpen)}
            />
          )
        }
      />
      <AddressSelector.Dropdown
        mode="contract"
        onChange={handleContractIdChange}
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
      />

      <Box gap="sm">
        <Box gap="md" direction="row" wrap="wrap">
          <Button
            disabled={!contractIdInput || Boolean(contractIdError)}
            isLoading={
              isContractClientFetching ||
              isContractDataFetching ||
              isContractDataLoading
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
        {contractMethods.length > 0 && invokeContractSpec && value ? (
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
