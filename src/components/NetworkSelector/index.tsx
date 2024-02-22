import { useCallback, useEffect, useState } from "react";
import { Button, Icon, Input } from "@stellar/design-system";

import { NetworkIndicator } from "@/components/NetworkIndicator";
import { localStorageSavedNetwork } from "@/helpers/localStorageSavedNetwork";
import { useStore } from "@/store/useStore";
import { Network, NetworkType } from "@/types/types";

import "./styles.scss";

// TODO: update dropdown open and close actions
// TODO: update input

const NetworkOptions: Network[] = [
  {
    id: "futurenet",
    label: "Futurenet",
    url: "https://horizon-futurenet.stellar.org",
    passphrase: "Test SDF Future Network ; October 2022",
  },
  {
    id: "mainnet",
    label: "Mainnet",
    url: "https://horizon.stellar.org",
    passphrase: "Public Global Stellar Network ; September 2015",
  },
  {
    id: "testnet",
    label: "Testnet",
    url: "https://horizon-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
  },
  {
    id: "custom",
    label: "Custom",
    url: "",
    passphrase: "",
  },
];

export const NetworkSelector = () => {
  const { network, selectNetwork } = useStore();

  const [activeNetworkId, setActiveNetworkId] = useState(network.id);
  const [isVisible, setIsVisible] = useState(false);

  const isCustomNetwork = activeNetworkId === "custom";

  const initialCustomState = {
    url: isCustomNetwork ? network.url : "",
    passphrase: isCustomNetwork ? network.passphrase : "",
  };

  const [customNetwork, setCustomNetwork] = useState(initialCustomState);

  const setNetwork = useCallback(() => {
    if (!network?.id) {
      const defaultNetwork =
        localStorageSavedNetwork.get() || getNetworkById("testnet");

      if (defaultNetwork) {
        selectNetwork(defaultNetwork);
        setActiveNetworkId(defaultNetwork.id);
      }
    }
  }, [network?.id, selectNetwork]);

  // Set default network on launch
  useEffect(() => {
    setNetwork();
  }, [setNetwork]);

  const handleSelectNetwork = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const networkData = getNetworkById(activeNetworkId);

    if (networkData) {
      const data =
        networkData.id === "custom"
          ? { ...networkData, ...customNetwork }
          : networkData;

      selectNetwork(data);
      setCustomNetwork(initialCustomState);
      localStorageSavedNetwork.set(data);
    }
  };

  const handleSelectActive = (networkId: NetworkType) => {
    setActiveNetworkId(networkId);
    setCustomNetwork(initialCustomState);
  };

  const getNetworkById = (networkId: NetworkType) => {
    return NetworkOptions.find((op) => op.id === networkId);
  };

  const isSameNetwork = () => {
    if (activeNetworkId === "custom") {
      return (
        network.url &&
        network.passphrase &&
        customNetwork.url === network.url &&
        customNetwork.passphrase === network.passphrase
      );
    }

    return activeNetworkId === network.id;
  };

  const isNetworkUrlInvalid = () => {
    if (activeNetworkId !== "custom" || !customNetwork.url) {
      return "";
    }

    try {
      new URL(customNetwork.url);
      return "";
    } catch (e) {
      return "Value is not a valid URL";
    }
  };

  return (
    <div className="NetworkSelector">
      <button
        className="NetworkSelector__button"
        onClick={() => setIsVisible(!isVisible)}
      >
        <NetworkIndicator networkId={network.id} networkLabel={network.label} />
        <Icon.ChevronDown />
      </button>
      <div
        className="NetworkSelector__floater Floater__content Floater__content--light"
        data-is-visible={isVisible}
      >
        <div className="NetworkSelector__body">
          <div className="NetworkSelector__body__links">
            {NetworkOptions.map((op) => (
              <div
                key={op.id}
                className="NetworkSelector__body__link"
                data-is-active={op.id === activeNetworkId}
                role="button"
                onClick={() => handleSelectActive(op.id)}
              >
                <NetworkIndicator networkId={op.id} networkLabel={op.label} />
                <div className="NetworkSelector__body__link__url">{op.url}</div>
              </div>
            ))}
          </div>

          <div
            className="NetworkSelector__body__inputs"
            data-is-active={activeNetworkId === "custom"}
          >
            <form onSubmit={handleSelectNetwork}>
              <Input
                id="network-url"
                fieldSize="sm"
                label="Horizon URL"
                value={
                  isCustomNetwork
                    ? customNetwork.url
                    : getNetworkById(activeNetworkId)?.url
                }
                disabled={!isCustomNetwork}
                onChange={(e) =>
                  setCustomNetwork({ ...customNetwork, url: e.target.value })
                }
                error={isNetworkUrlInvalid()}
              />
              <Input
                id="network-passphrase"
                fieldSize="sm"
                label="Network Passphrase"
                value={
                  isCustomNetwork
                    ? customNetwork.passphrase
                    : getNetworkById(activeNetworkId)?.passphrase
                }
                disabled={!isCustomNetwork}
                onChange={(e) =>
                  setCustomNetwork({
                    ...customNetwork,
                    passphrase: e.target.value,
                  })
                }
              />
              <Button
                size="sm"
                variant="secondary"
                type="submit"
                disabled={
                  isSameNetwork() ||
                  (activeNetworkId === "custom" &&
                    !(customNetwork.url && customNetwork.passphrase)) ||
                  Boolean(customNetwork.url && isNetworkUrlInvalid())
                }
              >
                {`Use ${getNetworkById(activeNetworkId)?.label} Network`}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
