import { Badge, Button, Icon, Label } from "@stellar/design-system";
import { flatten, isEmpty, set } from "lodash";

import { RadioPicker } from "@/components/RadioPicker";
import { TabbedButtons } from "@/components/TabbedButtons";
import { Box } from "@/components/layout/Box";
import { PubKeyPicker } from "@/components/FormElements/PubKeyPicker";
import { TextPicker } from "@/components/FormElements/TextPicker";
import { PositiveIntPicker } from "@/components/FormElements/PositiveIntPicker";

import { arrayItem } from "@/helpers/arrayItem";
import { AnyObject } from "@/types/types";

type ClaimantsPickerProps = {
  id: string;
  claimants: AnyObject[] | undefined;
  onChange: (claimants: AnyObject[] | undefined) => void;
  error: (AnyObject | undefined)[] | undefined;
};

export const ClaimantsPicker = ({
  id,
  claimants,
  onChange,
  error,
}: ClaimantsPickerProps) => {
  const hasClaimants = claimants && claimants.length > 0;

  return (
    <Box gap="md">
      <Label size="md" htmlFor="">
        Claimants
      </Label>

      <>
        {hasClaimants ? (
          <Box gap="md">
            <>
              {claimants.map((_: AnyObject, idx: number) => {
                const clId = `${id}-claimant-${idx}`;

                return (
                  <Box gap="sm" key={clId}>
                    <Box
                      gap="lg"
                      direction="row"
                      justify="space-between"
                      align="center"
                    >
                      <Badge variant="primary" size="sm">
                        {`Claimant ${idx + 1}`}
                      </Badge>

                      <TabbedButtons
                        size="sm"
                        buttons={[
                          {
                            id: "delete",
                            hoverTitle: "Delete",
                            icon: <Icon.Trash01 />,
                            isError: true,
                            onClick: () => {
                              onChange(arrayItem.delete(claimants, idx));
                            },
                          },
                        ]}
                      />
                    </Box>

                    <PubKeyPicker
                      id={`${clId}-destination`}
                      label="Destination"
                      value={claimants[idx]?.destination || ""}
                      error={error?.[idx]?.destination}
                      onChange={(e) => {
                        onChange(
                          arrayItem.update(claimants, idx, {
                            destination: e.target.value,
                            predicate: claimants[idx]?.predicate,
                          }),
                        );
                      }}
                    />

                    <ClaimantPredicatePicker
                      id={`${clId}-predicate`}
                      index={idx}
                      predicateValue={claimants[idx]?.predicate || {}}
                      onUpdate={(val, path) => {
                        onChange(
                          arrayItem.update(claimants, idx, {
                            destination: claimants[idx]?.destination,
                            predicate: updateAtPath({
                              path,
                              value: val,
                              source: claimants[idx].predicate,
                            }),
                          }),
                        );
                      }}
                      error={error?.[idx]?.predicate}
                    />
                  </Box>
                );
              })}
            </>
          </Box>
        ) : null}
      </>

      <div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            onChange([
              ...(claimants || []),
              {
                destination: undefined,
                predicate: undefined,
              },
            ]);
          }}
          type="button"
        >
          {hasClaimants ? "Add another claimant" : "Add a claimant"}
        </Button>
      </div>
    </Box>
  );
};

type ClaimantPredicatePickerProps = {
  id: string;
  index: number;
  predicateValue: AnyObject;
  onUpdate: (value: AnyObject | undefined, path?: string) => void;
  error: AnyObject | undefined;
};

const ClaimantPredicatePicker = ({
  id,
  index,
  predicateValue,
  onUpdate,
  error,
}: ClaimantPredicatePickerProps) => {
  const handleUpdate = (value: AnyObject | undefined) => {
    if (!value) {
      return onUpdate(undefined);
    }

    const { parentPath, type, childValue } = value;

    const path = type ? addPathDelimiter(parentPath, type) : parentPath;

    onUpdate(childValue, path);
  };

  return (
    <Box gap="sm" data-id={id}>
      <>
        {isEmpty(predicateValue) ? (
          <Predicate
            index={index}
            key={`${id}-${index}`}
            parentPath=""
            onUpdate={(val: AnyObject | undefined) => {
              handleUpdate(val);
            }}
            error={error}
          />
        ) : (
          renderComponent({
            index,
            nodes: transformPredicateDataForRender(predicateValue),
            onUpdate: handleUpdate,
            error,
          })
        )}
      </>
    </Box>
  );
};

const renderComponent = ({
  index,
  nodes,
  onUpdate,
  error,
}: {
  index: number;
  nodes: AnyObject[];
  onUpdate: (val: AnyObject | undefined) => void;
  error: AnyObject | undefined;
}) => {
  return nodes.map((node: AnyObject) => {
    const { parentPath, type, value: nodeValue } = node;
    const Component = getComponent(type, parentPath);

    if (!Component) {
      return null;
    }

    return (
      <Component
        key={`${index}${parentPath}`}
        index={index}
        parentPath={parentPath}
        type={type}
        nodeValue={nodeValue}
        onUpdate={onUpdate}
        error={error}
      />
    );
  });
};

const Predicate = ({
  index,
  parentPath,
  type,
  nodeValue,
  onUpdate,
  error,
}: {
  index: number;
  parentPath: string;
  type?: string;
  nodeValue?: AnyObject[] | undefined;
  onUpdate: (val: AnyObject | undefined) => void;
  error: AnyObject | undefined;
}) => {
  const isConditional = type === "conditional";

  let label;
  const parentType = getLastItemFromPath(parentPath);

  if (!parentType) {
    label = "Predicate";
  } else if (!isNaN(Number(parentType))) {
    label = `${getLastItemFromPath(
      parentPath,
      2,
    ).toUpperCase()} Predicate ${Number(parentType) + 1}`;
  } else {
    label = `${parentType.toUpperCase()} Predicate`;
  }

  return (
    <Box gap="sm" addlClassName="PredicateWrapper">
      <Label size="md" htmlFor="">
        {`${getParentLabel(parentPath)}${label}`}
      </Label>

      <RadioPicker
        id={`${index}-${parentPath}-predicate`}
        selectedOption={type}
        onChange={(val) => {
          onUpdate({
            parentPath,
            type: val,
            childValue: {},
          });
        }}
        options={[
          {
            id: "unconditional",
            label: "Unconditional",
          },
          { id: "conditional", label: "Conditional" },
        ]}
      />

      <>
        {isConditional &&
          renderComponent({ nodes: nodeValue || [], onUpdate, error, index })}
      </>
    </Box>
  );
};

const PredicateType = ({
  index,
  parentPath,
  type,
  nodeValue,
  onUpdate,
  error,
}: {
  index: number;
  parentPath: string;
  type: string;
  nodeValue: AnyObject[];
  onUpdate: (val: AnyObject | undefined) => void;
  error: AnyObject | undefined;
}) => {
  const hasMaxNestingLevel = getNestingLevel(parentPath) >= 3;

  return (
    <Box gap="sm" addlClassName="PredicateTypeWrapper">
      <RadioPicker
        id={`${index}-${parentPath}-predicate-type`}
        selectedOption={type}
        label="Predicate Type"
        onChange={(val) => {
          onUpdate({
            parentPath,
            type: val,
            childValue: getChildValue(val),
          });
        }}
        options={[
          { id: "time", label: "Time" },
          { id: "and", label: "AND" },
          { id: "or", label: "OR" },
          { id: "not", label: "NOT" },
        ]}
        disabledOptions={hasMaxNestingLevel ? ["and", "or", "not"] : undefined}
      />

      <>
        {hasMaxNestingLevel && (
          <div className="FieldNote FieldNote--md">
            Deeper nesting is not allowed.
          </div>
        )}

        {nodeValue && nodeValue.length > 0 && (
          <Box
            gap="sm"
            addlClassName={
              ["and", "or"].includes(type) ? "PredicateWrapper__split" : ""
            }
          >
            <>{renderComponent({ nodes: nodeValue, onUpdate, error, index })}</>
          </Box>
        )}
      </>
    </Box>
  );
};

const PredicateTimeType = ({
  index,
  parentPath,
  type,
  nodeValue,
  onUpdate,
  error,
}: {
  index: number;
  parentPath: string;
  type: string;
  nodeValue: AnyObject[];
  onUpdate: (val: AnyObject | undefined) => void;
  error: AnyObject | undefined;
}) => {
  return (
    <>
      <RadioPicker
        id={`${index}-${parentPath}-time-type`}
        selectedOption={type}
        label="Time Type"
        onChange={(val) => {
          onUpdate({
            parentPath,
            type: val,
            childValue: getChildValue(val),
          });
        }}
        options={[
          { id: "relative", label: "Relative" },
          { id: "absolute", label: "Absolute" },
        ]}
      />

      {nodeValue &&
        nodeValue.length > 0 &&
        renderComponent({ nodes: nodeValue, onUpdate, error, index })}
    </>
  );
};

const PredicateTimeValue = ({
  index,
  parentPath,
  nodeValue,
  onUpdate,
  error,
}: {
  index: number;
  parentPath: string;
  nodeValue: string;
  onUpdate: (val: {
    parentPath: string;
    childValue: string | undefined;
  }) => void;
  error: AnyObject | undefined;
}) => {
  const inputType = getLastItemFromPath(parentPath);
  const path = joinPath(parentPath.split("."));

  function handleUpdate(e: React.ChangeEvent<HTMLInputElement>) {
    onUpdate({
      parentPath,
      childValue: e.target.value,
    });
  }

  return (
    <>
      {inputType === "absolute" && (
        <>
          <TextPicker
            id={`${index}-${parentPath}-time-value-abs`}
            placeholder="Ex: 1603303504267"
            value={nodeValue}
            label="Time Value"
            onChange={handleUpdate}
            error={error?.[path]}
            note="Unix epoch as a string representing a deadline for when the
              claimable balance can be claimed. If the balance is claimed before
              the date then this clause of the condition is satisfied."
          />
        </>
      )}
      {inputType === "relative" && (
        <>
          <PositiveIntPicker
            id={`${index}-${parentPath}-time-value-rel`}
            placeholder="Ex: 1603303504267"
            value={nodeValue}
            label="Time Value"
            error={error?.[path]}
            onChange={handleUpdate}
            note="A relative deadline for when the claimable balance can be claimed.
            The value represents the number of seconds since the close time of
            the ledger which created the claimable balance."
          />
        </>
      )}
    </>
  );
};

// Helpers
const getLastItemFromPath = (path: string, size = 1) => {
  const pathArray = path.split(".");
  return pathArray[pathArray.length - size];
};

const getNestingLevel = (str: string) => {
  const regex = /(conditional|unconditional)/g;
  return ((str || "").match(regex) || []).length;
};

const getParentLabel = (parentPath: string) => {
  return getNestingLevel(parentPath) >= 2
    ? `${parentPath.split(".")[1].toUpperCase()}: `
    : "";
};

const getChildValue = (val: string) => {
  switch (val) {
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
};

const getComponent = (type: string, parentPath: string) => {
  if (type) {
    // Parent component
    switch (type) {
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
  if (!isNaN(Number(parentType))) {
    parentType = getLastItemFromPath(parentPath, 2);
  }

  // Child component
  switch (parentType) {
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
};

const addPathDelimiter = (a: string | undefined, b: string) => {
  return a ? `${a}.${b}` : b;
};

const joinPath = (path: string[]) =>
  path.reduce((res, cur) => {
    if (!res) {
      return cur;
    }

    const t = Number(cur);

    if (isNaN(t)) {
      return `${res}.${cur}`;
    }

    return `${res}[${cur}]`;
  }, "");

const pathBreakdown = (path: string | undefined) => {
  if (!path) {
    return { current: "", parent: "", full: "" };
  }

  const pathSteps = path.split(".");

  return {
    current: [...pathSteps].pop(),
    parent: joinPath([...pathSteps].slice(0, -1)),
    full: joinPath([...pathSteps]),
  };
};

const updateAtPath = ({
  path,
  value,
  source = {},
}: {
  path: string | undefined;
  value: any;
  source: AnyObject | undefined;
}) => {
  if (!path) {
    return {};
  }

  const pathSteps = path.split(".");

  if (!pathSteps || pathSteps.length === 0) {
    return {};
  }

  const pathDetails = pathBreakdown(path);

  let deepSourceCopy = structuredClone(source);

  deepSourceCopy = pathDetails.parent
    ? set(deepSourceCopy, pathDetails.parent, {})
    : {};

  return set(deepSourceCopy, pathDetails.full, value);
};

const transformPredicateDataForRender = (data: AnyObject) => {
  // parentPath is used to update item in ClaimantPicker using Lodash set()
  function loop(items: AnyObject, parentPath = ""): AnyObject[] {
    return Object.entries(items).map((item) => {
      const [key, value] = item;

      if (Array.isArray(value)) {
        return {
          parentPath,
          type: key,
          // If value is array, we need to loop through all items.
          value: flatten(
            value.map((v, i) => {
              // If there is no value yet, return default.
              return isEmpty(v)
                ? [
                    {
                      parentPath: addPathDelimiter(parentPath, `${key}.${i}`),
                      type: "",
                      value: [],
                    },
                  ]
                : loop(v, addPathDelimiter(parentPath, `${key}.${i}`));
            }),
          ),
        };
      } else {
        const isTimeValue = key === "absolute" || key === "relative";
        const isValueString = typeof value === "string";

        return {
          parentPath,
          type: key,
          // If value is empty or type string (it means time value is set and
          // we need to stop), we return default or value.
          value:
            isEmpty(value) || isValueString
              ? [
                  {
                    parentPath: addPathDelimiter(parentPath, key),
                    type: "",
                    value: isTimeValue ? (isValueString ? value : "") : [],
                  },
                ]
              : loop(value, addPathDelimiter(parentPath, key)),
        };
      }
    });
  }

  // Return value is array of formatted items for rendering.
  return loop(data);
};
