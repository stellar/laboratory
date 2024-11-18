import { Card } from "@stellar/design-system";
import { PageHeader } from "./PageHeader";

export const PageCard = ({
  heading,
  headingInfoLink,
  headingAs = "h1",
  children,
  rightElement,
}: {
  heading?: React.ReactNode;
  headingInfoLink?: string;
  headingAs?: "h1" | "h2";
  children: React.ReactNode;
  rightElement?: React.ReactNode;
}) => (
  <Card>
    <div className="PageBody">
      {heading || rightElement ? (
        <PageHeader
          heading={heading}
          headingInfoLink={headingInfoLink}
          rightElement={rightElement}
          as={headingAs}
        />
      ) : null}

      {children}
    </div>
  </Card>
);
