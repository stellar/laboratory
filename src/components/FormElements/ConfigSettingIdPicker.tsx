import { Select } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";

import { ConfigSettingIdType } from "@/types/types";

type ConfigSettingIdPickerProps = {
  id: string;
  value: string | undefined;
  onChange: (value: ConfigSettingIdType | undefined) => void;
  error: string | undefined;
  disabled?: boolean;
};

export const ConfigSettingIdPicker = ({
  id,
  value,
  onChange,
  disabled,
}: ConfigSettingIdPickerProps) => {
  const configSettingType: { id: ConfigSettingIdType; label: string }[] = [
    {
      id: "contract_max_size_bytes",
      label: "Config Setting Contract Max Size Bytes",
    },
    {
      id: "contract_compute_v0",
      label: "Config Setting Contract Compute v0",
    },
    {
      id: "contract_ledger_cost_v0",
      label: "Config Setting Contract Ledger Cost v0",
    },
    {
      id: "contract_historical_data_v0",
      label: "Config Setting Contract Historical Data v0",
    },
    {
      id: "contract_events_v0",
      label: "Config Setting Contract Events v0",
    },
    {
      id: "contract_bandwidth_v0",
      label: "Config Setting Contract Bandwidth v0",
    },
    {
      id: "contract_cost_params_cpu_instructions",
      label: "Config Setting Contract Cost Params CPU Instructions",
    },
    {
      id: "contract_cost_params_memory_bytes",
      label: "Config Setting Contract Cost Params Memory Bytes",
    },
    {
      id: "contract_data_key_size_bytes",
      label: "Config Setting Contract Data Key Size Bytes",
    },
    {
      id: "contract_data_entry_size_bytes",
      label: "Config Setting Contract Data Entry Size Bytes",
    },
    {
      id: "state_archival",
      label: "Config Setting State Archival",
    },
    {
      id: "contract_execution_lanes",
      label: "Config Setting Contract Execution Lanes",
    },
    {
      id: "live_soroban_state_size_window",
      label: "Config Setting Live Soroban State Size Window",
    },
    {
      id: "eviction_iterator",
      label: "Config Setting Eviction Iterator",
    },
    {
      id: "contract_parallel_compute_v0",
      label: "Config Setting Contract Parallel Compute v0",
    },
    {
      id: "contract_ledger_cost_ext_v0",
      label: "Config Setting Contract Ledger Cost Ext v0",
    },
    {
      id: "scp_timing",
      label: "Config Setting SCP Timing",
    },
  ];

  return (
    <Box gap="sm">
      <Select
        id={`${id}-type`}
        fieldSize="md"
        label="Config setting ID"
        value={value}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
          const val = e.target.value as ConfigSettingIdType;

          if (val) {
            onChange(val);
          } else {
            onChange(undefined);
          }
        }}
        disabled={disabled}
      >
        <option value="">Select Config Setting ID</option>

        {configSettingType.map((f) => (
          <option key={f.id} value={f.id}>
            {f.label}
          </option>
        ))}
      </Select>
    </Box>
  );
};
