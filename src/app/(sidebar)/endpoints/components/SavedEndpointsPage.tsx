import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Alert,
  Badge,
  Button,
  Card,
  Icon,
  Input,
  Modal,
  Text,
} from "@stellar/design-system";
import { TabView } from "@/components/TabView";
import { Box } from "@/components/layout/Box";
import { InputSideElement } from "@/components/InputSideElement";
import { NextLink } from "@/components/NextLink";
import { ShareUrlButton } from "@/components/ShareUrlButton";
import { PrettyJsonTextarea } from "@/components/PrettyJsonTextarea";
import { SavedItemTimestampAndDelete } from "@/components/SavedItemTimestampAndDelete";

import { Routes } from "@/constants/routes";
import { localStorageSavedEndpointsHorizon } from "@/helpers/localStorageSavedEndpointsHorizon";
import { localStorageSavedRpcMethods } from "@/helpers/localStorageSavedRpcMethods";
import { arrayItem } from "@/helpers/arrayItem";
import { formatTimestamp } from "@/helpers/formatTimestamp";
import { getNetworkById } from "@/helpers/getNetworkById";
import { useStore } from "@/store/useStore";
import {
  Network,
  SavedEndpointHorizon,
  SavedRpcMethod,
  LocalStorageSavedNetwork,
} from "@/types/types";

export const SavedEndpointsPage = () => {
  const { endpoints, network, selectNetwork, updateIsDynamicNetworkSelect } =
    useStore();
  const { saved, updateSavedActiveTab, setParams } = endpoints;
  const router = useRouter();

  const [savedEndpointsHorizon, setSavedEndpointsHorizon] = useState<
    SavedEndpointHorizon[]
  >([]);
  const [savedRpcMethods, setSavedRpcMethods] = useState<SavedRpcMethod[]>([]);
  const [expandedPayloadIndex, setExpandedPayloadIndex] = useState<{
    [key: number]: boolean;
  }>({});
  const [isNetworkChangeModalVisible, setIsNetworkChangeModalVisible] =
    useState(false);
  const [currentEndpointIndex, setCurrentEndpointIndex] = useState<
    number | undefined
  >();

  useEffect(() => {
    setSavedEndpointsHorizon(localStorageSavedEndpointsHorizon.get());
    setSavedRpcMethods(localStorageSavedRpcMethods.get());
  }, []);

  useEffect(() => {
    const mappedRpcIndex = savedRpcMethods.reduce(
      (acc, _, index) => {
        acc[index] = false;
        return acc;
      },
      {} as { [key: number]: boolean },
    );

    setExpandedPayloadIndex(mappedRpcIndex);
  }, [savedRpcMethods]);

  const getNetworkConfig = (
    network: LocalStorageSavedNetwork,
  ): Network | undefined => {
    const defaults = getNetworkById(network.id);

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
    if (savedEndpointsHorizon.length === 0) {
      return <Card>There are no saved Horizon Endpoints</Card>;
    }

    return (
      <Card>
        <Box gap="md">
          {savedEndpointsHorizon.map((e, idx) => (
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
                addlClassName="Endpoints__urlBar__footer"
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

                  <>
                    {e.shareableUrl ? (
                      <ShareUrlButton shareableUrl={e.shareableUrl} />
                    ) : null}
                  </>
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
                      const updatedList = arrayItem.delete(
                        savedEndpointsHorizon,
                        idx,
                      );

                      localStorageSavedEndpointsHorizon.set(updatedList);
                      setSavedEndpointsHorizon(updatedList);
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
    if (savedRpcMethods.length === 0) {
      return <Card>There are no saved RPC Methods</Card>;
    }

    return (
      <Card>
        <Box gap="md">
          {savedRpcMethods.map((e, idx) => (
            <Box
              gap="sm"
              key={`horizon-${e.timestamp}`}
              addlClassName="PageBody__content"
            >
              <Box gap="sm" direction="row">
                <Badge size="md" variant="secondary">
                  {e.rpcMethod}
                </Badge>
              </Box>
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
                addlClassName="Endpoints__urlBar__footer"
              >
                <Box gap="sm" direction="row" wrap="wrap">
                  <Button
                    size="md"
                    variant="tertiary"
                    type="button"
                    onClick={() => handleViewHorizonEndpoint(e, idx)}
                  >
                    View in API Explorer
                  </Button>

                  <>
                    <Button
                      size="md"
                      variant="tertiary"
                      type="button"
                      icon={
                        expandedPayloadIndex[idx] ? (
                          <Icon.ChevronDown />
                        ) : (
                          <Icon.ChevronRight />
                        )
                      }
                      onClick={() => {
                        const obj: { [key: number]: boolean } = {};

                        if (expandedPayloadIndex[idx]) {
                          obj[idx] = false;
                        } else {
                          obj[idx] = true;
                        }
                        setExpandedPayloadIndex({
                          ...expandedPayloadIndex,
                          ...obj,
                        });
                      }}
                    >
                      View payload
                    </Button>

                    <>
                      {e.shareableUrl ? (
                        <ShareUrlButton shareableUrl={e.shareableUrl} />
                      ) : null}
                    </>
                  </>
                </Box>

                <Box gap="sm" direction="row" align="center" justify="end">
                  <SavedItemTimestampAndDelete
                    timestamp={e.timestamp}
                    onDelete={() => {
                      const updatedList = arrayItem.delete(
                        savedRpcMethods,
                        idx,
                      );

                      localStorageSavedRpcMethods.set(updatedList);
                      setSavedRpcMethods(updatedList);
                    }}
                  />
                </Box>
              </Box>
              {expandedPayloadIndex[idx] ? (
                <div className="Endpoints__txTextarea">
                  <PrettyJsonTextarea json={e.payload} label="Payload" />
                </div>
              ) : (
                <></>
              )}
            </Box>
          ))}
        </Box>
      </Card>
    );
  };

  return (
    <Box gap="md">
      <TabView
        heading={{ title: "Saved Requests" }}
        tab1={{
          id: "rpc",
          label: "RPC Methods",
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
          {`You are currently on ${network?.label} network. This endpoint is on ${savedEndpointsHorizon[currentEndpointIndex!]?.network?.label} network.`}
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
                savedEndpointsHorizon[currentEndpointIndex];

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
