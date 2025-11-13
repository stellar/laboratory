import { Button, Icon, CopyText } from "@stellar/design-system";

export const CopyJsonPayloadButton = ({
  jsonString,
  label = "Copy JSON",
  size = "md",
  isDisabled,
}: {
  jsonString: string;
  label?: string;
  size?: "sm" | "md" | "lg" | "xl";
  isDisabled?: boolean;
}) => {
  return (
    <CopyText textToCopy={jsonString}>
      <Button
        size={size}
        variant="tertiary"
        icon={<Icon.Copy01 />}
        iconPosition="left"
        onClick={(e) => {
          e.preventDefault();
        }}
        disabled={isDisabled}
      >
        {label}
      </Button>
    </CopyText>
  );
};
