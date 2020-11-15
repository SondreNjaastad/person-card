  
import { LitElement, html, customElement, property, CSSResult, TemplateResult, css, PropertyValues } from 'lit-element';
import {
  HomeAssistant,
  hasConfigOrEntityChanged,
  hasAction,
  ActionHandlerEvent,
  handleAction,
  LovelaceCardEditor,
  getLovelace,
} from 'custom-card-helpers';

import './editor';

import { PersonCardConfig } from './types';
import style from './style';
import { actionHandler } from './action-handler-directive';
import { CARD_VERSION } from './const';

import { localize } from './localize/localize';

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
    if (!config || config.show_error) {
      throw new Error(localize('common.invalid_configuration'));
    }

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
    // TODO Check for stateObj or other necessary things and render a warning if missing
    if (this.config.show_warning) {
      return this.showWarning(localize('common.show_warning'));
    }

    var person;
    var device;
    var borderColor;

    if(this.config.person !== undefined)
        person = this.hass.states[this.config.person];
    
    if(this.config.phone_battery_sensor !== undefined)
        device = this.hass.states[this.config.phone_battery_sensor];
    
    if(this.config.border_color !== undefined)
        borderColor = this.hass.states[this.config.border_color];

    console.log(this.hass.states)

    console.log(person);
    
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
        <div class="header-image"></div>
            <img
                class="person-image"
                style="border-color: ${borderColor ? borderColor.state : `white`};"
                src="${person.attributes.entity_picture}"
                />
            <div class="location-and-battery">
                <span class="location"><ha-icon .icon=${`mdi:map-marker`}></ha-icon> ${person.state}</span>
                <span class="battery"><ha-icon .icon=${device.attributes.icon}></ha-icon> ${device.state}%</span>
            </div>
            <div class="name">
                ${person.attributes.friendly_name}
            </div>
            <div class="card-attributes">
                ${this.config.entities?.map(ent => {
                    const stateObj = this.hass.states[ent];
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

  private showWarning(warning: string): TemplateResult {
    return html`
      <hui-warning>${warning}</hui-warning>
    `;
  }

  private showError(error: string): TemplateResult {
    const errorCard = document.createElement('hui-error-card');
    errorCard.setConfig({
      type: 'error',
      error,
      origConfig: this.config,
    });

    return html`
      ${errorCard}
    `;
  }

  static get styles(): CSSResult {
    return style;
  }
}