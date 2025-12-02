import { Card, Icon, Link, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { getTxResourceBreakdown } from "@/helpers/getTxResourceBreakdown";

import { RpcTxJsonResponse } from "@/types/types";
import { formatNumber } from "@/helpers/formatNumber";

export const ResourceProfiler = ({
  txDetails,
}: {
  txDetails: RpcTxJsonResponse | null | undefined;
}) => {
  if (!txDetails) {
    return null;
  }

  const data = getTxResourceBreakdown(txDetails);

  type ItemGroup = {
    id: string;
    title: string;
    items: Item[];
  };

  type Item = {
    id: string;
    label: string;
    value: number;
    valueEntity?: string[];
    limit?: string;
    usage?: string;
  };

  const itemGroups: ItemGroup[] = [
    {
      id: "cpu-and-memory",
      title: "CPU and memory",
      items: [
        {
          id: "cpu-instructions",
          label: "CPU instructions",
          value: data.instructions,
          limit: data.instructions_network_limit_display,
          usage: data.instructions_usage_percent,
        },
        {
          id: "memory-usage",
          label: "Memory usage",
          value: data.memory_usage,
          valueEntity: ["B"],
          limit: data.memory_usage_network_limit_display,
          usage: data.memory_usage_usage_percent,
        },
      ],
    },
    {
      id: "footprint",
      title: "Footprint",
      items: [
        {
          id: "footprint-keys-read-only",
          label: "Footprint keys read only",
          value: data.footprint_keys_read_only,
        },
        {
          id: "footprint-keys-read-write ",
          label: "Footprint keys read write",
          value: data.footprint_keys_read_write,
        },
        {
          id: "footprint-keys-total",
          label: "Footprint keys total",
          value: data.footprint_keys_total,
          limit: data.footprint_keys_total_network_limit_display,
          usage: data.footprint_keys_total_usage_percent,
        },
      ],
    },
    {
      id: "ledger-io",
      title: "Ledger I/O",
      items: [
        {
          id: "entries-read",
          label: "Entries read",
          value: data.entries_read,
          valueEntity: ["entry", "entries"],
          limit: data.entries_read_network_limit_display,
          usage: data.entries_read_usage_percent,
        },
        {
          id: "entries-write",
          label: "Entries write",
          value: data.entries_write,
          valueEntity: ["entry", "entries"],
          limit: data.entries_write_network_limit_display,
          usage: data.entries_write_usage_percent,
        },
        {
          id: "ledger-read",
          label: "Ledger read",
          value: data.ledger_read,
          valueEntity: ["B"],
          limit: data.ledger_read_network_limit_display,
          usage: data.ledger_read_usage_percent,
        },
        {
          id: "ledger-write",
          label: "Ledger write",
          value: data.ledger_write,
          valueEntity: ["B"],
          limit: data.ledger_write_network_limit_display,
          usage: data.ledger_write_usage_percent,
        },
      ],
    },
    {
      id: "data-io",
      title: "Data I/O",
      items: [
        {
          id: "data-read",
          label: "Data read",
          value: data.data_read,
          valueEntity: ["B"],
        },
        {
          id: "data-write",
          label: "Data write",
          value: data.data_write,
          valueEntity: ["B"],
        },
        {
          id: "key-read",
          label: "Key read",
          value: data.key_read,
          valueEntity: ["B"],
        },
        {
          id: "key-write",
          label: "Key write",
          value: data.key_write,
          valueEntity: ["B"],
        },
        {
          id: "code-read",
          label: "Code read",
          value: data.code_read,
          valueEntity: ["B"],
        },
        {
          id: "code-write",
          label: "Code write",
          value: data.code_write,
          valueEntity: ["B"],
        },
      ],
    },
    {
      id: "events",
      title: "Events",
      items: [
        {
          id: "emit-event-count",
          label: "Emit event count",
          value: data.emit_event_count,
        },
        {
          id: "emit-event-bytes",
          label: "Emit event bytes",
          value: data.emit_event_bytes,
          valueEntity: ["B"],
          limit: data.emit_event_bytes_network_limit_display,
          usage: data.emit_event_bytes_usage_percent,
        },
      ],
    },
    {
      id: "execution-metrics",
      title: "Execution metrics",
      items: [
        {
          id: "invoke-time",
          label: "Invoke time",
          value: data.invoke_time,
          valueEntity: ["ns"],
        },
      ],
    },
  ];

  const formatValue = (value: number, valueEntity?: string[]) => {
    if (!valueEntity) {
      return formatNumber(value);
    }

    if (valueEntity.length === 1) {
      return `${formatNumber(value)} ${valueEntity[0]}`;
    }

    return `${formatNumber(value)} ${value === 1 ? valueEntity[0] : valueEntity[1]}`;
  };

  return (
    <Card>
      <Box gap="lg">
        <Text as="h3" size="md" weight="medium">
          Resources
        </Text>

        <div className="TransactionResourceProfiler__items">
          {itemGroups.map((group) => (
            <div
              key={group.id}
              className="TransactionResourceProfiler__item"
              data-testid={`${group.id}-item`}
            >
              <div className="TransactionResourceProfiler__item__header">
                <Text as="div" size="xs" weight="medium">
                  {group.title}
                </Text>

                <Text as="div" size="xs" weight="medium">
                  Used
                </Text>
              </div>

              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="TransactionResourceProfiler__item__container"
                >
                  <div className="TransactionResourceProfiler__item__row">
                    <div>{item.label}</div>
                    <div className="TransactionResourceProfiler__item__value">{`${formatValue(item.value, item.valueEntity)}`}</div>
                  </div>
                  {item?.limit && item?.usage ? (
                    <div
                      className="TransactionResourceProfiler__item__row"
                      data-limit
                    >
                      <div>{`(limit: ${item.limit})`}</div>
                      <div>{`${item.usage} used`}</div>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          ))}
        </div>

        <Link
          href="https://developers.stellar.org/docs/networks/resource-limits-fees"
          icon={<Icon.LinkExternal01 />}
          size="sm"
        >
          Resource limits & fees
        </Link>
      </Box>
    </Card>
  );
};
