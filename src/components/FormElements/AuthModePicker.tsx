import { Select } from "@stellar/design-system";

import { AuthModeType } from "@/types/types";

const AUTH_MODE_OPTIONS: { id: string; label: string }[] = [
  { id: "record", label: "Record" },
  { id: "enforce", label: "Enforce" },
  // 'record_allow_nonroot' is what simulation expects for non-root auth entries
  { id: "record_allow_nonroot", label: "Record (allow non-root)" },
];

/**
 * Reusable auth mode selector for simulation and validation steps.
 *
 * @param id - HTML id for the select element
 * @param value - Currently selected auth mode
 * @param onChange - Callback when the auth mode changes
 * @param note - Optional note text (React node) displayed below the select
 *
 * @example
 * <AuthModePicker
 *   id="simulate-auth-mode"
 *   value={authMode}
 *   onChange={(mode) => setAuthMode(mode)}
 *   note={<>Explanation text.</>}
 * />
 */
export const AuthModePicker = ({
  id,
  value,
  onChange,
  note,
}: {
  id: string;
  value: AuthModeType | string;
  onChange: (mode: AuthModeType) => void;
  note?: React.ReactNode;
}) => (
  <Select
    id={id}
    fieldSize="md"
    label="Auth mode"
    value={value}
    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
      onChange(e.target.value as AuthModeType);
    }}
    note={note}
  >
    {AUTH_MODE_OPTIONS.map((opt) => (
      <option key={opt.id} value={opt.id}>
        {opt.label}
      </option>
    ))}
  </Select>
);
