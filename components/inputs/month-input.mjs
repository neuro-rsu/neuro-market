import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

import styles from './input-css.mjs'

customElements.define("month-input", class MonthInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'date'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            oldValue: { type: String, default: ''},
        }
    }

    static get styles() {
        return [
            styles,
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    width: 100%;
                    color: var(--form-input-color, gray);
                }
            `
        ]
    }

    constructor() {
        super();
        // this.months = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        this.months = [lang`Month`, lang`January`, lang`February`, lang`March`, lang`April`, lang`May`, lang`June`, lang`July`, lang`August`, lang`September`, lang`October`, lang`November`, lang`December`];
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.oldValue ??= this.value;
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name=${this.iconName}></simple-icon>
        `
    }

    // get value() {
    //     return this._value;
    // }

    // set value(value) {
    //     const oldValue = this.value;
    //     this._value = value;
    //     this.requestUpdate('value', oldValue);
    // }

    get value() {
        return this.renderRoot?.querySelector('select')?.value ?? null;
    }

    set value(value) {
        const input = this.renderRoot?.querySelector('select');
        if (input) {
            input.value= value;
        }
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName || nothing} @click=${this.updateLoginValue}></simple-icon>
        `
    }

    // <option ?selected=${month==="Month"} ?disabled=${month==="Month"} value=${index}>${month}</option>

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <select>
                    ${this.months.map( (month , index) =>
                        html`
                            <option ?selected=${month==="Месяц"} ?disabled=${month==="Месяц"} value=${index}>${month}</option>
                        `)
                    }
                </select>
                ${this.iconName ? this.#icon : ''}
            </div>
        `;
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        const options = {
            bubbles: true,
            composed: true
          };
        this.dispatchEvent(new CustomEvent('value-changed', options));
    }
    // <div id="poly-stage-128" class="poly-content-box select-box">
    //                 <div class="select-box-current" tabindex="1">
    //                     <div class="select-box-value">
    //                         <input class="select-box-input" type="radio" id="stage-128-0" value="" name="stage-128" checked="checked">
    //                         <p class="select-box-input-text" placeholder="">Enter stage</p>
    //                     </div>
    //                     <img class="select-box-icon" src="https://cdn.onlinewebfonts.com/svg/img_295694.svg" alt="Arrow Icon" aria-hidden="true"><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-1" value="1" name="stage-128">
    //                                         <p class="select-box-input-text">1 этап</p>
    //                                     </div><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-2" value="2" name="stage-128">
    //                                         <p class="select-box-input-text">2 этап</p>
    //                                     </div><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-3" value="3" name="stage-128">
    //                                         <p class="select-box-input-text">3 этап (закл.)</p>
    //                                     </div><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-4" value="4" name="stage-128">
    //                                         <p class="select-box-input-text">финал</p>
    //                                     </div><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-5" value="5" name="stage-128">
    //                                         <p class="select-box-input-text">отбор к ПМ</p>
    //                                     </div><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-6" value="6" name="stage-128">
    //                                         <p class="select-box-input-text">отбор к ЧР</p>
    //                                     </div><div class="select-box-value">
    //                                         <input class="select-box-input" type="radio" id="stage-128-7" value="7" name="stage-128">
    //                                         <p class="select-box-input-text">финал</p>
    //                                     </div></div>
    //                     <ul class="select-box-list"><li>
    //                                         <label class="select-box-option" for="stage-128-1" aria-hidden="aria-hidden">1 этап</label>
    //                                     </li><li>
    //                                         <label class="select-box-option" for="stage-128-2" aria-hidden="aria-hidden">2 этап</label>
    //                                     </li><li>
    //                                         <label class="select-box-option" for="stage-128-3" aria-hidden="aria-hidden">3 этап (закл.)</label>
    //                                     </li><li>
    //                                         <label class="select-box-option" for="stage-128-4" aria-hidden="aria-hidden">финал</label>
    //                                     </li><li>
    //                                         <label class="select-box-option" for="stage-128-5" aria-hidden="aria-hidden">отбор к ПМ</label>
    //                                     </li><li>
    //                                         <label class="select-box-option" for="stage-128-6" aria-hidden="aria-hidden">отбор к ЧР</label>
    //                                     </li><li>
    //                                         <label class="select-box-option" for="stage-128-7" aria-hidden="aria-hidden">финал</label>
    //                                     </li>
    //             </ul></div>
});