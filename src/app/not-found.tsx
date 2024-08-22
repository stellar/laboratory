"use client";

import { useRouter } from "next/navigation";
import { Button, Card, Heading, Icon, Text } from "@stellar/design-system";

import { Routes } from "@/constants/routes";
import { LayoutContentContainer } from "@/components/layout/LayoutContentContainer";
import { Box } from "@/components/layout/Box";

export default function NotFound() {
  const router = useRouter();

  const handleBackClick = () => {
    router.push(Routes.ROOT);
  };

  return (
    <LayoutContentContainer>
      <Card>
        <Box gap="xl" align="start">
          <Box gap="md">
            <Heading as="h2" size="xs" weight="medium">
              Error 404 - Page not found
            </Heading>

            <Text size="sm" as="p">
              Oops! The page you’re looking for doesn’t exist. It might have
              been removed, had its name changed, or is temporarily unavailable.
            </Text>
          </Box>

          <Button
            size="sm"
            variant="secondary"
            icon={<Icon.ArrowLeft />}
            iconPosition="left"
            onClick={handleBackClick}
          >
            Back to home
          </Button>
        </Box>
      </Card>
    </LayoutContentContainer>
  );
}
