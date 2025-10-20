import { Heading, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";

export const HomeSection = ({
  title,
  eyebrow,
  description,
  children,
}: {
  title?: string;
  eyebrow?: string;
  description?: React.ReactNode;
  children?: React.ReactElement | React.ReactElement[];
}) => (
  <div className="Lab__home__section" data-no-padding="true">
    <Box gap="xl" addlClassName="Lab__home__content">
      {eyebrow || title || description ? (
        <Box gap="xs">
          {eyebrow ? <div className="Lab__home__eyebrow">{eyebrow}</div> : null}
          {title ? (
            <Heading as="h2" size="xs" weight="semi-bold">
              {title}
            </Heading>
          ) : null}
          {description ? (
            <Text size="md" as="p">
              {description}
            </Text>
          ) : null}
        </Box>
      ) : null}

      {children}
    </Box>
  </div>
);
