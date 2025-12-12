import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './modal-dialog-css.mjs'

import '../buttons/close-button.mjs';

import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

import {HOST, PORT} from "../../js/neuro-market/neuro-market-config.mjs";

customElements.define('password-recovery-dialog', class PasswordRecoveryDialog extends BaseElement {
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
                return html`
                    <button class="footer-button" @click=${this.ok}>Восстановить</button>
                    <button class="footer-button" @click=${this.close}>${lang`Cancel`}</button>
                `

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

    show(token) {
        this.token = token
        window.history.replaceState(null, '', window.location.pathname);
        this.message = "Вы действительно хотите восстановить пароль?";
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

    static fetchRecoverPassword() {
        return fetch(`https://${HOST}:${PORT}/api/password-recovery/${this.token}`, {
            method: "GET",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
        })
    }

    async recoverPassword() {
        let response = await RecoverPasswordForm.fetchRecoverPassword(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        const modalResult = await this.showDialog("На Вашу электронную почту отправлено письмо с ссылкой для восстановления пароля.")
        if (modalResult === "Ok") {
            this.close(modalResult);
        }
    }
});