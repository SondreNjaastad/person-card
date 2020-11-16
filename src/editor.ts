import { LitElement, html, customElement, property, TemplateResult, CSSResult, css } from 'lit-element';
import { HomeAssistant, fireEvent, LovelaceCardEditor, ActionConfig } from 'custom-card-helpers';
import { processEditorEntities } from "./process-editor-entities";

import { EntitiesEditorEvent, PersonCardConfig } from './types';
import { EntityConfig } from 'custom-card-helpers';
import { internalProperty } from 'lit-element';

const options = {
  required: {
    icon: 'tune',
    name: 'Required',
    secondary: 'Required options for this card to function',
    show: true,
  },
  actions: {
    icon: 'gesture-tap-hold',
    name: 'Actions',
    secondary: 'Perform actions based on tapping/clicking',
    show: false,
    options: {
      tap: {
        icon: 'gesture-tap',
        name: 'Tap',
        secondary: 'Set the action to perform on tap',
        show: false,
      },
      hold: {
        icon: 'gesture-tap-hold',
        name: 'Hold',
        secondary: 'Set the action to perform on hold',
        show: false,
      },
      double_tap: {
        icon: 'gesture-double-tap',
        name: 'Double Tap',
        secondary: 'Set the action to perform on double tap',
        show: false,
      },
    },
  },
  optional: {
    icon: 'tune',
    name: 'Optional',
    secondary: 'Additions to make the card more rich',
    show: false,
  },
};

@customElement('person-card-editor')
export class PersonCardEditor extends LitElement implements LovelaceCardEditor {
  @property() public hass?: HomeAssistant;
  @property() private _config?: PersonCardConfig;
  @property() private _toggle?: boolean;
  @property() private _helpers?: any;
  private _initialized = false;
  @internalProperty() private _configEntities?: EntityConfig[];

  public setConfig(config: PersonCardConfig): void {
    this._config = config;
    this._configEntities = config.entities
      ? processEditorEntities(config.entities)
      : [];

    this.loadCardHelpers();
  }

  protected shouldUpdate(): boolean {
    if (!this._initialized) {
      this._initialize();
    }

    return true;
  }

  get _name(): string {
    if (this._config) {
      return this._config.name || '';
    }

    return '';
  }

  get _border_color(): string {
    if (this._config) {
      return this._config.border_color || 'white';
    }

    return '';
  }

  get _entities(): EntityConfig[] {
    if (this._config) {
      return this._config.entities || [];
    }

    return [];
  }

  get _person(): string {
    if (this._config) {
      return this._config.person || '';
    }

    return '';
  }

  get _phone_battery_sensor(): string {
    if (this._config) {
      return this._config.phone_battery_sensor || '';
    }

    return '';
  }

  get _banner_image_url(): string {
    if (this._config) {
      return this._config.banner_image_url || '';
    }

    return '';
  }

  get _tap_action(): ActionConfig {
    if (this._config) {
      return this._config.tap_action || { action: 'more-info' };
    }

    return { action: 'more-info' };
  }

  get _hold_action(): ActionConfig {
    if (this._config) {
      return this._config.hold_action || { action: 'none' };
    }

    return { action: 'none' };
  }

  get _double_tap_action(): ActionConfig {
    if (this._config) {
      return this._config.double_tap_action || { action: 'none' };
    }

    return { action: 'none' };
  }

  private _entitiesValueChanged(ev: EntitiesEditorEvent): void {
    if (!this._config || !this.hass) {
      return;
    }
    if (ev.detail && ev.detail.entities) {
      this._config = { ...this._config, entities: ev.detail.entities };

      this._configEntities = processEditorEntities(this._config.entities);
      fireEvent(this, "config-changed", { config: this._config });
    }
  }

  protected render(): TemplateResult | void {
    if (!this.hass || !this._helpers) {
      return html``;
    }

    // The climate more-info has ha-switch and paper-dropdown-menu elements that are lazy loaded unless explicitly done here
    this._helpers.importMoreInfoControl('climate');

    // You can restrict on domain type
    const people = Object.keys(this.hass.states).filter(eid => eid.startsWith('person'));
    const sensors = Object.keys(this.hass.states).filter(eid => eid.startsWith('sensor'));

    return html`
      <div class="card-config">
        <div class="option" @click=${this._toggleOption} .option=${'required'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.required.icon}`}></ha-icon>
            <div class="title">${options.required.name}</div>
          </div>
          <div class="secondary">${options.required.secondary}</div>
        </div>
        ${options.required.show
          ? html`
              <div class="values">
                <ha-entity-picker
                .hass="${this.hass}"
                label="Person"
                .value="${this._person}"
                .configValue=${"person"}
                .includeDomains=${['person']}
                @change="${this._valueChanged}"
                allow-custom-entity
                ></ha-entity-picker>
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'actions'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.actions.icon}`}></ha-icon>
            <div class="title">${options.actions.name}</div>
          </div>
          <div class="secondary">${options.actions.secondary}</div>
        </div>
        ${options.actions.show
          ? html`
              <div class="values">
                <div class="option" @click=${this._toggleAction} .option=${'tap'}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${options.actions.options.tap.icon}`}></ha-icon>
                    <div class="title">${options.actions.options.tap.name}</div>
                  </div>
                  <div class="secondary">${options.actions.options.tap.secondary}</div>
                </div>
                ${options.actions.options.tap.show
                  ? html`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `
                  : ''}
                <div class="option" @click=${this._toggleAction} .option=${'hold'}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${options.actions.options.hold.icon}`}></ha-icon>
                    <div class="title">${options.actions.options.hold.name}</div>
                  </div>
                  <div class="secondary">${options.actions.options.hold.secondary}</div>
                </div>
                ${options.actions.options.hold.show
                  ? html`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `
                  : ''}
                <div class="option" @click=${this._toggleAction} .option=${'double_tap'}>
                  <div class="row">
                    <ha-icon .icon=${`mdi:${options.actions.options.double_tap.icon}`}></ha-icon>
                    <div class="title">${options.actions.options.double_tap.name}</div>
                  </div>
                  <div class="secondary">${options.actions.options.double_tap.secondary}</div>
                </div>
                ${options.actions.options.double_tap.show
                  ? html`
                      <div class="values">
                        <paper-item>Action Editors Coming Soon</paper-item>
                      </div>
                    `
                  : ''}
              </div>
            `
          : ''}
        <div class="option" @click=${this._toggleOption} .option=${'optional'}>
          <div class="row">
            <ha-icon .icon=${`mdi:${options.optional.icon}`}></ha-icon>
            <div class="title">${options.optional.name}</div>
          </div>
          <div class="secondary">${options.optional.secondary}</div>
        </div>
        ${options.optional.show
          ? html`
          <div class="values">
            <ha-entity-picker
                .hass="${this.hass}"
                label="Person Border Color"
                .value="${this._border_color}"
                .configValue=${"border_color"}
                .includedDomains=${['sensor']}
                @change="${this._valueChanged}"
                allow-custom-entity
            ></ha-entity-picker>
            </div>
            <div class="values">
            <ha-entity-picker
                  .hass="${this.hass}"
                  label="Phone Battery Sensor"
                  .value="${this._phone_battery_sensor}"
                  .configValue=${"phone_battery_sensor"}
                  .includeDomains=${['sensor']}
                  @change="${this._valueChanged}"
                  allow-custom-entity
              ></ha-entity-picker>
            </div>
            <div class="values">
              <paper-input
              label="Banner image URL"
              .value=${this._banner_image_url}
              .configValue=${'banner_image_url'}
              @value-changed=${this._valueChanged}
              ></paper-input>
            </div>
            <hui-entity-editor
                .hass="${this.hass}"
                .entities="${this._configEntities}"
                label="Extra Entites"
                @entities-changed="${this._entitiesValueChanged}"
            >
            </hui-entity-editor>
        </div>
            `
          : ''}
      </div>
    `;
  }

  private _initialize(): void {
    if (this.hass === undefined) return;
    if (this._config === undefined) return;
    if (this._helpers === undefined) return;
    this._initialized = true;
  }

  private async loadCardHelpers(): Promise<void> {
    this._helpers = await (window as any).loadCardHelpers();
  }

  private _toggleAction(ev): void {
    this._toggleThing(ev, options.actions.options);
  }

  private _toggleOption(ev): void {
    this._toggleThing(ev, options);
  }

  private _toggleThing(ev, optionList): void {
    const show = !optionList[ev.target.option].show;
    for (const [key] of Object.entries(optionList)) {
      optionList[key].show = false;
    }
    optionList[ev.target.option].show = show;
    this._toggle = !this._toggle;
  }

  private _valueChanged(ev): void {
    if (!this._config || !this.hass) {
      return;
    }
    const target = ev.target;
    if (this[`_${target.configValue}`] === target.value) {
      return;
    }
    if (target.configValue) {
      if (target.value === '') {
        delete this._config[target.configValue];
      } else {
        this._config = {
          ...this._config,
          [target.configValue]: target.checked !== undefined ? target.checked : target.value,
        };
      }
    }
    fireEvent(this, 'config-changed', { config: this._config });
  }

  static get styles(): CSSResult {
    return css`
      .option {
        padding: 4px 0px;
        cursor: pointer;
      }
      .row {
        display: flex;
        margin-bottom: -14px;
        pointer-events: none;
      }
      .title {
        padding-left: 16px;
        margin-top: -6px;
        pointer-events: none;
      }
      .secondary {
        padding-left: 40px;
        color: var(--secondary-text-color);
        pointer-events: none;
      }
      .values {
        padding-left: 16px;
        background: var(--secondary-background-color);
        display: grid;
      }
      ha-formfield {
        padding-bottom: 8px;
      }
    `;
  }
}