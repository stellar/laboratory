import { Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

/**
 * Section heading for the landing page.
 *
 * Distinct from `HomeSection` (Section.tsx): that component always renders an
 * eyebrow slot and an h2 at Heading size "xs", and wraps its children in its
 * own padded container. The redesigned homepage has no eyebrow, sets its
 * headings at Text size "lg", and controls section spacing at the page level.
 */
export const SectionHeader = ({
  title,
  description,
}: {
  title: string;
  description?: string;
}) => (
  <Box gap="xs" addlClassName="SectionHeader">
    <Text as="h2" size="lg" weight="medium">
      {title}
    </Text>

    {description ? (
      <Text as="p" size="sm" addlClassName="SectionHeader__description">
        {description}
      </Text>
    ) : null}
  </Box>
);
