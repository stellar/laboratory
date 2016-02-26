import React from 'react';
import classNames from 'classnames';
import {endpointsMap} from '../data/endpoints';
import {map, findIndex} from 'lodash';

export function EndpointPicker(props) {
  let {onChange, currentResource, currentEndpoint} = props;
  let resources = makeItems(endpointsMap);

  let resourcePicker = <div className="EndpointPicker__section">
    <p className="EndpointPicker__section__title">1. Select a resource</p>
    <ButtonGroup
      items={resources}
      onChange={newResource => onChange(newResource, "")}
      selectedIndex={findIndex(resources, {id: currentResource})}
      />
  </div>

  let endpointPicker = null;
  if (currentResource !== "") {
    let endpoints = makeItems(endpointsMap[currentResource].endpoints);
    endpointPicker = <div className="EndpointPicker__section">
      <p className="EndpointPicker__section__title">2. Select an endpoint</p>
      <ButtonGroup
        items={endpoints}
        onChange={newEndpoint => onChange(currentResource, newEndpoint)}
        selectedIndex={findIndex(endpoints, {id: currentEndpoint})}
        />
    </div>;
  }

  return <div className="EndpointPicker">
    {resourcePicker}
    {endpointPicker}
  </div>;
}

function ButtonGroup(props) {
  let {onChange, items, selectedIndex} = props;

  let buttons = items.map((item, idx) => {
    let selected = selectedIndex === idx;
    return <ButtonGroupButton
      {...item}
      selected={selected}
      key={idx}
      onChange={onChange}
      />
  })

  return <nav className="s-buttonGroup s-buttonGroup--vertical">{buttons}</nav>;
}

function ButtonGroupButton(props) {
  let {selected, label, onChange, id} = props;
  let classes = classNames(
    's-button',
    's-button--light',
    {"is-active": selected},
  )

  return  <li className={classes} onClick={() => onChange(id)}>{label}</li>;
}

const makeItems = (itemMap) => map(itemMap, (value, id) => {
  return {id, label: value.label }
});
