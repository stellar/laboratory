"use client";
import * as Sentry from "@sentry/nextjs";
import type { NextPage } from "next";
import type { ErrorProps } from "next/error";
import NextError from "next/error";

import { Button, Card, Heading, Icon, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import { openUrl } from "@/helpers/openUrl";

const Error: NextPage<ErrorProps> = () => (
  <>
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
  </>
);

Error.getInitialProps = async (contextData) => {
  // In case this is running in a serverless function, await this in order to give Sentry
  // time to send the error before the lambda exits
  await Sentry.captureUnderscoreErrorException(contextData);
  // This will contain the status code of the response
  return NextError.getInitialProps(contextData);
};

export default Error;
