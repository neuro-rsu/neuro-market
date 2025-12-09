import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'
import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

import './year-input.mjs'
import './month-input.mjs'
import './simple-input.mjs'

customElements.define("birthday-input", class BirthdayInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'date'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            // value: { type: String, default: ''},
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
                .input-group {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 20px;
                    width: 100%;
                }
            `
        ]
    }

    constructor() {
        super();
        this.months = ['Month', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
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
        if (!this.renderRoot)
            return undefined;
        const day = this.renderRoot.getElementById("day").value;
        const month = this.renderRoot.getElementById("month").value;
        const year = this.renderRoot.getElementById("year").value;
        if (day&&month&&year) {
            return `${year}-${month.toString().padStart(2,0)}-${day.toString().padStart(2,0)}`
        }
        return undefined
    }

    set value(value) {
        if (!this.renderRoot) {
            return;
        }
        const day = this.renderRoot.getElementById("day");
        const month = this.renderRoot.getElementById("month");
        const year = this.renderRoot.getElementById("year");
        if (!value) {
            if (day.value) {
                day.value = ""
            }
            if (month.value) {
                month.value = 0
            }
            if (year.value) {
                year.value = 'Year'
            }
            return;
        }
        const date = value.split('-')
        day.value = date[2];
        month.value = +date[1];
        year.value = +date[0];
    }

    setValue(value) {
        this.value = value;
        this.fire('input')
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName || nothing} @click=${this.updateLoginValue}></simple-icon>
        `
    }

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <simple-input id="day" placeholder="${lang`Day`}" icon-name="calendar-days-solid" @input=${this.changeValue}></simple-input>
                <month-input id="month" icon-name="calendar-week-solid" @input=${this.changeValue}></month-input>
                <year-input id="year" icon-name="calendar-solid" @input=${this.changeValue}></year-input>
            </div>
        `;
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        const day = this.renderRoot.getElementById("day")?.value;
        const month = this.renderRoot.getElementById("month")?.value;
        const year = this.renderRoot.getElementById("year")?.value;
        if (!(day&&month&&year))
            e.stopPropagation()
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