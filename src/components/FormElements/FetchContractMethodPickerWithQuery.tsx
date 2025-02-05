import React, { useState } from "react";
import { Button } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { ContractMethodSelectPicker } from "@/components/FormElements/ContractMethodSelectPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { MessageField } from "@/components/MessageField";

import {
  fetchContractFunctionMethods,
  ContractFunctionMethods,
} from "@/helpers/sorobanUtils";

import { useStore } from "@/store/useStore";
import { validate } from "@/validate";

interface FetchContractMethodPickerWithQueryProps {
  id: string;
  value: string;
  error?: string | undefined;
  label?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

/**
 * FetchContractMethodPickerWithQuery
 *
 * This component is used to fetch the contract methods for a given contract id.
 * It is used in the SorobanOperation component.
 *
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
  const [fetchError, setFetchError] = useState<string>("");

  const onContractIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // reset the error and methods
    setFetchError("");
    setContractMethods([]);

    // call the onChange callback
    onChange?.(e);

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
  };

  const handleFetchContractMethods = async () => {
    const contractMethods: ContractFunctionMethods =
      await fetchContractFunctionMethods({
        contractId: value,
        networkPassphrase: network.passphrase,
        rpcUrl: network.rpcUrl,
      });

    if (contractMethods.methods) {
      setContractMethods(contractMethods.methods);
    }

    if (contractMethods.error) {
      setFetchError(contractMethods.error);
    }
  };

  return (
    <Box gap="md">
      <TextPicker
        key={id}
        id={id}
        label={label}
        placeholder="Ex: CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQVU2HHGCYSC"
        value={value || ""}
        error={error || contractIdError}
        onChange={onContractIdChange}
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
        {contractMethods.length ? (
          <ContractMethodSelectPicker
            methods={contractMethods}
            id={`${id}-method`}
          />
        ) : null}
      </>
    </Box>
  );
};
