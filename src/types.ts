import { EntityConfig } from 'custom-card-helpers';
import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';
import { any, array, boolean, number, object, optional, string, union } from 'superstruct';

declare global {
  interface HTMLElementTagNameMap {
    'person-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface PersonCardConfig extends LovelaceCardConfig {
  type: string;
  person: string;
  banner_image_url?: string;
  phone_battery_sensor?: string;
  presence_color?: string;
  entities?: Array<EntityConfig>;
  tap_action?: ActionConfig;
  hold_action?: ActionConfig;
  double_tap_action?: ActionConfig;
}

export interface EntitiesEditorEvent {
  detail?: {
    entities?: EntityConfig[];
    item?: any;
  };
  target?: EventTarget;
}

export const actionConfigStruct = object({
  action: string(),
  navigation_path: optional(string()),
  url_path: optional(string()),
  service: optional(string()),
  service_data: optional(object()),
});

const buttonEntitiesRowConfigStruct = object({
  type: string(),
  name: string(),
  action_name: optional(string()),
  tap_action: actionConfigStruct,
  hold_action: optional(actionConfigStruct),
  double_tap_action: optional(actionConfigStruct),
});

const castEntitiesRowConfigStruct = object({
  type: string(),
  view: union([string(), number()]),
  dashboard: optional(string()),
  name: optional(string()),
  icon: optional(string()),
  hide_if_unavailable: optional(boolean()),
});

const callServiceEntitiesRowConfigStruct = object({
  type: string(),
  name: string(),
  service: string(),
  icon: optional(string()),
  action_name: optional(string()),
  service_data: optional(any()),
});

const conditionalEntitiesRowConfigStruct = object({
  type: string(),
  row: any(),
  conditions: array(
    object({
      entity: string(),
      state: optional(string()),
      state_not: optional(string()),
    })
  ),
});

const dividerEntitiesRowConfigStruct = object({
  type: string(),
  style: optional(any()),
});

const sectionEntitiesRowConfigStruct = object({
  type: string(),
  label: optional(string()),
});

const webLinkEntitiesRowConfigStruct = object({
  type: string(),
  url: string(),
  name: optional(string()),
  icon: optional(string()),
});

const buttonsEntitiesRowConfigStruct = object({
  type: string(),
  entities: array(
    union([
      object({
        entity: string(),
        icon: optional(string()),
        image: optional(string()),
        name: optional(string()),
      }),
      string(),
    ])
  ),
});

const attributeEntitiesRowConfigStruct = object({
  type: string(),
  entity: string(),
  attribute: string(),
  prefix: optional(string()),
  suffix: optional(string()),
  name: optional(string()),
});

export const entitiesConfigStruct = union([
  object({
    entity: string(),
    name: optional(string()),
    icon: optional(string()),
    image: optional(string()),
    secondary_info: optional(string()),
    format: optional(string()),
    state_color: optional(boolean()),
    tap_action: optional(actionConfigStruct),
    hold_action: optional(actionConfigStruct),
    double_tap_action: optional(actionConfigStruct),
  }),
  string(),
  buttonEntitiesRowConfigStruct,
  castEntitiesRowConfigStruct,
  conditionalEntitiesRowConfigStruct,
  dividerEntitiesRowConfigStruct,
  sectionEntitiesRowConfigStruct,
  webLinkEntitiesRowConfigStruct,
  buttonsEntitiesRowConfigStruct,
  attributeEntitiesRowConfigStruct,
  callServiceEntitiesRowConfigStruct,
]);