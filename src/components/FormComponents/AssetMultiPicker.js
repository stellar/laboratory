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
          key={`${asset === "native" ? "native" : "issued"}${index}`}
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
