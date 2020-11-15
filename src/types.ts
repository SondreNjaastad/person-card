import { EntityConfig } from 'custom-card-helpers';
import { ActionConfig, LovelaceCard, LovelaceCardConfig, LovelaceCardEditor } from 'custom-card-helpers';

declare global {
  interface HTMLElementTagNameMap {
    'person-card-editor': LovelaceCardEditor;
    'hui-error-card': LovelaceCard;
  }
}

// TODO Add your configuration elements here for type-checking
export interface PersonCardConfig extends LovelaceCardConfig {
  type: string;
  name?: string;
  show_warning?: boolean;
  show_error?: boolean;
  test_gui?: boolean;
  person?: string;
  banner_image_url?: string;
  phone_battery_sensor?: string;
  border_color?: string;
  entities?: EntityConfig[];
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