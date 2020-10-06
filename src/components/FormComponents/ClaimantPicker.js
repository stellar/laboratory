import React from "react";
import PropTypes from "prop-types";
import assign from "lodash/assign";
import OptionsTablePair from "../OptionsTable/Pair";
import RadioButtonPicker from "./RadioButtonPicker";
import PubKeyPicker from "./PubKeyPicker";

// Value is a string containing the currently selected id (or undefined)
function ClaimantObjectPicker({ value, onUpdate, disableNative, ...props }) {
  const localValue = assign({ destination: "", predicateType: "", predicate: {} }, value);

  const predicateButtons = {
    unconditional: "Unconditional",
    conditional: "Conditional",
  };

  const isConditional = localValue.predicateType === "conditional";

  return (
    <div {...props}>
      <OptionsTablePair label="Destination" key="destination">
        <PubKeyPicker
          value={value.destination}
          onUpdate={(destination) =>
            onUpdate(assign({}, value, { destination }))
          }
        />
      </OptionsTablePair>
      <OptionsTablePair label="Predicate" key="predicate">
        <RadioButtonPicker
          value={localValue.predicateType}
          onUpdate={(typeValue) => {
            const newTypeValue = localValue.predicateType === typeValue ? "" : typeValue;
            onUpdate(
              assign({}, value, {
                predicateType: newTypeValue,
                predicate: newTypeValue ? {} : localValue.predicate,
              }),
            );
          }}
          items={predicateButtons}
        />
      </OptionsTablePair>
      {isConditional && (
        <>
        {/* TODO: implement */}
          <div>[Show Conditional options]</div>
        </>
      )}
    </div>
  );
}

export default function ClaimantPicker({
  stringForm = false,
  value,
  optional,
  onUpdate,
  ...props
}) {
  return <ClaimantObjectPicker
    optional={optional}
    value={value}
    onUpdate={onUpdate}
    {...props}
  />
}

ClaimantPicker.propTypes = {
  onUpdate: PropTypes.func.isRequired,
  // TODO: update type
  value: PropTypes.any,
};
