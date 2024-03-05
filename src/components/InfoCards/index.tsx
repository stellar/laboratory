import { Button, Card, Text } from "@stellar/design-system";
import { InfoCard } from "@/types/types";
import "./styles.scss";

export const InfoCards = ({ infoCards }: { infoCards: InfoCard[] }) => {
  return (
    <div className="InfoCards">
      {infoCards.map((c) => (
        <Card key={c.id}>
          <Text size="md" as="h2" weight="medium">
            {c.title}
          </Text>

          <Text size="sm" as="p">
            {c.description}
          </Text>

          <div>
            <Button
              variant="secondary"
              size="md"
              icon={c.buttonIcon}
              onClick={c.buttonAction}
            >
              {c.buttonLabel}
            </Button>
          </div>
        </Card>
      ))}
    </div>
  );
};
