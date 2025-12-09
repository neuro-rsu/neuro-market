import { BaseElement, html, css } from '../../js/base-element.mjs';

import styles from './input-css.mjs'

customElements.define("groupbox-input", class GroupboxInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            value: { type: Array, default: []},
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
                    flex-basis: 50%;
                    margin: 8px 0;
                }
                input {
                    appearance: none;
                    width: 1rem;
                    aspect-ratio: 1;
                    border: 1px solid white;

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

    firstUpdated(setPath = false) {
        super.firstUpdated();
    }

    get #legend() {
        return html`<legend>${this.label}</legend>`;
    }

    render() {
        return html`
            <fieldset class="fieldset">
                ${ this.label ? this.#legend : '' }
                <slot>
                </slot>
            </fieldset>
        `;
    }

});