import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

import styles from './input-css.mjs'

customElements.define("gender-input", class GenderInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
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
                    color: var(--form-label-input-color, white);
                    margin-top: 8px;
                }
                fieldset {
                    display: flex;
                    justify-content: space-evenly;
                    align-items: center;
                    flex-wrap: wrap;
                }

                label {
                    display: inline-flex;
                    line-height: 1rem;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    font-weight: bold;
                    margin: 8px 0;
                }

                input {
                    appearance: none;
                    width: 1rem;
                    aspect-ratio: 1;
                    border: 2px solid white;
                    border-radius: 50%;
                    cursor: pointer;
                    margin: 0;
                    transition: .3s easy-in;
                }

                input:checked {
                    border-width: 8px;
                    outline: red auto 1px;
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
    }

    get #legend() {
        return html`<legend>${this.label}</legend>`;
    }

    setValue(value) {
        this.value = value;
        this.fire('input')
    }

    setChecked(gender) {
        const input = this.renderRoot.getElementById(gender);
        if (!input) {
            if (this.value)
                return this.value == gender
            return false
        }
        input.checked = this.value == gender
        return input.checked;
    }

    render() {
        return html`
            <fieldset class="fieldset">
                ${this.label ? this.#legend : ''}
                <label><input type="radio" name="gender" ?checked=${this.setChecked("0")} id="0" value="0" @input=${this.changeValue}>${lang`Male`}</label>
                <label><input type="radio" name="gender" ?checked=${this.setChecked("1")} id="1" value="1" @input=${this.changeValue}>${lang`Female`}</label>
            </fieldset>
        `;
    }

    changeValue(e) {
        this.value = e.target.value
    }
});