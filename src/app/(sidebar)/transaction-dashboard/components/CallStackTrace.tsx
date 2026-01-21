import { JSX, useState } from "react";
import {
  Alert,
  Button,
  Icon,
  Label,
  Text,
  Toggle,
} from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { SdsLink } from "@/components/SdsLink";
import { TransactionTabEmptyMessage } from "@/components/TransactionTabEmptyMessage";

import {
  DiagnosticEventJson,
  formatDiagnosticEvents,
  FormattedEventData,
  ProcessedEvent,
  TEMP_FAILED,
  TEMP_KALE,
  TEMP_LONG_PARAMS,
  TEMP_MIXED,
  TEMP_SS,
} from "@/helpers/formatDiagnosticEvents";
import { shortenStellarAddress } from "@/helpers/shortenStellarAddress";
import { getStellarExpertNetwork } from "@/helpers/getStellarExpertNetwork";
import { buildContractExplorerHref } from "@/helpers/buildContractExplorerHref";

import { getContractIdError } from "@/validate/methods/getContractIdError";
import { useStore } from "@/store/useStore";
import { STELLAR_EXPERT } from "@/constants/settings";

import { AnyObject, NetworkType } from "@/types/types";

export const CallStackTrace = ({
  diagnosticEvents,
}: {
  diagnosticEvents: DiagnosticEventJson[] | AnyObject | undefined;
}) => {
  const { network } = useStore();
  const [testDataId, setTestDataId] = useState<string>("");

  const TEST_DATA: { [key: string]: DiagnosticEventJson[] } = {
    soroSwap: TEMP_SS,
    kale: TEMP_KALE,
    longParams: TEMP_LONG_PARAMS,
    someFailed: TEMP_MIXED,
    allFailed: TEMP_FAILED,
  };

  const data = diagnosticEvents
    ? formatDiagnosticEvents(TEST_DATA[testDataId] || diagnosticEvents)
    : null;

  const [isCollapsedView, setIsCollapsedView] = useState(false);

  if (!data?.callStack) {
    return (
      <TransactionTabEmptyMessage title="No call stack trace">
        This transaction has no call stack trace.
      </TransactionTabEmptyMessage>
    );
  }

  const truncateParams = (
    data: FormattedEventData[],
    maxItems: number,
  ): FormattedEventData[] => {
    let itemCount = 0;
    let wasTruncated = false;

    const isContainer = (type: string): boolean => {
      return type === "vec" || type === "map";
    };

    const traverse = (node: any): any => {
      if (
        node &&
        typeof node === "object" &&
        "type" in node &&
        "value" in node
      ) {
        const isContainerType = isContainer(node.type);

        if (!isContainerType) {
          itemCount++;

          if (itemCount > maxItems) {
            wasTruncated = true;
            return undefined;
          }

          return node;
        }

        if (Array.isArray(node.value)) {
          const truncatedArray: any[] = [];

          for (const item of node.value) {
            if (itemCount >= maxItems) {
              wasTruncated = true;
              break;
            }
            const result = traverse(item);
            if (result !== undefined) {
              truncatedArray.push(result);
            }
          }

          if (truncatedArray.length > 0) {
            return { ...node, value: truncatedArray };
          }
          return undefined;
        }

        return node;
      }

      if (Array.isArray(node)) {
        const truncatedArray: any[] = [];
        for (const item of node) {
          if (itemCount >= maxItems) {
            wasTruncated = true;
            break;
          }
          const result = traverse(item);
          if (result !== undefined) {
            truncatedArray.push(result);
          }
        }

        // Add ellipsis at the root level if truncated
        if (wasTruncated && truncatedArray.length > 0) {
          truncatedArray.push({ value: "...", type: "ellipsis" });
        }

        return truncatedArray.length > 0 ? truncatedArray : undefined;
      }

      return node;
    };

    const result = traverse(data);
    return result || [];
  };

  const renderData = ({
    dataItem,
    parentId,
    voidAsEmptyFn,
    isFnParams,
  }: {
    dataItem: FormattedEventData;
    parentId?: string;
    voidAsEmptyFn?: boolean;
    isFnParams?: boolean;
  }) => {
    const { type, value } = dataItem;

    // Ellipsis (special case) for collapsed params
    if (type === "ellipsis") {
      return <span className="CallStackTrace__ellipsis">…</span>;
    }

    // Array
    if (type === "vec") {
      let renderVal = value;

      if (isFnParams && isCollapsedView) {
        renderVal = truncateParams(value, 4);
      }

      return (
        <span className="CallStackTrace__itemArray">
          {/* Don’t show square brackets for param arrays */}
          {parentId ? <Bracket char={"["} /> : null}
          <span className="CallStackTrace__itemArray__items">
            {renderVal.map((v, vIndex) => {
              const id = `vec-${vIndex}`;

              return (
                <span
                  key={parentId ? `${parentId}-${id}` : `${id}`}
                  className="CallStackTrace__itemArray__item"
                >
                  {renderData({ dataItem: v, parentId: id })}
                  <Comma enabled={vIndex !== renderVal.length - 1} />
                </span>
              );
            })}
          </span>
          {parentId ? <Bracket char={"]"} /> : null}
        </span>
      );
    }

    // Object
    if (type === "map") {
      return (
        <span className="CallStackTrace__itemObject">
          <Bracket char={"{"} />
          {value.map((v, vIndex) => {
            return (
              <span
                key={`map-${v.key}-${vIndex}`}
                className="CallStackTrace__itemObject__item"
              >
                <TypedValueItem value={v.key.value} type={v.key.type} />
                <Colon />
                {renderData({ dataItem: v.val })}
                <Comma enabled={vIndex !== value.length - 1} />
              </span>
            );
          })}
          <Bracket char={"}"} />
        </span>
      );
    }

    // Void
    if (type === "void") {
      // For function params, we want to show void as ()
      return <TypedValueItem value={voidAsEmptyFn ? "()" : "void"} />;
    }

    if (type === "address") {
      return <AddressItem value={value} networkId={network.id} />;
    }

    // Primitive
    return (
      <TypedValueItem
        value={value}
        type={type}
        title={isAsset(value) ? `${value}` : undefined}
      />
    );
  };

  const renderContractId = (contractId: string) => (
    <span className="CallStackTrace__itemContract">
      <span>at</span>
      <SdsLink
        variant="secondary"
        href={buildContractExplorerHref(contractId)}
        target="_blank"
        isUnderline
        title={contractId}
      >
        {shortenStellarAddress(contractId)}
      </SdsLink>
    </span>
  );

  const renderItemContent = (event: ProcessedEvent) => {
    // Contract event
    if (event.type === "contract_event") {
      return (
        <span className="CallStackTrace__itemContent">
          <span>
            <span
              className="CallStackTrace__itemFunc"
              data-is-collapsed={isCollapsedView}
            >
              <span className="CallStackTrace__itemFunc__func">
                {event.name}
              </span>
              {event.dataContractParams?.length ? (
                <>
                  <Bracket char={"["} />
                  <span className="CallStackTrace__itemFunc__params">
                    {renderData({
                      dataItem: {
                        type: "vec",
                        value: event.dataContractParams,
                      },
                      voidAsEmptyFn: true,
                      isFnParams: true,
                    })}
                  </span>
                  <Bracket char={"]"} />
                </>
              ) : null}
            </span>

            {event.contractId ? renderContractId(event.contractId) : null}
          </span>

          <span className="CallStackTrace__itemData">
            <span>data:</span>
            {renderData({
              dataItem: event.data,
              voidAsEmptyFn: true,
              parentId: `data-${event.name}`,
            })}
          </span>
        </span>
      );
    }

    // Function
    return (
      <span className="CallStackTrace__itemContent">
        <span>
          <span
            className="CallStackTrace__itemFunc"
            data-is-collapsed={isCollapsedView}
          >
            <span className="CallStackTrace__itemFunc__func">{event.name}</span>
            <Bracket char={"("} />
            <span className="CallStackTrace__itemFunc__params">
              {renderData({
                dataItem: event.data,
                voidAsEmptyFn: true,
                isFnParams: true,
              })}
            </span>
            <Bracket char={")"} />
          </span>

          {event.contractId ? renderContractId(event.contractId) : null}
        </span>

        {event.return ? (
          <span className="CallStackTrace__itemReturn">
            <span className="CallStackTrace__icon">
              <Icon.ArrowRight />
            </span>
            {renderData({ dataItem: event.return.data, parentId: event.name })}
          </span>
        ) : null}
      </span>
    );
  };

  const renderNested = (events: ProcessedEvent[], parentId?: string) => {
    return events.map((event, eventIndex) => {
      return (
        <div
          key={
            parentId
              ? `${parentId}-${event.type}-${eventIndex}`
              : `${event.type}-${eventIndex}`
          }
          className="CallStackTrace__event"
          data-is-error={event.isError}
        >
          <EventItem
            event={event}
            renderContent={renderItemContent}
            renderNested={renderNested}
          />
        </div>
      );
    });
  };

  return (
    <Box gap="md">
      {/* TODO: remove before merge */}
      <div
        style={{
          border: "2px solid #c00",
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          padding: 10,
          alignItems: "center",
          fontWeight: "bold",
          color: "#c00",
        }}
      >
        <span>FOR TESTING:</span>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setTestDataId("soroSwap")}
          disabled={testDataId === "soroSwap"}
        >
          SoroSwap
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setTestDataId("kale")}
          disabled={testDataId === "kale"}
        >
          Kale
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setTestDataId("longParams")}
          disabled={testDataId === "longParams"}
        >
          Long params
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setTestDataId("someFailed")}
          disabled={testDataId === "someFailed"}
        >
          Some failed
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setTestDataId("allFailed")}
          disabled={testDataId === "allFailed"}
        >
          All failed
        </Button>

        <Button
          variant="destructive"
          size="sm"
          onClick={() => setTestDataId("")}
          disabled={testDataId === ""}
        >
          Clear
        </Button>
      </div>

      <Box
        gap="md"
        direction="row"
        align="center"
        justify="space-between"
        wrap="wrap"
      >
        <Text as="div" size="sm" weight="regular">
          This log shows all contract-related events that occurred during the
          transaction in chronological order.
        </Text>

        <Box gap="xs" direction="row" align="center">
          <Label htmlFor="call-stack-params-toggle" size="sm">
            Collapsed view
          </Label>

          <Toggle
            id="call-stack-params-toggle"
            fieldSize="sm"
            checked={isCollapsedView}
            onChange={() => setIsCollapsedView(!isCollapsedView)}
          />
        </Box>
      </Box>

      {data.errorLevel === "all" ? (
        <Alert placement="inline" variant="error" title="Transaction failed">
          This transaction failed and was fully rolled back. All state changes
          were reverted, and no contract effects were applied.
        </Alert>
      ) : null}

      {data.errorLevel === "some" ? (
        <Alert
          placement="inline"
          variant="warning"
          title="Transaction partially failed"
        >
          This transaction succeeded, but some internal contract calls failed
          and their effects were rolled back.
        </Alert>
      ) : null}

      <div className="CallStackTrace">{renderNested(data.callStack)}</div>
    </Box>
  );
};

// =============================================================================
// Helpers
// =============================================================================
const isAsset = (value: unknown) => {
  return typeof value === "string" && value?.split(":")?.length === 2;
};

const renderAssetString = (value: string) => {
  if (isAsset(value)) {
    const [code, issuer] = value.split(":");

    return `${code}:${shortenStellarAddress(issuer)}}`;
  }

  return value;
};

// =============================================================================
// Components
// =============================================================================
const TypedValueItem = ({
  value,
  type,
  title,
}: {
  value: any;
  type?: string;
  title?: string;
}) => {
  const val =
    type && ["string", "symbol"].includes(type) ? (
      <Quotes>{renderAssetString(value)}</Quotes>
    ) : (
      `${value}`
    );

  return (
    <span
      className="CallStackTrace__typedValueItem"
      {...(type ? { "data-type": type === "symbol" ? "sym" : type } : {})}
      {...(title ? { title } : {})}
    >
      {val}
    </span>
  );
};

const AddressItem = ({
  value,
  networkId,
}: {
  value: any;
  networkId: NetworkType;
}) => {
  const seNetwork = getStellarExpertNetwork(networkId);
  const isContract = !getContractIdError(value);

  let linkEl: string | JSX.Element;

  // Stellar account on Futurnet or Custom network
  if (!isContract && !seNetwork) {
    linkEl = shortenStellarAddress(value);
  } else {
    const props = {
      href: isContract
        ? buildContractExplorerHref(value)
        : `${STELLAR_EXPERT}/${seNetwork}/account/${value}`,
      ...(isContract ? { target: "_blank" } : {}),
    };

    linkEl = (
      <SdsLink variant="secondary" {...props} isUnderline>
        {shortenStellarAddress(value)}
      </SdsLink>
    );
  }

  return (
    <span
      className="CallStackTrace__typedValueItem"
      data-type="address"
      title={value}
    >
      {linkEl}
    </span>
  );
};

const Comma = ({ enabled }: { enabled?: boolean }) => {
  if (enabled) {
    return <span className="CallStackTrace__comma">,</span>;
  }

  return null;
};

const Colon = () => {
  return <span className="CallStackTrace__colon">:</span>;
};

const Bracket = ({
  char,
  hasComma,
}: {
  char: "{" | "}" | "[" | "]" | "(" | ")";
  hasComma?: boolean;
}) => (
  <span className="CallStackTrace__bracket">
    {char}
    {hasComma ? <Comma /> : null}
  </span>
);

const Quotes = ({ children }: { children: React.ReactNode }) => (
  <>
    <span className="CallStackTrace__quotes">{'"'}</span>
    {children}
    <span className="CallStackTrace__quotes">{'"'}</span>
  </>
);

const EventItem = ({
  event,
  renderContent,
  renderNested,
}: {
  event: ProcessedEvent;
  renderContent: (event: ProcessedEvent) => JSX.Element;
  renderNested: (events: ProcessedEvent[], parentId?: string) => JSX.Element[];
}) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <>
      <div className="CallStackTrace__event__info">
        <span
          className="CallStackTrace__icon"
          data-visible={event.nested.length > 0}
          data-is-expanded={isExpanded}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Icon.ChevronDown />
        </span>

        {event.isError ? (
          <span className="CallStackTrace__itemError CallStackTrace__icon">
            <Icon.XCircle />
          </span>
        ) : null}

        <span className="CallStackTrace__itemType" data-type={event.type}>
          {event.type}
        </span>

        {renderContent(event)}
      </div>

      {event.nested.length && isExpanded ? (
        <div className="CallStackTrace__event__nested">
          {renderNested(event.nested)}
        </div>
      ) : null}
    </>
  );
};
