import React from "react";
import PropTypes from "prop-types";
import AssetPicker from "./AssetPicker";

export default function AssetMultiPicker({
  value,
  onUpdate,
  stringForm = false,
  ...props
}) {
  return (
    <>
      {value.map((asset, index) => (
        <div
          // index here is an okay key because AssetPicker has no local state.
          // There isn't a natural value to use as a key here, because basing it
          // off the data passed in would lead to it changing on  user input
          // (which would also break local state if AssetPicker had any). If this
          // becomes a problem we'll have to revisit the strategy here.
          key={index}
          className="MultiPicker__container picker--spaceBottom"
        >
          <button
            type="button"
            className="s-button"
            style={{ marginRight: ".5em" }}
            onClick={() => {
              onUpdate([...value.slice(0, index), ...value.slice(index + 1)]);
            }}
          >
            ✕
          </button>
          <AssetPicker
            style={{ flexGrow: "1" }}
            value={asset}
            stringForm={stringForm}
            onUpdate={(newValue) => {
              onUpdate(
                // Immutably update the value at the current index
                value.map((oldValue, i) => (i === index ? newValue : oldValue)),
              );
            }}
            {...props}
          />
        </div>
      ))}
      <button
        className="s-button"
        type="button"
        onClick={() => {
          onUpdate(value.concat("native"));
        }}
      >
        Add {value.length > 0 && "another"} asset
      </button>
    </>
  );
}

AssetMultiPicker.propTypes = {
  value: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        type: PropTypes.string,
        code: PropTypes.string,
        issuer: PropTypes.string,
      }),
    ]),
  ).isRequired,
  onUpdate: PropTypes.func.isRequired,
  stringForm: PropTypes.bool,
};
