import { Label } from "@stellar/design-system";
import { PrettyJson } from "@/components/PrettyJson";
import { Box } from "@/components/layout/Box";
import { AnyObject } from "@/types/types";
import "./styles.scss";

export const PrettyJsonTextarea = ({
  json,
  label,
}: {
  json: AnyObject;
  label: string;
}) => {
  return (
    <Box gap="sm" addlClassName="PrettyJsonTextarea">
      <Label htmlFor="" size="md">
        {label}
      </Label>
      <div className="PrettyJsonTextarea__json">
        <PrettyJson json={json} isCollapsible={false} />
      </div>
    </Box>
  );
};
