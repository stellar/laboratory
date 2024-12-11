import { Label, Toggle } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { localStorageSettings } from "@/helpers/localStorageSettings";
import { SETTINGS_CODE_WRAP } from "@/constants/settings";

export const JsonCodeWrapToggle = ({
  isChecked,
  onChange,
}: {
  isChecked: boolean;
  onChange: (isChecked: boolean) => void;
}) => {
  return (
    <Box gap="sm" direction="row" align="center">
      <Label htmlFor="json-code-wrap-toggle" size="sm">
        Wrap Code
      </Label>
      <Toggle
        id="json-code-wrap-toggle"
        fieldSize="sm"
        title="test"
        onChange={() => {
          const newValue = !isChecked;

          onChange(newValue);

          localStorageSettings.set({
            key: SETTINGS_CODE_WRAP,
            value: newValue.toString(),
          });
        }}
        checked={isChecked}
      />
    </Box>
  );
};
