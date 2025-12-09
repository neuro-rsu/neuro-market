import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('link-button', class LinkButton extends BaseElement {
    static get properties() {
        return {
            name: { type: String, default: ''},
            href: { type: String, default: '' },
            target: { type: String, default: '' },
            title: { type: String, default: '' },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: inline-flex;
                    justify-content: center;
                    align-items: center;
                    cursor: pointer;
                    border: none;
                    line-height: 1em;
                    outline: none;
                    transition: transform ease-in 0.1s;
                   
                }
                :host(:hover) {
                    font-weight:  bold;
                    color: var(--link-hover-color, red);
                }
                :host(:active) {
                    font-weight:  bold;
                    transform: scale(0.97);
                    color: var(--link-hover-color, red);
                }
            `
        ];
    }

    firstUpdated() {
        super.firstUpdated();
    }

    render() {
        return html`
            <slot></slot>
        `;
    }
});
