import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button, Icon, Input } from "@stellar/design-system";

import { NetworkIndicator } from "@/components/NetworkIndicator";
import { localStorageSavedNetwork } from "@/helpers/localStorageSavedNetwork";
import { useStore } from "@/store/useStore";
import { Network, NetworkType } from "@/types/types";

import "./styles.scss";

const NetworkOptions: Network[] = [
  {
    id: "futurenet",
    label: "Futurenet",
    horizonUrl: "https://horizon-futurenet.stellar.org",
    rpcUrl: "https://rpc-futurenet.stellar.org",
    passphrase: "Test SDF Future Network ; October 2022",
  },
  {
    id: "mainnet",
    label: "Mainnet",
    horizonUrl: "https://horizon.stellar.org",
    rpcUrl: "",
    passphrase: "Public Global Stellar Network ; September 2015",
  },
  {
    id: "testnet",
    label: "Testnet",
    horizonUrl: "https://horizon-testnet.stellar.org",
    rpcUrl: "https://soroban-testnet.stellar.org",
    passphrase: "Test SDF Network ; September 2015",
  },
  {
    id: "custom",
    label: "Custom",
    horizonUrl: "",
    rpcUrl: "",
    passphrase: "",
  },
];

export const NetworkSelector = () => {
  const { network, selectNetwork } = useStore();

  const [activeNetworkId, setActiveNetworkId] = useState(network.id);
  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const initialCustomState = {
    horizonUrl: network.id === "custom" ? network.horizonUrl : "",
    rpcUrl: network.id === "custom" ? network.rpcUrl : "",
    passphrase: network.id === "custom" ? network.passphrase : "",
  };

  const [customNetwork, setCustomNetwork] = useState(initialCustomState);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isSameNetwork = () => {
    if (activeNetworkId === "custom") {
      return (
        network.horizonUrl &&
        network.rpcUrl &&
        network.passphrase &&
        customNetwork.horizonUrl === network.horizonUrl &&
        customNetwork.rpcUrl === network.rpcUrl &&
        customNetwork.passphrase === network.passphrase
      );
    }

    return activeNetworkId === network.id;
  };

  const isNetworkUrlInvalid = (url: string) => {
    if (activeNetworkId !== "custom" || !url) {
      return "";
    }

    try {
      new URL(url);
      return "";
    } catch (e) {
      return "Value is not a valid URL";
    }
  };

  const isSubmitDisabled =
    isSameNetwork() ||
    (activeNetworkId === "custom" &&
      !(customNetwork.horizonUrl && customNetwork.passphrase)) ||
    Boolean(
      customNetwork.horizonUrl && isNetworkUrlInvalid(customNetwork.horizonUrl),
    );

  const isCustomNetwork = activeNetworkId === "custom";

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

  const handleKeyPress = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        toggleDropdown(false);
      }

      if (event.key === "Enter" && !isSubmitDisabled) {
        handleSelectNetwork(event);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [isSubmitDisabled],
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      if (
        dropdownRef?.current?.contains(event.target as Node) ||
        buttonRef?.current?.contains(event.target as Node)
      ) {
        return;
      }

      toggleDropdown(false);
      setActiveNetworkId(network.id);
      setCustomNetwork({
        horizonUrl: network.horizonUrl ?? "",
        rpcUrl: network.rpcUrl ?? "",
        passphrase: network.passphrase ?? "",
      });
    },
    [network.id, network.horizonUrl, network.rpcUrl, network.passphrase],
  );

  // Close dropdown when clicked outside
  useLayoutEffect(() => {
    if (isDropdownVisible) {
      document.addEventListener("pointerup", handleClickOutside);
      document.addEventListener("keyup", handleKeyPress);
    } else {
      document.removeEventListener("pointerup", handleClickOutside);
      document.removeEventListener("keyup", handleKeyPress);
    }

    return () => {
      document.removeEventListener("pointerup", handleClickOutside);
      document.removeEventListener("keyup", handleKeyPress);
    };
  }, [isDropdownVisible, handleClickOutside, handleKeyPress]);

  const handleSelectNetwork = (
    event: React.FormEvent<HTMLFormElement> | KeyboardEvent,
  ) => {
    event.preventDefault();

    const networkData = getNetworkById(activeNetworkId);

    if (networkData) {
      const data =
        networkData.id === "custom"
          ? { ...networkData, ...customNetwork }
          : networkData;

      selectNetwork(data);
      setCustomNetwork(
        networkData.id === "custom" ? customNetwork : initialCustomState,
      );
      localStorageSavedNetwork.set(data);
      toggleDropdown(false);
    }
  };

  const handleSelectActive = (networkId: NetworkType) => {
    setActiveNetworkId(networkId);
    setCustomNetwork(initialCustomState);
  };

  const getNetworkById = (networkId: NetworkType) => {
    return NetworkOptions.find((op) => op.id === networkId);
  };

  const getButtonLabel = () => {
    if (activeNetworkId === "custom") {
      return "Switch to Custom Network";
    }

    return `Switch to ${getNetworkById(activeNetworkId)?.label}`;
  };

  const toggleDropdown = (show: boolean) => {
    const delay = 100;

    if (show) {
      setIsDropdownActive(true);
      const t = setTimeout(() => {
        setIsDropdownVisible(true);
        clearTimeout(t);
      }, delay);
    } else {
      setIsDropdownVisible(false);
      const t = setTimeout(() => {
        setIsDropdownActive(false);
        clearTimeout(t);
      }, delay);
    }
  };

  return (
    <div className="NetworkSelector">
      <button
        className="NetworkSelector__button"
        ref={buttonRef}
        onClick={() => toggleDropdown(!isDropdownVisible)}
        tabIndex={0}
      >
        <NetworkIndicator networkId={network.id} networkLabel={network.label} />
        <Icon.ChevronDown />
      </button>
      <div
        className="NetworkSelector__floater Floater__content Floater__content--light"
        data-is-active={isDropdownActive}
        data-is-visible={isDropdownVisible}
        ref={dropdownRef}
        tabIndex={0}
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
                tabIndex={0}
              >
                <NetworkIndicator networkId={op.id} networkLabel={op.label} />
                <div className="NetworkSelector__body__link__url">
                  {op.horizonUrl}
                </div>
              </div>
            ))}
          </div>

          <div className="NetworkSelector__body__inputs">
            <form onSubmit={handleSelectNetwork}>
              <Input
                id="rpc-url"
                fieldSize="sm"
                label="RPC URL"
                value={
                  isCustomNetwork
                    ? customNetwork.rpcUrl
                    : getNetworkById(activeNetworkId)?.rpcUrl
                }
                disabled={!isCustomNetwork}
                onChange={(e) =>
                  setCustomNetwork({
                    ...customNetwork,
                    rpcUrl: e.target.value,
                  })
                }
                error={isNetworkUrlInvalid(customNetwork.rpcUrl)}
                tabIndex={0}
                copyButton={{
                  position: "right",
                }}
              />
              <Input
                id="network-url"
                fieldSize="sm"
                label="Horizon URL"
                value={
                  isCustomNetwork
                    ? customNetwork.horizonUrl
                    : getNetworkById(activeNetworkId)?.horizonUrl
                }
                disabled={!isCustomNetwork}
                onChange={(e) =>
                  setCustomNetwork({
                    ...customNetwork,
                    horizonUrl: e.target.value,
                  })
                }
                error={isNetworkUrlInvalid(customNetwork.horizonUrl)}
                tabIndex={0}
                copyButton={{
                  position: "right",
                }}
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
                tabIndex={0}
                copyButton={{
                  position: "right",
                }}
              />
              <Button
                size="sm"
                variant="secondary"
                type="submit"
                disabled={isSubmitDisabled}
                tabIndex={0}
              >
                {getButtonLabel()}
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
