import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'

customElements.define("checkbox-input", class CheckboxInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'checkbox'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            value: { type: Boolean, default: false},
            oldValue: { type: Array, default: null},
        }
    }

    static get styles() {
        return [
            styles,
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    color: var(--form-label-input-color, white);
                }
                slot {
                    display: flex;
                    flex-direction: column;
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
                    cursor: pointer;
                    margin: 0;
                    transition: .3s easy-in;
                }
                input:checked {
                    border-width: 8px;
                    outline: -webkit-focus-ring-color auto 1px;
                }
            `
        ]
    }

    get #legend() {
        return html`<legend>${this.label}</legend>`;
    }

    setChecked() {
        const input = this.renderRoot.querySelector('input');
        if (!input) {
            return false
        }
        input.checked = this.value
        return input.checked;
    }

    render() {
        return html`
            <label><input type="checkbox" ?checked=${this.setChecked()} value=${this.value} @input=${this.changeValue}>${this.label}</label>
        `;
    }

    changeValue(e) {
        this.value = e.target.checked
    }


});