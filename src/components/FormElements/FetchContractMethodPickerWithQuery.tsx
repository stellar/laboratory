import React, { useState } from "react";
import { Button } from "@stellar/design-system";
import { Spec } from "@stellar/stellar-sdk/contract";

import { SorobanInvokeValue } from "@/types/types";

import { Box } from "@/components/layout/Box";
import { ContractMethodSelectPicker } from "@/components/FormElements/ContractMethodSelectPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { MessageField } from "@/components/MessageField";

import { useStore } from "@/store/useStore";
import { validate } from "@/validate";
import { useContractClientFromRpc } from "@/query/useContractClientFromRpc";

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
  const [contractIdError, setContractIdError] = useState<string>("");
  const [contractMethods, setContractMethods] = useState<string[]>([]);
  const [contractMethodsSpec, setContractMethodsSpec] = useState<Spec>(
    {} as Spec,
  );
  const [fetchError, setFetchError] = useState<string | null>(null);

  const {
    data: contractClient,
    isError,
    isSuccess,
    error: contractClientError,
  } = useContractClientFromRpc({
    contractId: value?.contract_id || "",
    networkPassphrase: network.passphrase,
    rpcUrl: network.rpcUrl,
  });

  const handleContractIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // reset the error and methods
    setFetchError("");
    setContractMethods([]);

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
      data: value?.data || {},
    };

    onChange(newValue);
  };

  const handleFetchContractMethods = async () => {
    setFetchError("");

    if (!value) {
      setFetchError("Contract ID is required");
      return;
    }

    if (isSuccess) {
      const contractSpec = contractClient?.spec;
      const contractMethods = contractSpec?.funcs();

      if (contractMethods) {
        const methodNames = contractMethods.map((method) =>
          method.name().toString(),
        );
        setContractMethods(methodNames);
      }

      if (contractSpec) {
        setContractMethodsSpec(contractSpec);
      }
    }

    if (isError) {
      setFetchError(contractClientError.message);
    }
  };

  return (
    <Box gap="md">
      <TextPicker
        key={id}
        id={id}
        label={label}
        placeholder="Ex: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
        value={value?.contract_id || ""}
        error={error || contractIdError}
        onChange={handleContractIdChange}
        disabled={disabled}
      />

      <Box gap="md" direction="row" wrap="wrap">
        <Button
          disabled={!value || Boolean(contractIdError)}
          variant="secondary"
          size="md"
          onClick={handleFetchContractMethods}
          type="button"
        >
          Fetch contract methods
        </Button>

        <>{fetchError ? <MessageField message={fetchError} isError /> : null}</>
      </Box>

      <>
        {contractMethods.length && value ? (
          <ContractMethodSelectPicker
            value={value}
            onChange={onChange}
            spec={contractMethodsSpec}
            methods={contractMethods}
            id={`${id}-method`}
          />
        ) : null}
      </>
    </Box>
  );
};
