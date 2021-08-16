import React from "react";
import { connect } from "react-redux";
import {
  chooseNetwork,
  setModalVisibility,
  updateModal,
  setCustomParams,
} from "actions/network";
import NETWORK from "constants/network";
import TextPicker from "components/FormComponents/TextPicker.js";
import { addEventHandler } from "helpers/metrics";
import networkMetrics from "metricsHandlers/network";
import {
  networkLocalStorageSaveValue,
  networkLocalStorageGetValue,
} from "helpers/networkLocalStorage";

addEventHandler(networkMetrics);

class NetworkPicker extends React.Component {
  componentDidMount() {
    const savedValues = networkLocalStorageGetValue();

    if (savedValues) {
      if (savedValues.name === "custom") {
        this.props.dispatch(setCustomParams(savedValues));
      } else {
        this.props.dispatch(chooseNetwork(savedValues.name));
      }
    }
  }

  render() {
    let { dispatch } = this.props;
    let { current, modal } = this.props;

    const setAndSaveNetwork = (network) => {
      dispatch(chooseNetwork(network));
      networkLocalStorageSaveValue({ name: network });
    };

    const saveAndSetCustomNetwork = (values) => {
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
                  onUpdate={(value) =>
                    dispatch(updateModal("horizonURL", value))
                  }
                />
                <p>Network Passphrase:</p>
                <TextPicker
                  value={modal.values.networkPassphrase}
                  onUpdate={(value) =>
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
  }
}

const isValidHorizonURL = (u) => {
  try {
    new URL(u);
    return true;
  } catch (e) {
    return "Value is not a valid URL";
  }
};

const NetworkToggle = (props) => {
  let { name, onToggle, selected } = props;
  return (
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
};

export default connect(chooseState)(NetworkPicker);

function chooseState(state) {
  return {
    current: state.network.current,
    modal: state.network.modal,
  };
}
