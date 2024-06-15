import {
  AccountRequiresMemoError,
  BadResponseError,
  NetworkError,
} from "@stellar/stellar-sdk";

import { Box } from "@/components/layout/Box";
import { ValidationResponseCard } from "@/components/ValidationResponseCard";

interface ErrorProps {
  error: NetworkError & {
    response: {
      data?: {
        extras?: {
          result_codes?: string;
          result_xdr?: string;
        };
      };
    };
  };
}

export const ErrorResponse = ({ error }: ErrorProps) => {
  let message = "",
    extras = null;
  if (error instanceof AccountRequiresMemoError) {
    message = "This destination requires a memo.";
    extras = (
      <Box gap="xs">
        <div>
          <div>Destination account:</div>
          <Box gap="sm" direction="row">
            <div></div>
            <div>{error.accountId}</div>
          </Box>
        </div>
        <div>
          <div>Operation index:</div>
          <Box gap="sm" direction="row">
            <div></div>
            <div>{error.operationIndex}</div>
          </Box>
        </div>
      </Box>
    );
  } else if (
    error?.response &&
    error.response.data?.extras?.result_codes &&
    error.response.data?.extras.result_xdr
  ) {
    const { result_codes, result_xdr } = error.response.data.extras;
    message = error.message;
    extras = (
      <Box gap="xs">
        <div>extras.result_codes:</div>

        <Box gap="sm" direction="row">
          <div></div>
          <div>{JSON.stringify(result_codes)}</div>
        </Box>

        <div>
          <div>Result XDR:</div>
          <Box gap="sm" direction="row">
            <div></div>
            <div>{result_xdr}</div>
          </Box>
        </div>
      </Box>
    );
  } else {
    message =
      error instanceof BadResponseError
        ? "Received a bad response when submitting."
        : "An unknown error occurred.";
    extras = (
      <Box gap="xs">
        <div>
          <div>original error:</div>
          <Box gap="sm" direction="row">
            <div></div>
            <div>{JSON.stringify(error, null, 2)}</div>
          </Box>
        </div>
      </Box>
    );
  }

  return (
    <ValidationResponseCard
      variant="error"
      title="Transaction failed!"
      subtitle={message}
      response={extras}
    />
  );
};
