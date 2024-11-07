import { Button, Icon, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { formatTimestamp } from "@/helpers/formatTimestamp";

export const SavedItemTimestampAndDelete = ({
  timestamp,
  onDelete,
}: {
  timestamp: number;
  onDelete: () => void;
}) => {
  return (
    <>
      <Box gap="sm" direction="row" align="center" justify="end">
        <Text
          as="div"
          size="xs"
        >{`Last saved ${formatTimestamp(timestamp)}`}</Text>

        <Button
          size="md"
          variant="error"
          icon={<Icon.Trash01 />}
          type="button"
          onClick={onDelete}
        ></Button>
      </Box>
    </>
  );
};
