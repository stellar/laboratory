import each from "lodash/each";
import { operationsMap } from "../../data/operations.js";
import { SelectPicker } from "./SelectPicker";

let operationItemMap: Record<string, string> = {};
each(operationsMap, (op) => {
  operationItemMap[op.name] = op.label;
});

interface OperationTypePickerProps {
  value: string;
  onUpdate: (val: any) => void;
}

export const OperationTypePicker = ({
  value,
  onUpdate,
}: OperationTypePickerProps) => (
  <SelectPicker
    value={value}
    onUpdate={onUpdate}
    placeholder="Select operation type"
    items={operationItemMap}
  />
);
