"use client";

import { Button, Card, Heading, Icon, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { openUrl } from "@/helpers/openUrl";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  // TODO: track this in Sentry once set up
  console.log("Unhandled error: ", error);

  return (
    <Card>
      <Box gap="xl" align="start">
        <Box gap="md">
          <Heading as="h2" size="xs" weight="medium">
            Unhandled Error
          </Heading>

          <Text size="sm" as="p">
            Uh-oh, we didn’t handle this error. We would appreciate it if you
            opened an issue on GitHub, providing as many details as possible to
            help us fix this bug.
          </Text>
        </Box>

        <Box gap="md" direction="row">
          <Button
            size="sm"
            variant="secondary"
            icon={<Icon.ArrowLeft />}
            iconPosition="left"
            onClick={() => {
              location.reload();
            }}
          >
            Return
          </Button>

          <Button
            size="sm"
            variant="primary"
            iconPosition="left"
            onClick={() =>
              openUrl("https://github.com/stellar/laboratory/issues")
            }
          >
            Open Issue
          </Button>
        </Box>
      </Box>
    </Card>
  );
}
