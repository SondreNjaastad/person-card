
import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers';

import './editor';

import { actionConfigStruct, entitiesConfigStruct, PersonCardConfig } from './types';
import style from './style';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';
import { hasConfigOrEntityChanged } from './custom-should-update';
import { EntityConfig } from 'custom-card-helpers';
import {  array, object, optional, string, assert } from 'superstruct';

/* eslint no-console: 0 */
console.info(
  `%c  person-CARD \n%c  ${localize('common.version')} ${CARD_VERSION}    `,
  'color: orange; font-weight: bold; background: black',
  'color: white; font-weight: bold; background: dimgray',
);

(window as any).customCards = (window as any).customCards || [];
(window as any).customCards.push({
  type: 'person-card',
  name: 'person Card',
  description: 'A template custom card for you to create something awesome',
});

const cardConfigStruct = object({
  type: string(),
  person: string(),
  banner_image_url: optional(string()),
  phone_battery_sensor: optional(string()),
  presence_color: optional(string()),
  entities: optional(array(entitiesConfigStruct)),
  tap_action: optional(actionConfigStruct),
  hold_action: optional(actionConfigStruct),
  double_tap_action: optional(actionConfigStruct),
});

// TODO Name your custom element
@customElement('person-card')
export class personCard extends LitElement {
  public static async getConfigElement(): Promise<LovelaceCardEditor> {
    return document.createElement('person-card-editor');
  }

  public static getStubConfig(): object {
    return {};
  }

  // TODO Add any properities that should cause your element to re-render here
  @property() public hass!: HomeAssistant;
  @property() private config!: PersonCardConfig;

  public setConfig(config: PersonCardConfig): void {
    // TODO Check for required fields and that they are of the proper format
    assert(config, cardConfigStruct);

    if (config.test_gui) {
      getLovelace().setEditMode(true);
    }

    this.config = {
      name: 'person',
      ...config,
    };
  }

  protected shouldUpdate(changedProps: PropertyValues): boolean {
    if (!this.config) {
      return false;
    }
    return hasConfigOrEntityChanged(this, changedProps, false);
  }

  protected render(): TemplateResult | void {
    var person;
    var device;
    var borderColor;

    if(this.config.person !== undefined)
        person = this.hass.states[this.config.person];
    
    if(this.config.phone_battery_sensor !== undefined)
        device = this.hass.states[this.config.phone_battery_sensor];
    
    if(this.config.presence_color !== undefined)
        borderColor = this.hass.states[this.config.presence_color];

    return html`
      <ha-card
        @action=${this._handleAction}
        .actionHandler=${actionHandler({
          hasHold: hasAction(this.config.hold_action),
          hasDoubleClick: hasAction(this.config.double_tap_action),
        })}
        tabindex="0"
        .label=${`person: ${this.config.person || 'No Person Defined'}`}
      >
      <div class="card-body">
        <div class="header-image"
        style="background-image: url('${this.config.banner_image_url ? this.config.banner_image_url : ''}');"
        ></div>
            <img
                class="person-image"
                src="${person.attributes.entity_picture}"
                />
            <div class="presence-indicator" style="${borderColor ? 'background-color: ' + borderColor.state : `display: none`}"></div>
            <div class="location-and-battery">
                <span class="location"><ha-icon .icon=${`mdi:map-marker`}></ha-icon> ${person.state}</span>
                <span class="battery">${device ? html`<ha-icon .icon=${device.attributes.icon}></ha-icon> ${device.state}%` : `` }</span>
            </div>
            <div class="name">
                ${person.attributes.friendly_name}
            </div>
            <div class="card-attributes">
                ${this.config.entities?.map((ent: EntityConfig) => {
                    const stateObj = this.hass.states[ent.entity];
                    return stateObj
                        ? html`
                            <div class="card-attribute"><ha-icon .icon=${stateObj.attributes.icon ? stateObj.attributes.icon : `mdi:eye`}></ha-icon> ${stateObj.state}</div>
                            `
                        : html`<div class="not-found">Entity ${ent} not found.</div>`;
                })}
            </div>
        </div>
      </ha-card>
    `;
  }

  private _handleAction(ev: ActionHandlerEvent): void {
    if (this.hass && this.config && ev.detail.action) {
      handleAction(this, this.hass, this.config, ev.detail.action);
    }
  }

  static get styles(): CSSResult {
    return style;
  }
}