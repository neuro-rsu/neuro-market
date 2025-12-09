import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define("simple-informer", class SimpleInformer extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            infoMessage: { type: String, default: '', attribute: "info-message" },
            errorMessage: { type: String, default: '', attribute: "error-message" },
            iconInfo: { type: String, default: 'circle-info-sharp-solid', attribute: 'icon-name'},
            iconError: { type: String, default: 'circle-xmark-sharp-solid', attribute: 'icon-name'},
            isInfo: { type: Boolean, default: true},
            isError: { type: Boolean, default: false},
            errorCheck: { type: Function, default: undefined},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    align-items: center;
                    width: 95%;
                    /* color: var(--form-input-color, gray); */
                    color: gray;
                    overflow: hidden;
                    word-break: break-word;
                    gap: 10px;
                    font-size: 14px;
                    margin: auto;
                }
                simple-icon {
                    width: 16px;
                    line-height: 1em;
                    flex-shrink: 0;
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.oldValue ??= this.value;
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name=${this.isInfo ? this.iconInfo : this.iconError} @click=${this.iconClick}></simple-icon>
        `
    }

    iconClick() {
        this.isInfo = !this.isInfo
    }

    render() {
        return html`
            ${this.#icon}
            ${this.isInfo ? this.infoMessage : this.errorMessage}
        `;
    }

    focus() {
        this.#input.focus()
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        this.value = e.target.value;
    }
});