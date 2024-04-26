import { Card, Text } from "@stellar/design-system";
import { Box } from "@/components/layout/Box";
import "./styles.scss";

type ErrorListCardProps = {
  title: string;
  errorList: (string | React.ReactNode)[];
};

export const ErrorListCard = ({ title, errorList }: ErrorListCardProps) => {
  return (
    <Card>
      <Box gap="xs" addlClassName="ErrorListCard">
        <Text as="div" size="sm" weight="medium">
          {title}
        </Text>
        <>
          {errorList.length > 0 ? (
            <Card variant="secondary" noPadding>
              <ul className="ErrorListCard__errors">
                {errorList.map((e, i) => (
                  <li key={`e-${i}`}>{e}</li>
                ))}
              </ul>
            </Card>
          ) : null}
        </>
      </Box>
    </Card>
  );
};
