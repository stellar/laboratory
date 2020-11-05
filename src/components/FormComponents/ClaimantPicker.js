import React from "react";
import PropTypes from "prop-types";
import { assign, set, isEmpty, unset } from "lodash";
import { transformPredicateDataForRender, addPathDelimiter } from "../../utilities/claimantHelpers";
import OptionsTablePair from "../OptionsTable/Pair";
import RadioButtonPicker from "./RadioButtonPicker";
import PubKeyPicker from "./PubKeyPicker";
import TextPicker from "./TextPicker";
import TimestampPicker from './TimestampPicker';

// Value is a string containing the currently selected id (or undefined)
function ClaimantObjectPicker({ value, onUpdate, disableNative, ...props }) {
  const localValue = assign({
    destination: "",
    predicate: {},
  }, value);

  function handleUpdate({ parentPath, type, childValue }) {
    const path = type ? addPathDelimiter(parentPath, type) : parentPath;

    let updatedPredicate = localValue.predicate;

    if (!parentPath) {
      // Root element
      updatedPredicate = {};
    } else {
      // Clear parent before adding new value
      unset(updatedPredicate, parentPath);
    }

    onUpdate(assign({}, value, {
      predicate: set(updatedPredicate, path, childValue)
    }));
  }

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
      {isEmpty(localValue.predicate)
        ? <Predicate
            key={0}
            parentPath=""
            onUpdate={handleUpdate}
          />
        : renderComponent({
            nodes: transformPredicateDataForRender(localValue.predicate),
            onUpdate: handleUpdate
          })}
    </div>
  );
}

function getLastItemFromPath(path, size = 1) {
  const pathArray = path.split(".");
  return pathArray[pathArray.length - size];
}

function getNestingLevel(str) {
  const regex = /(conditional|unconditional)/g;
  return ((str || '').match(regex) || []).length;
}

function getParentLabel(parentPath) {
  return getNestingLevel(parentPath) >= 2 ? `${parentPath.split(".")[1].toUpperCase()}: ` : "";
}

function getChildValue(val) {
  switch(val) {
    case "and":
    case "or":
      return [{}, {}];
    case "not":
    case "time":
      return {};
    case "absolute":
    case "relative":
      return "";
    default:
      return null;
  }
}

function getComponent(type, parentPath) {
  if (type) {
    // Parent component
    switch(type) {
      case "conditional":
      case "unconditional":
        return Predicate;
      case "and":
      case "or":
      case "not":
      case "time":
        return PredicateType;
      case "absolute":
      case "relative":
        return PredicateTimeType;
      default:
        return null;
    }
  }

  let parentType = getLastItemFromPath(parentPath);

  // If parentType is a number, it means it's an index in array, so we need to
  // use its parent instead.
  if (!isNaN(parentType)) {
    parentType = getLastItemFromPath(parentPath, 2);
  }

  // Child component
  switch(parentType) {
    case "conditional":
      return PredicateType;
    case "and":
    case "or":
    case "not":
      return Predicate;
    case "time":
      return PredicateTimeType;
    case "absolute":
    case "relative":
      return PredicateTimeValue;
    case "unconditional":
    default:
      return null;
  }
}

function renderComponent({ nodes, onUpdate }) {
  return nodes.map((node, index) => {
    const { parentPath, type, value: nodeValue } = node;
    const Component = getComponent(type, parentPath);

    return (
      <Component
        key={`${index}${parentPath}`}
        parentPath={parentPath}
        type={type}
        nodeValue={nodeValue}
        onUpdate={onUpdate}
      />
    );
  });
}

function Predicate({ parentPath, type, nodeValue, onUpdate }) {
  const predicateButtons = {
    unconditional: "Unconditional",
    conditional: "Conditional",
  };

  const isConditional = type === "conditional";

  let label;
  let parentType = getLastItemFromPath(parentPath);

  if (!parentType) {
    label = "Predicate";
  } else if (!isNaN(parentType)) {
    label = `${getLastItemFromPath(parentPath, 2).toUpperCase()} Predicate ${++parentType}`;
  } else {
    label = `${parentType.toUpperCase()} Predicate`;
  }

  return (
    <div className="predicateWrapper">
      <OptionsTablePair label={`${getParentLabel(parentPath)}${label}`} key="predicate">
        <RadioButtonPicker
          value={type}
          onUpdate={(val) => onUpdate({
              parentPath,
              type: val,
              childValue: {}
            })
          }
          items={predicateButtons}
        />
      </OptionsTablePair>
      {isConditional && renderComponent({ nodes: nodeValue, onUpdate })}
    </div>
  );
}

function PredicateType({ parentPath, type, nodeValue, onUpdate }) {
  const predicateTypeButtons = {
    time: "Time",
    and: "AND",
    or: "OR",
    not: "NOT",
  };

  let disabledPredicateTypeButtons;
  const hasMaxNestingLevel = getNestingLevel(parentPath) >= 3;

  if (hasMaxNestingLevel) {
    disabledPredicateTypeButtons = ["and", "or", "not"];
  }

  return (
    <div className="predicateTypeWrapper">
      <OptionsTablePair label="Predicate Type" key="predicateType">
        <RadioButtonPicker
          value={type}
          onUpdate={(val) => onUpdate({
              parentPath,
              type: val,
              childValue: getChildValue(val)
            })
          }
          items={predicateTypeButtons}
          disabledItems={disabledPredicateTypeButtons}
        />
        {hasMaxNestingLevel && <p className="optionsTable__pair__content__note">Deeper nesting is not allowed.</p>}
      </OptionsTablePair>
      {nodeValue && nodeValue.length > 0 && renderComponent({ nodes: nodeValue, onUpdate })}
    </div>
  );
}

function PredicateTimeType({ parentPath, type, nodeValue, onUpdate }) {
  const predicateTimeTypeButtons = {
    relative: "Relative",
    absolute: "Absolute",
  };

  return (
    <>
      <OptionsTablePair label="Time Type" key="predicateTimeType">
        <RadioButtonPicker
          value={type}
          onUpdate={(val) => onUpdate({
              parentPath,
              type: val,
              childValue: getChildValue(val)
            })
          }
          items={predicateTimeTypeButtons}
        />
      </OptionsTablePair>
      {nodeValue && nodeValue.length > 0 && renderComponent({ nodes: nodeValue, onUpdate })}
    </>
  );
}

function PredicateTimeValue({ parentPath, nodeValue, onUpdate }) {
  let inputType = getLastItemFromPath(parentPath);

  function handleUpdate(val) {
    onUpdate({
      parentPath,
      childValue: val
    })
  }

  return (
    <>
      <OptionsTablePair label="Time Value" key="predicateTimeValue">
        {inputType === "absolute" && <>
          <TextPicker placeholder="Example: 1603303504267" value={nodeValue} onUpdate={handleUpdate} />
          <p className="optionsTable__pair__content__note">Unix epoch as a string representing a deadline for when the claimable balance can be claimed. If the balance is claimed before the date then this clause of the condition is satisfied.</p>
        </>}
        {inputType === "relative" && <>
          <TimestampPicker placeholder="Example: 1479151713" value={nodeValue} onUpdate={handleUpdate} />
          <p className="optionsTable__pair__content__note">A relative deadline for when the claimable balance can be claimed. The value represents the number of seconds since the close time of the ledger which created the claimable balance.</p>
        </>}
      </OptionsTablePair>
    </>
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
  value: PropTypes.any,
};
