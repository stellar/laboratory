import { Icon, Text } from "@stellar/design-system";

import { CardGrid } from "@/components/Home/CardGrid";
import { Routes } from "@/constants/routes";
import { trackEvent, TrackingEvent } from "@/metrics/tracking";

const START_BUILDING: {
  id: string;
  title: string;
  description: string;
  route: string;
}[] = [
  {
    id: "fund-account",
    title: "Fund account",
    description: "Fund a test account.",
    route: Routes.ACCOUNT_FUND,
  },
  {
    id: "build-transaction",
    title: "Build a transaction",
    description: "Build, simulate, sign, and submit a transaction.",
    route: Routes.BUILD_TRANSACTION,
  },
  {
    id: "deploy-contract",
    title: "Deploy a smart contract",
    description: "Upload a WASM file and deploy it on Stellar.",
    route: Routes.SMART_CONTRACTS_DEPLOY_CONTRACT,
  },
  {
    id: "sign-message",
    title: "Sign message",
    description: "Sign a message with a Stellar account.",
    route: Routes.SIGN_MESSAGE,
  },
];

export const StartBuilding = () => (
  <CardGrid columns={4} addlClassName="StartBuilding">
    {START_BUILDING.map((item) => (
      <CardGrid.Cell
        key={item.id}
        href={item.route}
        addlClassName="StartBuilding__cell"
        onClick={() =>
          trackEvent(TrackingEvent.HOME_START_BUILDING, { card: item.id })
        }
      >
        <div className="StartBuilding__heading">
          <Text as="div" size="sm" weight="medium">
            {item.title}
          </Text>
          <Icon.ArrowRight />
        </div>

        <Text as="p" size="sm" addlClassName="StartBuilding__description">
          {item.description}
        </Text>
      </CardGrid.Cell>
    ))}
  </CardGrid>
);
