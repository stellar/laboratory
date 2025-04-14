import {
  Badge,
  Button,
  CopyText,
  Icon,
  Link,
  Text,
} from "@stellar/design-system";
import { rpc as StellarRpc } from "@stellar/stellar-sdk";
import { Fragment } from "react";
import { Time } from "./Time";

function shortenHash(hash: string): string {
  const segmentSize = 6;
  return (
    hash.substring(0, segmentSize) +
    "…" +
    hash.substring(hash.length - segmentSize)
  );
}

function getOperationType(type: string): string {
  return underscore(type);
}

function underscore(input: string) {
  return input
    .split(/(?=[A-Z])/)
    .join("_")
    .toUpperCase();
}

export function RowContent({ tx }: { tx: StellarRpc.Api.TransactionInfo }) {
  const value = tx.envelopeXdr.value();

  // @ts-expect-error Fee bump operation is covered first by the `tx.feeBump`
  const operations = tx.feeBump ? [] : value.tx().operations();

  const type = tx.feeBump
    ? "FEE_BUMP"
    : getOperationType(operations[0].body().switch().name);

  return (
    <Fragment>
      <td>
        <Text size="xs" as="span">
          {type}
        </Text>
      </td>

      <td>
        <Link href="#">{shortenHash(tx.txHash)}</Link>
        &nbsp;
        <CopyText textToCopy={tx.txHash}>
          <Button
            size="sm"
            variant="tertiary"
            icon={<Icon.Copy01 />}
            iconPosition="left"
            onClick={(e) => e.preventDefault()}
          />
        </CopyText>
      </td>
      <td>
        <Time timestamp={tx.createdAt} />
      </td>
      <td>
        <Badge variant={tx.status === "SUCCESS" ? "success" : "error"}>
          {tx.status}
        </Badge>
      </td>
      <td>
        <Button size="sm" variant="tertiary">
          View details
        </Button>
      </td>
    </Fragment>
  );
}
