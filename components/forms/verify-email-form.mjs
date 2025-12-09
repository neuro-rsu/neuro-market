import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import {HOST} from "../../js/neuro-market/neuro-market-config.mjs";

import { formStyles } from './form-css.mjs'

import refreshToken, { getToken } from "../../js/neuro-market/refresh-token.mjs";

import '../dialogs/modal-dialog.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/email-input.mjs';
import '../inputs/password-input.mjs';
import '../inputs/simple-informer.mjs';
import '../buttons/close-button.mjs';
import '../buttons/form-button.mjs';

import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

class VerifyEmailForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            opened: { type: Boolean, default: false },
            isCodeError: { type: Boolean, default: false },
            isCodeMessage: { type: Boolean, default: false },
            isCodeValid: { type: Boolean, default: false },
            codeErrorMessage: { type: String, default: '' },
            codeInfoMessage: { type: String, default: '' },
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    user-select: none;
                }
                .icon-font-2.user {
                    color: red;
                    font-family: FontAwesome;
                }
                .icon-font-2.user::before {
                    font-family: FontAwesome;
                    content:"\f001";
                }
                .form-footer {
                    display: flex;
                    justify-content: right;
                }
                #code {
                    --input-button-color: var(--background-green);
                }
                form-button {
                    margin: 8px 0;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
            <div id="form-background" class="form-background" style="${this.opened ? 'display: block' : ''}">
                <modal-dialog></modal-dialog>
                <form class="form animate" method="post">
                    <div class="form-header">
                        <div class="form-tabs no-select">
                            <div class="form-tab" selected data-label="Verify Email">${lang`Verify Email`}</div>
                        </div>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>
                    <div class="form-body">
                        <div id="db-tab-section" class="form-tab-section selected">
                            <simple-input id="code" icon-name="order-number-solid" placeholder=${lang`Verification code`} button-name=${this.isCodeValid && "circle-check-sharp-regular" || nothing} @input=${this.codeInput}>
                                ${ this.isCodeError || this.isCodeMessage ?
                                    html`
                                        <simple-informer slot="informer" info-message=${this.codeErrorMessage} error-message=${this.codeInfoMessage} ></simple-informer>
                                    `
                                : ''}
                            </simple-input>
                            <form-button ?disable=${!this.isEnable()} @click=${this.isEnable() ? this.verifyEmail : nothing}>${lang`Verify Email`}</form-button>
                        </div>
                    </div>
                </form>
            </div>
        `;
    }

    isEnable () {
        return this.#code
    }

    codeInput(e) {
        if (e.target.value) {
            this.isCodeValid = true
            this.isCodeError = false
            this.isCodeMessage = false
        }
        else {
            this.isCodeValid = false
            this.isCodeError = false
            this.isCodeMessage = true
        }
    }

    static #fetchVerifyEmailRequest(token) {
        return fetch(`https://${HOST}:${PORT}/api/verify-email`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            }
        })
    }

    async verifyEmailRequest() {
        let token = getToken()
        let response = await VerifyEmailForm.#fetchVerifyEmailRequest(token)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await VerifyEmailForm.#fetchVerifyEmailRequest(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        this.email = result.email
        this.token = result.token
        this.isCodeMessage = true

        this.codeErrorMessage = `На Вашу почту ${this.email} отправлен код подтверждения`
        this.codeInfoMessage = `Зайдите на Вашу почту и скопируйте этот код. Если письмо не пришло, то проверьте папку спам`

        // await this.showDialog("На Вашу электронную почту отправлено письмо с кодом подтверждения.")
    }

    static #fetchVerifyEmail(code, token) {
        return fetch(`https://${HOST}:${PORT}/api/verify-email`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(code)
        })
    }

    async verifyEmail() {
        const code = this.#code
        let token = getToken()
        let response = await VerifyEmailForm.#fetchVerifyEmail({ code,  token: this.token }, token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await VerifyEmailForm.#fetchVerifyEmail({ code,  token: this.token }, token)
        }

        const result = await response.json()

        if (!response.ok) {
            const modalResult = await this.errorDialog(result.error)
            if (modalResult === "Ok") {
                this.close("Error");
                return
            }
            // throw new Error(result.error)
        }

        const modalResult = await this.showDialog(`Ваша электронная почта ${this.email} успешно подтверждена.`)

        if (modalResult === "Ok") {
            this.close(result);
        }
    }

    open() {
        this.opened = true;

        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
            this.verifyEmailRequest()
        })
    }

    close(modalResult) {
        this.opened = false
        this.isShowCode = false
        this.isCodeError = false
        this.isCodeValid = false
        this.isCodeMessage = false
        this.#code = ""
        this.token = {}
        this.resolve(modalResult)
    }

    get #code() {
        return this.renderRoot?.querySelector('#code')?.value ?? null;
    }

    set #code(value) {
        if (this.renderRoot?.querySelector('#code')) {
            this.renderRoot.querySelector('#code').value = value;
        }
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    async errorDialog(message) {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = 'error'
        modalDialog.Title = 'Ошибка'
        return modalDialog.show(message);
    }
}

customElements.define("verify-email-form", VerifyEmailForm);
