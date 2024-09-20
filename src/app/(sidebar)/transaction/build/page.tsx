"use client";

import { Alert, Text } from "@stellar/design-system";

import { useStore } from "@/store/useStore";
import { Box } from "@/components/layout/Box";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

import { Params } from "./components/Params";
import { Operations } from "./components/Operations";
import { TransactionXdr } from "./components/TransactionXdr";

export default function BuildTransaction() {
  const { transaction } = useStore();
  const { params: paramsError, operations: operationsError } =
    transaction.build.error;

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
                      <ul>
                        {paramsError.map((e, i) => (
                          <li key={`e-${i}`}>{e}</li>
                        ))}
                      </ul>
                    </>
                  </Box>
                ) : null}

                {operationsError.length > 0 ? (
                  <Box gap="sm">
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
      <div className="PageHeader">
        <Text size="md" as="h1" weight="medium">
          Build Transaction
        </Text>
      </div>

      <Params />
      <Operations />

      <Alert variant="primary" placement="inline">
        The transaction builder lets you build a new Stellar transaction. This
        transaction will start out with no signatures. To make it into the
        ledger, this transaction will then need to be signed and submitted to
        the network.
      </Alert>

      <>{renderError()}</>

      <TransactionXdr />
    </Box>
  );
}
