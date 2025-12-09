import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'

customElements.define("radio-group-input", class RadioGroupInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            value: { type: String, default: ''},
            items: { type: Array, default: []},

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
                    flex-direction: column;
                    align-items: flex-start;
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
                    height: 1rem;
                    aspect-ratio: 1;
                    border: 2px solid var(--form-background-color);
                    outline: 1px solid var(--form-input-color, white);
                    border-radius: 50%;
                    cursor: pointer;
                    margin: 0;
                    transition: .3s easy-in;
                }

                input:checked {
                    background-color: var(--form-input-color, red);
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


    render() {
        return html`
            <fieldset class="fieldset">
                ${ this.label ? this.#legend : '' }
                ${ this.items?.map( (item, index) =>
                    html`
                        <label><input type="radio" name="group" ?checked=${item.checked} value=${index} @input=${this.changeValue}>${item?.name}</label>
                    `
                )}
            </fieldset>
        `;
    }

    changeValue(e) {
        this.value = e.target.value
    }
});