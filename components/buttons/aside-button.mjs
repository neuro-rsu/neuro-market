import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('aside-button', class AsideButton extends BaseElement {
    static get properties() {
        return {
            _useInfo: { type: Boolean, default: true },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            size: { type: Number, default: 24 },
            blink: {type: Boolean, default: false},
            my: { type: String, default: '', local: true},
            myGlobal: { type: String, default: '', global: true},
        }
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                vertical-align: middle;
                margin: 1px;
                user-select: none;
            }
            :host([active]) {
                color: red;
            }

            :host([active]) .btn:hover {
                filter: brightness(120%);
            }
            :host([active]) .btn:active {
                filter: brightness(80%);
            }

            div {
                display: flex;
                align-items: center;
                cursor: pointer;
                &:hover {
                    color: red;
                }
                &:active {
                    filter: brightness(80%);
                }
            }

            .blink {
                -webkit-animation: blink var(--blink-duration, 1s) linear infinite;
                -moz-animation: blink var(--blink-duration, 1s) linear infinite;
                animation: blink var(--blink-duration, 1s) linear infinite;
            }

            @keyframes blink {
                0% { color: inherit; }
                49% { color: inherit; }
                50% { color: red; }
                100% { color: red; }
            }

            @-webkit-keyframes blink {
                0% { color: inherit; }
                49% { color: inherit; }
                50% { color: red; }
                100% { color: red; }
            }

        `;
    }
    get #icon() {
        return html`<simple-icon icon-name=${this.iconName} size="${this.size}"></simple-icon>`;
    }
    render() {
        return html`
            <div class=${(this.blink ? 'blink' : '') || nothing}>
                <simple-icon blink="1000" icon-name=${this.iconName} size=${this.size}></simple-icon>
            </div>
        `;
    }
});
