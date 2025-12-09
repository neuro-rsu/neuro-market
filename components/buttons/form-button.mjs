import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('form-button', class FormButton extends BaseElement {
    // static get properties() {
    //     return {
    //         title: { type: String, default: '' },
    //     }
    // }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    width: 100%;
                    padding: 11px 20px 13px;
                    cursor: pointer;
                    background-color: lightgray;
                    border: none;
                    border-radius: 10px;
                    overflow: hidden;
                    color: white;
                    font-weight: 700;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 1em;
                    transition: transform ease-in 0.1s;
                }
                :host(:not([disable])) {
                    background-color: var(--background-green);
                }
                :host(:not([disable]):active) {
                    transform: scale(.97);
                }
                :host(:not([disable]):hover) {
                    background-color: var(--active-form-button, red);
                }

                /* :host(:active) {
                    transform: scale(.97);
                } */
            `
        ];
    }

    render() {
        return html`
            <slot></slot>
        `;
    }
});