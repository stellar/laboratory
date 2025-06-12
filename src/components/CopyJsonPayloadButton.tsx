import { Button, Icon, CopyText } from "@stellar/design-system";

export const CopyJsonPayloadButton = ({
  jsonString,
  label = "Copy JSON",
  isDisabled,
}: {
  jsonString: string;
  label?: string;
  isDisabled?: boolean;
}) => {
  return (
    <CopyText textToCopy={jsonString}>
      <Button
        size="md"
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
