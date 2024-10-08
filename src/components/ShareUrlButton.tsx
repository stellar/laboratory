import { Button, CopyText, Icon } from "@stellar/design-system";

export const ShareUrlButton = ({ shareableUrl }: { shareableUrl: string }) => {
  return (
    <CopyText
      textToCopy={shareableUrl}
      title="Share"
      doneLabel="Copied shareable URL"
    >
      <Button
        size="md"
        variant="tertiary"
        icon={<Icon.Share01 />}
        type="button"
      ></Button>
    </CopyText>
  );
};
