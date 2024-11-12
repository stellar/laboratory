import { Button, Icon, CopyText } from "@stellar/design-system";

export const CopyJsonPayloadButton = ({
  jsonString,
}: {
  jsonString: string;
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
      >
        Copy JSON
      </Button>
    </CopyText>
  );
};
