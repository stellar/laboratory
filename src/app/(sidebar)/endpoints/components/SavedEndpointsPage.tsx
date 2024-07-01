import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  CopyText,
  Icon,
  Input,
  Modal,
  Text,
} from "@stellar/design-system";
import { TabView } from "@/components/TabView";
import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { NextLink } from "@/components/NextLink";

import { NetworkOptions } from "@/constants/settings";
import { Routes } from "@/constants/routes";
import { localStorageSavedEndpointsHorizon } from "@/helpers/localStorageSavedEndpointsHorizon";
import { arrayItem } from "@/helpers/arrayItem";
import { formatTimestamp } from "@/helpers/formatTimestamp";
import { useStore } from "@/store/useStore";
import {
  Network,
  SavedEndpointHorizon,
  LocalStorageSavedNetwork,
} from "@/types/types";

export const SavedEndpointsPage = () => {
  const { endpoints, network, selectNetwork, updateIsDynamicNetworkSelect } =
    useStore();
  const { saved, updateSavedActiveTab, setParams } = endpoints;
  const router = useRouter();

  const [savedEndpoints, setSavedEndpoints] = useState<SavedEndpointHorizon[]>(
    [],
  );
  const [isNetworkChangeModalVisible, setIsNetworkChangeModalVisible] =
    useState(false);
  const [currentEndpointIndex, setCurrentEndpointIndex] = useState<
    number | undefined
  >();

  useEffect(() => {
    setSavedEndpoints(localStorageSavedEndpointsHorizon.get());
  }, []);

  const getNetworkConfig = (
    network: LocalStorageSavedNetwork,
  ): Network | undefined => {
    const defaults = NetworkOptions.find((n) => n.id === network.id);

    switch (network.id) {
      case "testnet":
      case "futurenet":
        return defaults;
      case "mainnet":
        return defaults
          ? { ...defaults, rpcUrl: network.rpcUrl || "" }
          : undefined;
      case "custom":
        return defaults
          ? {
              ...defaults,
              horizonUrl: network.horizonUrl || "",
              rpcUrl: network.rpcUrl || "",
              passphrase: network.passphrase || "",
            }
          : undefined;
      default:
        return undefined;
    }
  };

  const handleViewHorizonEndpoint = (
    endpoint: SavedEndpointHorizon,
    index: number,
  ) => {
    if (network.id !== endpoint.network.id) {
      setCurrentEndpointIndex(index);
      return setIsNetworkChangeModalVisible(true);
    }

    handleHorizonEndpointAction(endpoint);
  };

  const handleHorizonEndpointAction = (
    endpoint: SavedEndpointHorizon,
    isNetworkChange?: boolean,
  ) => {
    if (isNetworkChange) {
      const newNetwork = getNetworkConfig(endpoint.network);

      if (newNetwork) {
        updateIsDynamicNetworkSelect(true);
        selectNetwork(newNetwork);
      }
    }

    setParams(endpoint.params);
    router.push(endpoint.route);
  };

  const HorizonEndpoints = () => {
    if (savedEndpoints.length === 0) {
      return <Card>There are no saved Horizon Endpoints</Card>;
    }

    return (
      <Card>
        <Box gap="md">
          {savedEndpoints.map((e, idx) => (
            <Box
              gap="sm"
              key={`horizon-${e.timestamp}`}
              addlClassName="PageBody__content"
            >
              <div className="Endpoints__urlBar">
                <Input
                  id={`endpoint-url-${e.timestamp}`}
                  fieldSize="md"
                  value={e.url}
                  readOnly
                  leftElement={
                    <InputSideElement
                      variant="text"
                      placement="left"
                      addlClassName="Endpoints__urlBar__requestMethod"
                    >
                      {e.method}
                    </InputSideElement>
                  }
                />
              </div>

              <Box
                gap="lg"
                direction="row"
                align="center"
                justify="space-between"
              >
                <Box gap="sm" direction="row">
                  <Button
                    size="md"
                    variant="tertiary"
                    type="button"
                    onClick={() => handleViewHorizonEndpoint(e, idx)}
                  >
                    View
                  </Button>

                  <CopyText textToCopy={e.url}>
                    <Button
                      size="md"
                      variant="tertiary"
                      icon={<Icon.Copy01 />}
                      type="button"
                    ></Button>
                  </CopyText>
                </Box>

                <Box gap="sm" direction="row" align="center" justify="end">
                  <Text
                    as="div"
                    size="xs"
                  >{`Last saved ${formatTimestamp(e.timestamp)}`}</Text>

                  <Button
                    size="md"
                    variant="error"
                    icon={<Icon.Trash01 />}
                    type="button"
                    onClick={() => {
                      const updatedList = arrayItem.delete(savedEndpoints, idx);

                      localStorageSavedEndpointsHorizon.set(updatedList);
                      setSavedEndpoints(updatedList);
                    }}
                  ></Button>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      </Card>
    );
  };

  const RpcEndpoints = () => {
    return <Card>Coming soon</Card>;
  };

  return (
    <Box gap="md">
      <TabView
        heading={{ title: "Saved Endpoints" }}
        tab1={{
          id: "rpc",
          label: "RPC Endpoints",
          content: saved.activeTab === "rpc" ? <RpcEndpoints /> : null,
        }}
        tab2={{
          id: "horizon",
          label: "Horizon Endpoints",
          content: saved.activeTab === "horizon" ? <HorizonEndpoints /> : null,
        }}
        activeTabId={saved.activeTab}
        onTabChange={(id) => {
          updateSavedActiveTab(id);
        }}
      />

      <Alert
        variant="primary"
        title="Looking for your saved transactions?"
        placement="inline"
      >
        <NextLink href={Routes.SAVED_TRANSACTIONS} sds-variant="primary">
          See saved transactions
        </NextLink>
      </Alert>

      <Modal
        visible={
          isNetworkChangeModalVisible && currentEndpointIndex !== undefined
        }
        onClose={() => {
          setIsNetworkChangeModalVisible(false);
        }}
      >
        <Modal.Heading>Endpoint On Different Network</Modal.Heading>
        <Modal.Body>
          {`You are currently on ${network?.label} network. This endpoint is on ${savedEndpoints[currentEndpointIndex!]?.network?.label} network.`}
        </Modal.Body>
        <Modal.Footer>
          <Button
            size="md"
            variant="tertiary"
            onClick={() => {
              setIsNetworkChangeModalVisible(false);
            }}
          >
            Cancel
          </Button>
          <Button
            size="md"
            variant="primary"
            onClick={() => {
              const endpoint =
                currentEndpointIndex !== undefined &&
                savedEndpoints[currentEndpointIndex];

              if (endpoint) {
                handleHorizonEndpointAction(endpoint, true);
              }
            }}
          >
            Change network
          </Button>
        </Modal.Footer>
      </Modal>
    </Box>
  );
};
