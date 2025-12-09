import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './modal-dialog-css.mjs'
import '../buttons/close-button.mjs';

customElements.define('modal-dialog', class ModalDialog extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            title: { type: String, default: 'Сообщение'},
            message: { type: String, default: 'Модальное окно'},
            opened: { type: Boolean, default: false},
            animateClose: { type: Boolean, default: false},
            type: {type: String, default: 'message'},
        }
    }

    static get styles() {
        return [
            formStyles,
            BaseElement.styles,
            css`
                :host {
                    color: var(--form-color);
                }
                button:focus {
                    outline: none;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    #buttons() {
        switch (this.type) {
            case "confirm":
                return html`
                    <button class="footer-button" @click=${this.ok}>Да</button>
                    <button class="footer-button" @click=${this.close}>Нет</button>
                `
            case "message":
            case "error":
                return html`
                    <button class="footer-button" @click=${this.ok}>Ок</button>
                `
            default:
                break;
        }
    }
    render() {
        return html`
            <div id="a1" class="modal-dialog ${this.opened ? 'show': ''} ${this.animateClose ? 'animate-close': ''}" tabindex="0" @keydown=${this.keyDown}>
                <div class="modal-dialog-content animate">
                    <header>
                        <span id="dialog-title" class="dialog-title no-select">${this.title}</span>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </header>

                    <main>
                        <span id="message" class="no-select">${this.message}</span>
                    </main>

                    <footer>
                        <div class="footer-buttons">
                            ${this.#buttons()}
                        </div>
                    </footer>
                </div>
            </div>
        `;
    }

    show(message) {
        this.message = message;
        this.opened = true;
        return new Promise( resolve => {
            this.modalResult = resolve;
        })
    }

    updated(changedProps) {
        this.$id("a1").focus()
    }

    ok() {
        this.opened = false;
        this.modalResult('Ok');
    }

    close() {
        this.opened = false;
        this.modalResult('Close');
    }

    keyDown(e) {
        switch (e.key) {
            case "Enter":
              this.ok()
              break;
            case "Escape":
              this.close()
              break;
            default:
              return;
        }
    }
});