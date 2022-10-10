import { useEffect } from "react";
import { useDispatch } from "react-redux";
import {
  chooseNetwork,
  setModalVisibility,
  updateModal,
  setCustomParams,
} from "actions/network";
import NETWORK from "constants/network";
import TextPicker from "components/FormComponents/TextPicker.js";
import { useRedux } from "hooks/useRedux";
import { addEventHandler } from "helpers/metrics";
import networkMetrics from "metricsHandlers/network";
import {
  networkLocalStorageSaveValue,
  networkLocalStorageGetValue,
} from "helpers/networkLocalStorage";

interface NetworkToggleProps {
  name: string;
  onToggle: () => void;
  selected: boolean;
}

const NetworkToggle = ({ name, onToggle, selected }: NetworkToggleProps) => (
  <label className="s-buttonGroup__wrapper">
    <input
      type="radio"
      className="s-buttonGroup__radio"
      name="network-toggle"
      onChange={onToggle}
      checked={selected}
      value={name}
    />
    <span className="s-button s-button--light NetworkPicker__button">
      {name}
    </span>
  </label>
);

export const NetworkPicker = () => {
  addEventHandler(networkMetrics);

  useEffect(() => {
    const savedValues = networkLocalStorageGetValue();

    if (savedValues) {
      if (savedValues.name === "custom") {
        dispatch(setCustomParams(savedValues));
      } else {
        dispatch(chooseNetwork(savedValues.name));
      }
    }
  }, []);

  const dispatch = useDispatch();
  const { network } = useRedux("network");
  const { current, modal } = network;
  const setAndSaveNetwork = (network: string) => {
    dispatch(chooseNetwork(network));
    networkLocalStorageSaveValue({ name: network });
  };

  const saveAndSetCustomNetwork = (values: {
    horizonURL: string;
    name: string;
    networkPassphrase: string;
  }) => {
    dispatch(setCustomParams(values));
    networkLocalStorageSaveValue(values);
  };

  let items = Object.keys(NETWORK.available).map((n) => {
    return (
      <NetworkToggle
        name={n}
        key={n}
        selected={current.name === n}
        onToggle={() => setAndSaveNetwork(n)}
      />
    );
  });

  return (
    <div className="NetworkPicker" data-testid="network-picker">
      {modal.visible ? (
        <div className="overlay" data-testid="network-picker-custom-modal">
          <div className="modal">
            <div className="right">
              <a
                href="#"
                className="close"
                onClick={() => {
                  dispatch(setModalVisibility(false));
                  return false;
                }}
              >
                &times;
              </a>
            </div>
            <div>
              <p>Horizon URL:</p>
              <TextPicker
                value={modal.values.horizonURL}
                validator={isValidHorizonURL}
                onUpdate={(value: string) =>
                  dispatch(updateModal("horizonURL", value))
                }
              />
              <p>Network Passphrase:</p>
              <TextPicker
                value={modal.values.networkPassphrase}
                onUpdate={(value: string) =>
                  dispatch(updateModal("networkPassphrase", value))
                }
              />
              <button
                className="s-button"
                disabled={false}
                onClick={() => saveAndSetCustomNetwork(modal.values)}
              >
                Use network
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <form className="s-buttonGroup NetworkPicker__buttonGroup">
        {items}
        <NetworkToggle
          name="custom"
          key="custom"
          selected={current.name === "custom"}
          onToggle={() => dispatch(setModalVisibility(true))}
        />
      </form>
      <span className="NetworkPicker__url">{current.horizonURL}</span>
    </div>
  );
};

const isValidHorizonURL = (u: string) => {
  try {
    new URL(u);
    return true;
  } catch (e) {
    return "Value is not a valid URL";
  }
};
