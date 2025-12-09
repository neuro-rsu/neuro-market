import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('simple-button', class SimpleButton extends BaseElement {
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
                    padding: 0px 10px 1px;
                    cursor: pointer;
                    background-color: lightgray;
                    /* border: 1px solid gray; */
                    border-radius: 2px;
                    overflow: hidden;
                    color: gray;
                    font-weight: 600;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    line-height: 1em;
                    transition: transform ease-in 0.1s;
                }
                :host(:not([disable])) {
                    background-color: #fdfdfd;
                }
                :host(:not([disable]):active) {
                    transform: scale(.97);
                    /* box-shadow: 0px 0px 5px 2px rgba(255,255,255,0.5); */
                    /* box-shadow: 0px 0px 2px 2px rgba(255,255,255,0.8); */
                }
                :host(:not([disable]):hover) {
                    background-color: var(--active-form-button, red);
                    color: white;
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