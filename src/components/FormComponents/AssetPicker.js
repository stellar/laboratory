import React from "react";
import PropTypes from "prop-types";
import assign from "lodash/assign";
import RadioButtonPicker from "./RadioButtonPicker";
import PubKeyPicker from "./PubKeyPicker";
import PickerError from "./PickerError";
import TextPicker from "./TextPicker";

// Value is a string containing the currently selected id (or undefined)
function AssetObjectPicker({ value, onUpdate, disableNative, ...props }) {
  const localValue = assign({ type: "", code: "", issuer: "" }, value);

  let isCredit =
    localValue.type === "credit_alphanum4" ||
    localValue.type === "credit_alphanum12";

  let assetButtons = {
    native: "native",
    credit_alphanum4: "Alphanumeric 4",
    credit_alphanum12: "Alphanumeric 12",
  };

  if (disableNative) {
    delete assetButtons.native;
  }

  return (
    <div {...props}>
      <RadioButtonPicker
        value={localValue.type}
        onUpdate={(typeValue) => {
          const newTypeValue = localValue.type === typeValue ? "" : typeValue;
          onUpdate(
            assign({}, value, {
              type: newTypeValue,
              code: newTypeValue ? "" : localValue.code,
              issuer: newTypeValue ? "" : localValue.issuer,
            }),
          );
        }}
        className={isCredit ? "picker--spaceBottom" : ""}
        items={assetButtons}
      />
      {isCredit && (
        <>
          <input
            type="text"
            value={value.code}
            onChange={(event) =>
              onUpdate(
                assign({}, value, {
                  code: event.target.value,
                }),
              )
            }
            placeholder="Asset Code"
            className="picker picker--textInput"
          />
          <PickerError message={codeValidator(value)} />
          <PubKeyPicker
            value={value.issuer}
            onUpdate={(issuer) =>
              onUpdate(assign({}, value, { issuer: issuer }))
            }
            placeholder="Issuer Account ID"
          />
        </>
      )}
    </div>
  );
}

function codeValidator(value, ignoreType = false) {
  let minLength, maxLength;
  if (ignoreType) {
    minLength = 1;
    maxLength = 12;
  } else if (value.type === "credit_alphanum4") {
    minLength = 1;
    maxLength = 4;
  } else if (value.type === "credit_alphanum12") {
    minLength = 5;
    maxLength = 12;
  } else {
    return;
  }

  let code = value.code || "";

  if (code && !code.match(/^[a-zA-Z0-9]+$/g)) {
    return "Asset code must consist of only letters and numbers.";
  } else if (code.length < minLength || code.length > maxLength) {
    return `Asset code must be between ${minLength} and ${maxLength} characters long.`;
  }
}

const ASSET_TYPES = {
  none: "none",
  native: "native",
  issued: "issued",
};
const stringFormRadioOptions = {
  [ASSET_TYPES.native]: "Native",
  [ASSET_TYPES.issued]: "Issued",
};
const optionalOptions = {
  [ASSET_TYPES.none]: "None",
  ...stringFormRadioOptions,
};
function getAssetType(assetString = "") {
  if (assetString === "native") {
    return "native";
  }
  if (assetString.includes(":")) {
    return "issued";
  }
  return "none";
}
function AssetStringPicker({ value, onUpdate, optional, ...props }) {
  const assetType = getAssetType(value);

  return (
    <div {...props}>
      <RadioButtonPicker
        value={getAssetType(value)}
        onUpdate={(value) => {
          switch (value) {
            case ASSET_TYPES.none:
              return onUpdate("");
            case ASSET_TYPES.issued:
              return onUpdate(":");
            case ASSET_TYPES.native:
              return onUpdate("native");
          }
        }}
        className={
          assetType === ASSET_TYPES.issued ? "picker--spaceBottom" : ""
        }
        items={optional ? optionalOptions : stringFormRadioOptions}
      />
      {assetType === ASSET_TYPES.issued &&
        (() => {
          const [code, issuer] = value.split(":");
          return (
            <>
              <TextPicker
                type="text"
                value={code}
                onUpdate={(newCode) => {
                  onUpdate(`${newCode}:${issuer}`);
                }}
                placeholder="Asset Code"
                className="picker picker--textInput picker--spaceBottom"
              />
              <PickerError message={codeValidator({ code, issuer }, true)} />
              <PubKeyPicker
                value={issuer}
                onUpdate={(newIssuer) => {
                  onUpdate(`${code}:${newIssuer}`);
                }}
                placeholder="Issuer Account ID"
              />
            </>
          );
        })()}
    </div>
  );
}

export default function AssetPicker({
  stringForm = false,
  value,
  optional,
  onUpdate,
  ...props
}) {
  return stringForm ? (
    <AssetStringPicker
      optional={optional}
      value={value}
      onUpdate={onUpdate}
      {...props}
    />
  ) : (
    <AssetObjectPicker
      optional={optional}
      value={value}
      onUpdate={onUpdate}
      {...props}
    />
  );
}

AssetPicker.propTypes = {
  stringForm: PropTypes.bool,
  onUpdate: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      code: PropTypes.string.isRequired,
      issuer: PropTypes.string.isRequired,
    }),
  ]),
};
