import { findIndex } from "lodash";
import { endpointsMap } from "data/endpoints";
import { EndpointItemProps, EndpointItemEndpoint } from "types/types.d";

interface EndpointPickerProps {
  onChange: (resource: string, endpoint: string) => void;
  currentResource: string;
  currentEndpoint: string;
}

interface ButtonGroupProps {
  onChange: (resource: string, endpoint: string) => void;
  items: {
    id: string;
    label: string;
  }[];
  selectedIndex: number;
}

interface ButtonGroupButtonProps {
  selected: boolean;
  label: string;
  onChange: (resource: string, endpoint: string) => void;
  id: string;
}

export const EndpointPicker = ({
  onChange,
  currentResource,
  currentEndpoint,
}: EndpointPickerProps) => {
  const makeItems = (itemMap: {
    [key: string]: EndpointItemProps | EndpointItemEndpoint;
  }) =>
    Object.entries(itemMap).map(([key, value]) => ({
      id: key,
      label: value.label,
    }));

  const resources = makeItems(endpointsMap);

  const ButtonGroupButton = ({
    selected,
    label,
    onChange,
    id,
  }: ButtonGroupButtonProps) => (
    <li
      role="link"
      className={`s-button s-button--light ${selected ? "is-active" : ""}`}
      onClick={() => onChange(id, "")}
    >
      {label}
    </li>
  );

  const ButtonGroup = ({
    onChange,
    items,
    selectedIndex,
  }: ButtonGroupProps) => (
    <nav className="s-buttonGroup s-buttonGroup--vertical">
      {items.map((item, idx) => (
        <ButtonGroupButton
          {...item}
          selected={selectedIndex === idx}
          key={idx}
          onChange={onChange}
        />
      ))}
    </nav>
  );

  const renderResourcePicker = () => (
    <div
      className="EndpointPicker__section"
      data-testid="endpoint-explorer-resource"
    >
      <p className="EndpointPicker__section__title">1. Select a resource</p>

      <ButtonGroup
        items={resources}
        onChange={(newResource: string) => onChange(newResource, "")}
        selectedIndex={findIndex(resources, { id: currentResource })}
      />
    </div>
  );

  const renderEndpointPicker = () => {
    if (!currentResource) {
      return null;
    }

    const endpoints = makeItems(endpointsMap[currentResource].endpoints);

    return (
      <div
        className="EndpointPicker__section"
        data-testid="endpoint-explorer-endpoint"
      >
        <p className="EndpointPicker__section__title">2. Select an endpoint</p>

        <ButtonGroup
          items={endpoints}
          onChange={(newEndpoint: string) =>
            onChange(currentResource, newEndpoint)
          }
          selectedIndex={findIndex(endpoints, { id: currentEndpoint })}
        />
      </div>
    );
  };

  return (
    <div className="EndpointPicker">
      {renderResourcePicker()}
      {renderEndpointPicker()}
    </div>
  );
};
