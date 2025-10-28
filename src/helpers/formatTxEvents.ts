import {
  AnyObject,
  RpcTxJsonResponseTransactionEventsJson,
  RpcTxJsonResponseTxEvent,
} from "@/types/types";

export const formatTxEvents = ({
  contractEvents,
  transactionEvents,
}: {
  contractEvents: RpcTxJsonResponseTxEvent[] | undefined;
  transactionEvents: RpcTxJsonResponseTransactionEventsJson | undefined;
}) => {
  const formattedContractEvents = contractEvents?.map((ce) => ({
    title: getTitle(ce.body.v0.topics),
    contractId: ce.contract_id,
    topics: formatTopics(ce.body.v0.topics),
    data: ce.body.v0.data,
    rawJson: ce,
  }));

  const formattedTransactionEvents = transactionEvents?.map((te) => ({
    title: getTitle(te.event.body.v0.topics),
    contractId: te.event.contract_id,
    topics: formatTopics(te.event.body.v0.topics),
    data: te.event.body.v0.data,
    rawJson: te,
    stage: te.stage,
  }));

  return { formattedContractEvents, formattedTransactionEvents };
};

// =============================================================================
// Helpers
// =============================================================================
const getTitle = (topics: AnyObject[]) => {
  return topics?.[0]?.symbol
    ? `${formatSnakeCaseToTitle(topics[0].symbol)} Event`
    : "Event";
};

const formatSnakeCaseToTitle = (text: string): string => {
  if (!text) return text;

  return text
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

type TopicItem = {
  label: string;
  value: any;
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

  switch (key) {
    case "string":
      if (isAssetValue(val)) {
        value = val === "native" ? "native (XLM)" : val;
      }
      break;
    // TODO: format map and vec
    case "map":
    case "vec":
      break;
    default:
    // Do nothing
  }

  return { label: formatSnakeCaseToTitle(key), value };
};

const isAssetValue = (val: any) => {
  // Native asset or CODE:ISSUER format
  return (
    typeof val === "string" &&
    (val === "native" || val?.split(":")?.length === 2)
  );
};
