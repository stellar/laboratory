import {
  AnyObject,
  RpcTxJsonResponseTransactionEventsJson,
  RpcTxJsonResponseTxEvent,
} from "@/types/types";

export type FormattedTxEvent = {
  contractId: string;
  topics: AnyObject[];
  data: AnyObject;
  rawJson: any;
};

type TopicItem = {
  label: string;
  value: any;
};

export const formatTxEvents = ({
  contractEvents,
  transactionEvents,
}: {
  contractEvents: RpcTxJsonResponseTxEvent[] | undefined;
  transactionEvents: RpcTxJsonResponseTransactionEventsJson | undefined;
}) => {
  const formattedContractEvents = contractEvents?.map((ce) => ({
    contractId: ce.contract_id,
    topics: formatTopics(ce.body.v0.topics),
    data: ce.body.v0.data,
    rawJson: ce,
  }));

  const formattedTransactionEvents = transactionEvents?.map((te) => ({
    contractId: te.event.contract_id,
    topics: formatTopics(te.event.body.v0.topics),
    data: te.event.body.v0.data,
    rawJson: te,
  }));

  return { formattedContractEvents, formattedTransactionEvents };
};

// =============================================================================
// Helpers
// =============================================================================
const formatSnakeCaseToTitle = (text: string): string => {
  if (!text) return text;

  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const formatTopics = (topics: AnyObject[]) => {
  if (!topics?.length) return topics;

  return topics.reduce((res: TopicItem[], cur) => {
    const [key, val] = Object.entries(cur)[0];

    return [...res, formatTopicItem(key, val)];
  }, []);
};

const formatTopicItem = (key: string, val: any) => {
  let value = val;

  if (isAssetValue(val)) {
    value = val === "native" ? "native (XLM)" : val;
  }

  return { label: formatSnakeCaseToTitle(key), value: { [key]: value } };
};

const isAssetValue = (val: any) => {
  // Native asset or CODE:ISSUER format
  return (
    typeof val === "string" &&
    (val === "native" || val?.split(":")?.length === 2)
  );
};
