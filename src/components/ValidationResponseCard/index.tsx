import { Card, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import "./styles.scss";

type ValidationResponseCard = {
  variant: "primary" | "success" | "error";
  title: string | React.ReactNode;
  response: string | React.ReactNode;
  subtitle?: string | React.ReactNode;
  note?: string | React.ReactNode;
  footerLeftEl?: React.ReactNode;
  footerRightEl?: React.ReactNode;
};

export const ValidationResponseCard = ({
  variant,
  title,
  response,
  subtitle,
  note,
  footerLeftEl,
  footerRightEl,
}: ValidationResponseCard) => {
  return (
    <Card>
      <Box
        gap="xs"
        addlClassName="ValidationResponseCard"
        data-variant={variant}
      >
        <>
          <Text
            as="div"
            size="sm"
            weight="medium"
            addlClassName="ValidationResponseCard__title"
          >
            {title}
          </Text>
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
                    justify="space-between"
                  >
                    <>
                      {footerLeftEl ? (
                        <Box gap="sm" direction="row">
                          <>{footerLeftEl}</>
                        </Box>
                      ) : null}

                      {footerRightEl ? (
                        <Box gap="sm" direction="row" justify="right">
                          <>{footerRightEl}</>
                        </Box>
                      ) : null}
                    </>
                  </Box>
                ) : null}
              </>
            </Box>
          ) : null}
        </>
      </Box>
    </Card>
  );
};
