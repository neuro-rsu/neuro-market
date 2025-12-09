import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('social-button', class SocialButton extends BaseElement {
    static get properties() {
        return {
            name: { type: String, default: '', isIcon: true },
            href: { type: String, default: '' },
            fill: { type: String, default: 'white' },
            scale: { type: String, default: '1.0' },
            color: { type: String, default: 'white' },
            title: { type: String, default: '' },
            size: { type: Number, default: 46 },

            backgroundColor: { type: String, default: 'var(--nav-item-active-background-color)' },
        }
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                vertical-align: middle;
                padding: 2px;
                user-select: none;
            }

            a {
                display: block;
                border-radius: 50%;
                align-items: center;
                cursor: pointer;
            }
        `;
    }

    firstUpdated() {
        super.firstUpdated();
    }

    render() {
        return html`
            <a href="${this.href}" style="background-color: ${this.backgroundColor};" target="_blank" title="${this.title}">
                <simple-icon icon-name="${this.name}" fill="${this.color}" size="${this.size}" scale="${this.scale}"></simple-icon>
            </a>
        `;
    }
});
