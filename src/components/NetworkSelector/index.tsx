import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Button, Icon, Input, Notification } from "@stellar/design-system";

import { NetworkIndicator } from "@/components/NetworkIndicator";
import { NetworkOptions } from "@/constants/settings";
import { useStore } from "@/store/useStore";

import { localStorageSavedNetwork } from "@/helpers/localStorageSavedNetwork";
import { delayedAction } from "@/helpers/delayedAction";
import { isEmptyObject } from "@/helpers/isEmptyObject";
import { sanitizeObject } from "@/helpers/sanitizeObject";
import { getNetworkById } from "@/helpers/getNetworkById";

import { AnyObject, EmptyObj, Network } from "@/types/types";

import "./styles.scss";

export const NetworkSelector = () => {
  const {
    endpoints,
    network,
    isDynamicNetworkSelect,
    selectNetwork,
    updateIsDynamicNetworkSelect,
  } = useStore();

  const { updateNetwork } = endpoints;

  const [activeNetwork, setActiveNetwork] = useState<Network | EmptyObj>(
    network,
  );
  const [validationError, setValidationError] = useState<AnyObject>({});

  const [isDropdownActive, setIsDropdownActive] = useState(false);
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isSameNetwork =
    activeNetwork.id === network.id &&
    activeNetwork.horizonUrl === network.horizonUrl &&
    activeNetwork.horizonHeaderName === network.horizonHeaderName &&
    activeNetwork.horizonHeaderValue === network.horizonHeaderValue &&
    activeNetwork.rpcUrl === network.rpcUrl &&
    activeNetwork.rpcHeaderName === network.rpcHeaderName &&
    activeNetwork.rpcHeaderValue === network.rpcHeaderValue &&
    activeNetwork.passphrase === network.passphrase;

  const isNetworkUrlInvalid = (url: string) => {
    if (!url) {
      return "";
    }

    try {
      new URL(url);
      return "";
    } catch (e) {
      return "Value is not a valid URL";
    }
  };

  const isSubmitDisabled = () => {
    if (isSameNetwork) {
      return true;
    }

    return !(activeNetwork.horizonUrl && activeNetwork.passphrase);
  };

  // Set default network on launch
  useEffect(() => {
    let defaultNetwork: Network | undefined;

    if (network.id) {
      const savedNetwork = localStorageSavedNetwork.get();

      defaultNetwork = { ...(network as Network) };

      // Get API keys from local storage if it's the same network
      if (
        savedNetwork &&
        savedNetwork.id === network.id &&
        savedNetwork.passphrase === network.passphrase &&
        savedNetwork.horizonUrl === network.horizonUrl &&
        savedNetwork.rpcUrl === network.rpcUrl
      ) {
        defaultNetwork = {
          ...defaultNetwork,
          horizonHeaderName: savedNetwork.horizonHeaderName || "",
          rpcHeaderName: savedNetwork.rpcHeaderName || "",
        };
      }
    } else {
      defaultNetwork =
        localStorageSavedNetwork.get() || getNetworkById("testnet");
    }

    if (defaultNetwork) {
      setActiveNetwork(defaultNetwork);

      if (!network.id) {
        selectNetwork(defaultNetwork);
        updateNetwork(defaultNetwork);
      }
    }
    // Not including network to avoid unnecessary re-renders
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isDynamicNetworkSelect) {
      setActiveNetwork(network);
      localStorageSavedNetwork.set(network as Network);
    }
    // Not including network
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDynamicNetworkSelect, network.id]);

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
      setActiveNetwork(network);
    },
    [network],
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

    const network = isEmptyObject(activeNetwork)
      ? null
      : (activeNetwork as Network);

    if (network) {
      // Update store (header values won't persist)
      selectNetwork(network);
      // Also update the network setting for endpoints
      updateNetwork(network);
      // Update local state
      setActiveNetwork(network);

      // Don't save header values in local storage
      const savedNetwork: Network = {
        ...network,
        horizonHeaderValue: "",
        rpcHeaderValue: "",
      };
      // Update local storage
      localStorageSavedNetwork.set(sanitizeObject(savedNetwork));

      // Close dropdown
      toggleDropdown(false);
      updateIsDynamicNetworkSelect(false);
    }
  };

  const handleInputChange = (param: string, value: string | undefined) => {
    const _network = { ...activeNetwork } as Network;

    setActiveNetwork({ ..._network, [param]: value });

    if (["rpcUrl", "horizonUrl"].includes(param)) {
      validateInputUrl(param, value);
    }
  };

  const validateInputUrl = (param: string, value: string | undefined) => {
    setValidationError({
      ...validationError,
      [param]: value ? isNetworkUrlInvalid(value) : false,
    });
  };

  const getButtonLabel = () => {
    if (activeNetwork.id === "custom") {
      return "Switch to Custom Network";
    }

    return `Switch to ${getNetworkById(activeNetwork.id)?.label}`;
  };

  const toggleDropdown = (show: boolean) => {
    const delay = 100;

    if (show) {
      setIsDropdownActive(true);
      delayedAction({
        action: () => {
          setIsDropdownVisible(true);
        },
        delay,
      });
    } else {
      setIsDropdownVisible(false);
      delayedAction({
        action: () => {
          setIsDropdownActive(false);
        },
        delay,
      });
    }
  };

  return (
    <div className="NetworkSelector">
      <button
        className="NetworkSelector__button"
        ref={buttonRef}
        onClick={() => toggleDropdown(!isDropdownVisible)}
        tabIndex={0}
        data-testid="networkSelector-button"
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
        data-testid="networkSelector-dropdown"
      >
        <div className="NetworkSelector__body">
          <div className="NetworkSelector__body__links">
            {NetworkOptions.map((op) => (
              <div
                key={op.id}
                className="NetworkSelector__body__link"
                data-is-active={op.id === activeNetwork.id}
                role="button"
                onClick={() => setActiveNetwork(op)}
                tabIndex={0}
                data-testid="networkSelector-option"
              >
                <NetworkIndicator networkId={op.id} networkLabel={op.label} />
                {op.id === activeNetwork.id ? (
                  <div className="NetworkSelector__body__link__note">
                    Selected
                  </div>
                ) : null}
              </div>
            ))}
          </div>

          <div className="NetworkSelector__body__inputs">
            {activeNetwork.id === "futurenet" ? (
              <Notification
                variant="warning"
                title="Warning"
                icon={<Icon.AlertTriangle />}
              >
                Futurenet is an unstable network. We recommend using Testnet for
                your development purposes.
              </Notification>
            ) : null}

            <form onSubmit={handleSelectNetwork}>
              {/* RPC */}
              <NetworkInput
                id="rpc-url"
                label="RPC URL"
                placeholder="RPC URL"
                value={activeNetwork.rpcUrl || ""}
                onChange={(e) => {
                  handleInputChange("rpcUrl", e.target.value);
                }}
                error={validationError?.rpcUrl}
                infoLink="https://developers.stellar.org/docs/data/rpc/rpc-providers"
              />
              {/* TODO: put these back once Stellar JS SDK is ready */}
              {/* <NetworkInput
                id="rpc-header-name"
                placeholder="RPC Header Name (optional)"
                value={activeNetwork.rpcHeaderName || ""}
                onChange={(e) => {
                  handleInputChange("rpcHeaderName", e.target.value);
                }}
                error={validationError?.rpcHeaderName}
              />
              <NetworkInput
                id="rpc-header-value"
                placeholder="RPC Header Value (optional)"
                value={activeNetwork.rpcHeaderValue || ""}
                onChange={(e) => {
                  handleInputChange("rpcHeaderValue", e.target.value);
                }}
                error={validationError?.rpcHeaderValue}
                disableAutocomplete={true}
              /> */}

              {/* Horizon */}
              <NetworkInput
                id="network-url"
                label="Horizon URL"
                placeholder="Horizon URL"
                value={activeNetwork.horizonUrl || ""}
                onChange={(e) => {
                  handleInputChange("horizonUrl", e.target.value);
                }}
                error={validationError?.horizonUrl}
                infoLink="https://developers.stellar.org/docs/data/horizon/horizon-providers"
              />
              {/* TODO: put these back once Stellar JS SDK is ready */}
              {/* <NetworkInput
                id="network-header-name"
                placeholder="Horizon Header Name (optional)"
                value={activeNetwork.horizonHeaderName || ""}
                onChange={(e) => {
                  handleInputChange("horizonHeaderName", e.target.value);
                }}
                error={validationError?.horizonHeaderName}
              />
              <NetworkInput
                id="network-header-value"
                placeholder="Horizon Header Value (optional)"
                value={activeNetwork.horizonHeaderValue || ""}
                onChange={(e) => {
                  handleInputChange("horizonHeaderValue", e.target.value);
                }}
                error={validationError?.horizonHeaderValue}
                disableAutocomplete={true}
              /> */}

              {/* Passphrase */}
              <NetworkInput
                id="network-passphrase"
                label="Network Passphrase"
                placeholder="Network Passphrase"
                value={activeNetwork.passphrase || ""}
                onChange={(e) => {
                  handleInputChange("passphrase", e.target.value);
                }}
                error={validationError?.passphrase}
                disabled={["testnet", "mainnet", "futurenet"].includes(
                  activeNetwork.id,
                )}
              />

              <Button
                size="sm"
                variant="secondary"
                type="submit"
                disabled={isSubmitDisabled()}
                tabIndex={0}
                data-testid="networkSelector-submit-button"
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

type NetworkInputProps = {
  id: string;
  label?: string;
  placeholder?: string;
  value: string | undefined;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  error?: React.ReactNode;
  disabled?: boolean;
  disableAutocomplete?: boolean;
  infoLink?: string;
};

const NetworkInput = ({
  id,
  label,
  placeholder,
  value,
  onChange,
  error,
  disabled,
  disableAutocomplete,
  infoLink,
}: NetworkInputProps) => {
  return (
    <Input
      id={id}
      fieldSize="sm"
      label={label}
      placeholder={placeholder}
      value={value}
      title={value}
      disabled={disabled}
      onChange={onChange}
      error={error}
      tabIndex={0}
      copyButton={{
        position: "right",
      }}
      infoLink={infoLink}
      {...(disableAutocomplete ? { autoComplete: "off" } : {})}
    />
  );
};
