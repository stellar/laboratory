import { Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { getTxData } from "@/helpers/getTxData";
import { signatureHint } from "@/helpers/signatureHint";

import { RpcTxJsonResponse } from "@/types/types";

export const Signatures = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  if (!txDetails) {
    return null;
  }

  const { signatures } = getTxData(txDetails);

  if (!signatures || signatures.length === 0) {
    return null;
  }

  const SignatureCell = ({
    children,
    isHeader,
    isSignature,
  }: {
    children: React.ReactNode;
    isHeader?: boolean;
    isSignature?: boolean;
  }) => {
    return (
      <Text
        size="sm"
        as="div"
        weight="medium"
        addlClassName="Signatures__text"
        {...(isHeader ? { "data-is-header": true } : {})}
        {...(isSignature ? { "data-is-signature": true } : {})}
      >
        {children}
      </Text>
    );
  };

  const getPossibleSigner = ({
    hint,
    signature,
  }: {
    hint: string;
    signature: string;
  }) => {
    // if()
    const test = signatureHint(hint);

    console.log("test: ", test);

    // valid signature
    // invalid signature

    return <span>{test}</span>;
  };

  const renderTableBody = () => {
    return signatures.map(
      (
        { hint, signature }: { hint: string; signature: string },
        index: number,
      ) => {
        const rowKey = `table-row-${index}`;

        return (
          <tr role="row" key={rowKey}>
            <td>
              <SignatureCell>
                {getPossibleSigner({ hint, signature })}
              </SignatureCell>
            </td>
            <td>
              <SignatureCell>
                <code>{hint}</code>
              </SignatureCell>
            </td>
            <td>
              <SignatureCell isSignature={true}>
                <code>{signature}</code>
              </SignatureCell>
            </td>
          </tr>
        );
      },
    );
  };

  return (
    <Box gap="md" addlClassName="Signatures">
      <div className="Signatures__gridTableContainer">
        <table role="table">
          <thead>
            <tr role="row">
              <th>
                <SignatureCell isHeader={true}>Signer</SignatureCell>
              </th>
              <th>
                <SignatureCell isHeader={true}>Hint</SignatureCell>
              </th>
              <th>
                <SignatureCell isHeader={true}>Signature</SignatureCell>
              </th>
            </tr>
          </thead>
          <tbody>{renderTableBody()}</tbody>
        </table>
      </div>
    </Box>
  );
};
