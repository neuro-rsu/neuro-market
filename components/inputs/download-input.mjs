import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'

customElements.define("download-input", class DownloadInput extends BaseElement {
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
                    color: var(--form-input-color, gray);
                    cursor: pointer;
                }


            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.oldValue ??= this.value;
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name=${this.iconName}></simple-icon>
        `
    }

    get value() {
        return this.renderRoot?.querySelector('input')?.value ?? null;
    }

    set value(value) {
        const input = this.renderRoot?.querySelector('input');
        if (input) {
            input.value= value;
        }
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName || nothing} @click=${this.updateLoginValue}></simple-icon>
        `
    }

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <input style="cursor: pointer;" type=${this.type}
                    placeholder=${this.placeholder || nothing}
                    ${this.required ? 'required' : ''}
                    .value=${this.value || nothing} @keyup=${this.changeValue}
                    readonly
                >
                ${this.iconName ? this.#icon : ''}
                ${this.buttonName ? this.#button : ''}
            </div>
        `;
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        const options = {
            bubbles: true,
            composed: true
          };
        this.dispatchEvent(new CustomEvent('value-changed', options));
    }
});