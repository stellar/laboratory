import { Alert, Card, Icon, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import "../ValidationResponseCard/styles.scss";

type NewValidationResponseCard = {
  variant: "primary" | "success" | "error";
  response: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  note?: string | React.ReactNode;
  footerLeftEl?: React.ReactNode;
  footerRightEl?: React.ReactNode;
};

/**
 * Updated validation response card for the new transaction flow.
 * Replaces the title with an inline Alert banner. Will eventually
 * replace ValidationResponseCard once all consumers are migrated.
 *
 * @example
 * <NewValidationResponseCard
 *   variant="success"
 *   response={<div>XDR content here</div>}
 *   footerRightEl={<ViewInXdrButton xdrBlob={xdr} />}
 * />
 */
export const NewValidationResponseCard = ({
  variant,
  response,
  subtitle,
  note,
  footerLeftEl,
  footerRightEl,
}: NewValidationResponseCard) => {
  return (
    <Card>
      <Box
        direction="column"
        gap="md"
        addlClassName="ValidationResponseCard"
        data-variant={variant}
      >
        {/* @TODO to update the SDS design system */}
        <Alert
          placement="inline"
          variant="success"
          title="Your transaction envelope XDR is ready."
          icon={<Icon.CheckCircle />}
        >
          {""}
        </Alert>

        {subtitle ? (
          <Text
            as="div"
            size="xs"
            weight="medium"
            addlClassName="ValidationResponseCard__subtitle"
          >
            {subtitle}
          </Text>
        ) : null}

        <Card variant="secondary" noPadding>
          <div className="ValidationResponseCard__content">{response}</div>
        </Card>

        {footerLeftEl || footerRightEl || note ? (
          <Box gap="lg">
            <>
              {note ? (
                <Text
                  as="div"
                  size="xs"
                  weight="regular"
                  addlClassName="ValidationResponseCard__note"
                >
                  {note}
                </Text>
              ) : null}

              {footerLeftEl || footerRightEl ? (
                <Box
                  gap="sm"
                  direction="row"
                  align="center"
                  justify={footerLeftEl && footerRightEl ? "space-between" : footerRightEl ? "end" : "left"}
                  addlClassName="ValidationResponseCard__footer"
                  wrap="wrap"
                >
                  <>
                    {footerLeftEl ? (
                      <Box
                        gap="sm"
                        direction="row"
                        addlClassName="ValidationResponseCard__footer--leftEl"
                        wrap="wrap"
                      >
                        <>{footerLeftEl}</>
                      </Box>
                    ) : null}

                    {footerRightEl ? (
                      <Box
                        gap="sm"
                        direction="row"
                        justify="right"
                        addlClassName="ValidationResponseCard__footer--rightEl"
                        wrap="wrap"
                      >
                        <>{footerRightEl}</>
                      </Box>
                    ) : null}
                  </>
                </Box>
              ) : null}
            </>
          </Box>
        ) : null}
      </Box>
    </Card>
  );
};
