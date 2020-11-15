  
import { PropertyValues } from "lit-element";

import { HomeAssistant } from "custom-card-helpers";

// Check if config or Entity changed
export function hasConfigOrEntityChanged(
  element: any,
  changedProps: PropertyValues,
  forceUpdate: Boolean,
): boolean {
  if (changedProps.has('config') || forceUpdate) {
    return true;
  }

  if (element.config!.person) {
    var hasChanged = false;
    hasChanged = hasChanged || checkEntity(changedProps, element, element.config!.person);
    hasChanged = hasChanged || checkEntity(changedProps, element, element.config!.phone_battery_sensor);
    hasChanged = hasChanged || checkEntity(changedProps, element, element.config!.border_color);
    return hasChanged;
  } else {
    return false;
  }
}

function checkEntity(changedProps, element, entityId) {
    const oldHass = changedProps.get('hass') as HomeAssistant | undefined;
    if (oldHass) {
      return (
        oldHass.states[entityId]
        !== element.hass!.states[entityId]
      );
    }
    return true;
}