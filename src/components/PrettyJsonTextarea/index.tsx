import { Box } from "@/components/layout/Box";
import { LabelHeading } from "@/components/LabelHeading";
import { CodeEditor } from "@/components/CodeEditor";
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
      <CodeEditor
        isAutoHeight
        value={JSON.stringify(json, null, 2)}
        selectedLanguage="json"
      />
    </Box>
  );
};
