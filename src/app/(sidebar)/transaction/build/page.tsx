"use client";

import { Alert } from "@stellar/design-system";

import { useStore } from "@/store/useStore";
import { Box } from "@/components/layout/Box";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { Params } from "./components/Params";
import { Operations } from "./components/Operations";
import { ClassicTransactionXdr } from "./components/ClassicTransactionXdr";
import { SorobanTransactionXdr } from "./components/SorobanTransactionXdr";

export default function BuildTransaction() {
  const { transaction } = useStore();

  // For Classic
  const { params: paramsError, operations: operationsError } =
    transaction.build.error;

  // For Soroban
  const { soroban } = transaction.build;
  const IS_SOROBAN_TX = Boolean(soroban.operation.operation_type);

  const renderError = () => {
    if (paramsError.length > 0 || operationsError.length > 0) {
      return (
        <ValidationResponseCard
          variant="error"
          title="Transaction building errors:"
          response={
            <Box gap="sm">
              <>
                {paramsError.length > 0 ? (
                  <Box gap="sm">
                    <>
                      <div>Params</div>
                      <ul data-testid="build-transaction-params-errors">
                        {paramsError.map((e, i) => (
                          <li key={`e-${i}`}>{e}</li>
                        ))}
                      </ul>
                    </>
                  </Box>
                ) : null}

                {operationsError.length > 0 ? (
                  <Box
                    gap="sm"
                    data-testid="build-transaction-operations-errors"
                  >
                    {operationsError.map((e, i) => (
                      <Box gap="sm" key={`e-${i}`}>
                        <>
                          {e.label ? <div>{e.label}</div> : null}
                          <ul>
                            {e.errorList?.map((ee, ei) => (
                              <li key={`e-${i}-${ei}`}>{ee}</li>
                            ))}
                          </ul>
                        </>
                      </Box>
                    ))}
                  </Box>
                ) : null}
              </>
            </Box>
          }
        />
      );
    }

    return null;
  };

  return (
    <Box gap="md">
      <Params />
      <Operations />

      <Alert variant="primary" placement="inline">
        The transaction builder lets you build a new Stellar transaction. This
        transaction will start out with no signatures. To make it into the
        ledger, this transaction will then need to be signed and submitted to
        the network.
      </Alert>

      <>{renderError()}</>

      {IS_SOROBAN_TX ? (
        renderSorobanTransactionXdr(soroban.operation.operation_type)
      ) : (
        <ClassicTransactionXdr />
      )}
    </Box>
  );
}

const renderSorobanTransactionXdr = (sorobanOperation: string) => {
  // "invoke_contract_function" operation builds its tx from the component level
  if (sorobanOperation === "invoke_contract_function") {
    return <SorobanTransactionXdr hasPreBuiltXdr={true} />;
  }

  return <SorobanTransactionXdr />;
};
