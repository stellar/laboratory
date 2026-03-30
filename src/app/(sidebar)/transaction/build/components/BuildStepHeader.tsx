import { Link, Text } from "@stellar/design-system";

import { Box } from "@/components/layout/Box";
import { PageHeader } from "@/components/layout/PageHeader";

interface BuildStepHeaderProps {
  /** Step title displayed on the left. */
  heading: string;
  /** Semantic heading element for the page header. */
  headingAs?: "h1" | "h2";
  /** Callback for resetting the entire transaction build flow. */
  onClearAll: () => void;
  /** Optional class for the clear-all link to support page-specific styles. */
  clearAllLinkClassName?: string;
}

/**
 * Shared header for transaction build steps with a Clear all action.
 *
 * @example
 * <BuildStepHeader heading="Submit transaction" headingAs="h1" onClearAll={resetAll} />
 */
export const BuildStepHeader = ({
  heading,
  headingAs,
  onClearAll,
  clearAllLinkClassName,
}: BuildStepHeaderProps) => {
  return (
    <Box gap="md" direction="row" justify="space-between" align="center">
      <PageHeader heading={heading} as={headingAs} />

      <Link
        variant="primary"
        addlClassName={clearAllLinkClassName}
        onClick={onClearAll}
        size="xs"
      >
        Clear all
      </Link>
    </Box>
  );
};
