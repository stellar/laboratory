import { Text } from "@stellar/design-system";

export const ErrorText = ({
  errorMessage,
  size,
}: {
  errorMessage: string;
  size: "sm" | "md" | "lg";
}) => {
  return (
    <Text as="div" size={size} addlClassName="FieldNote--error">
      {errorMessage}
    </Text>
  );
};
