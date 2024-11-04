import { PrettyJson } from "@/components/PrettyJson";
import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";
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
      <LabelHeading size="md">{label}</LabelHeading>
      <div className="PrettyJsonTextarea__json">
        <PrettyJson json={json} isCollapsible={false} />
      </div>
    </Box>
  );
};
