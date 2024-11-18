import { Text } from "@stellar/design-system";
import { WithInfoText } from "@/components/WithInfoText";

export const PageHeader = ({
  heading,
  headingInfoLink,
  rightElement,
  as = "h1",
}: {
  heading: React.ReactNode | undefined;
  headingInfoLink?: string;
  rightElement?: React.ReactNode;
  as?: "h1" | "h2";
}) => {
  const renderHeading = (content: React.ReactNode) => {
    if (headingInfoLink) {
      return <WithInfoText href={headingInfoLink}>{content}</WithInfoText>;
    }

    return content;
  };

  return (
    <div className="PageHeader">
      {heading
        ? renderHeading(
            <Text size={as === "h1" ? "lg" : "md"} as={as} weight="medium">
              {heading}
            </Text>,
          )
        : null}

      {rightElement ?? null}
    </div>
  );
};
