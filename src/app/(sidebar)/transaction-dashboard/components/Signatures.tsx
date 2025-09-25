import { Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { getTxData } from "@/helpers/getTxData";
import { signatureHint } from "@/helpers/signatureHint";
import { getPublicKey } from "@/helpers/decodeMuxedToEd25519";

import { RpcTxJsonResponse } from "@/types/types";

const getPossibleSigners = ({
  hint,
  signature,
  transaction,
  feeBumpTx,
}: {
  hint: string;
  signature: string;
  transaction: any;
  feeBumpTx: any;
}) => {
  const allPossibleSigners = [];

  console.log(
    "[getPossibleSigners] transaction.source_account: ",
    transaction?.source_account,
  );
  // console.log("[getPossibleSigners] feeBumpTx: ", feeBumpTx);

  // fee bump transaction source account
  if (feeBumpTx?.tx?.fee_source) {
    allPossibleSigners.push(getPublicKey(feeBumpTx.tx.fee_source));
  }
  // regular transaction source account
  if (transaction?.source_account) {
    allPossibleSigners.push(getPublicKey(transaction.source_account));
  }

  if (transaction?.operations && Array.isArray(transaction.operations)) {
    transaction.operations.forEach((op: any) => {
      if (op?.source_account) {
        allPossibleSigners.push(getPublicKey(op.source_account));
      }
    });
  }

  // if (feeBumpTx?.source_account) {
  //   allPossibleSigners.push(getPublicKey(feeBumpTx.source_account));
  // }

  console.log("allPossibleSigners: ", allPossibleSigners);

  // if (transaction.tx.feeSource && transaction.tx.feeSource.accountId) {
  //   allPossibleSigners.push(transaction.feeSource.accountId);
  // }
  // if (
  //   transaction.operations &&
  //   transaction.operations[0] &&
  //   transaction.source.accountId
  // ) {
  //   allPossibleSigners.push(transaction.source.accountId);
  // }

  const test = signatureHint(hint);

  console.log("test: ", test);

  // valid signature
  // invalid signature

  return allPossibleSigners;
};

export const Signatures = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  if (!txDetails) {
    return null;
  }

  const { signatures, transaction, feeBumpTx } = getTxData(txDetails);

  if (!signatures || signatures.length === 0) {
    return null;
  }

  console.log("transaction: ", transaction);
  console.log("feeBumpTx: ", feeBumpTx);
  console.log("signatures: ", signatures);

  console.log(
    "getPossibleSigners: ",
    getPossibleSigners({
      hint: signatures[0]?.hint,
      signature: signatures[0]?.signature,
      transaction,
      feeBumpTx,
    }),
  );

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
                <code>?</code>
                {/* {getPossibleSigner({ hint, signature })} */}
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
