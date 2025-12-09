import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import {HOST} from "../../js/neuro-market/neuro-market-config.mjs";

import { formStyles } from './form-css.mjs'

import refreshToken, {getToken, saveAccessToken, saveExitToken} from "../../js/neuro-market/refresh-token.mjs";

import '../dialogs/modal-dialog.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/email-input.mjs';
import '../inputs/password-input.mjs';
import '../inputs/simple-informer.mjs';
import '../buttons/close-button.mjs';

import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'


class SignUpForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            opened: { type: Boolean, default: false },
            isLoginError: { type: Boolean, default: false },
            isLoginValid: { type: Boolean, default: false },
            loginErrorMessage: { type: String, default: '' },
            loginInfoMessage: { type: String, default: '' },
            isEmailError: { type: Boolean, default: false },
            isEmailValid: { type: Boolean, default: false },
            emailErrorMessage: { type: String, default: '' },
            emailInfoMessage: { type: String, default: '' },
            isPasswordError: { type: Boolean, default: false },
            isPasswordValid: { type: Boolean, default: false },
            passwordErrorMessage: { type: String, default: '' },
            passwordInfoMessage: { type: String, default: '' },
            isConfirmPasswordError: { type: Boolean, default: false },
            isConfirmPasswordValid: { type: Boolean, default: false },
            confirmPasswordErrorMessage: { type: String, default: '' },
            confirmPasswordInfoMessage: { type: String, default: '' },
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
                #login,
                #email,
                #confirm {
                    --input-button-color: var(--background-green);
                }
                form-button {
                    margin: 8px 0;
                }
                .checkbox-remember input[type=checkbox] {
                   width: 20px;
                    height: 20px;
                    accent-color: var(--background-green);
                    outline-color: var(--background-green);
                }
                /* input[type=checkbox]:hover {
                    accent-color: red;
                } */
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
                            <div class="form-tab" selected data-label="Sign Up">${lang`Sign Up`}</div>
                        </div>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="form-body">
                        <div id="db-tab-section" class="form-tab-section selected">
                            <simple-input id="login" icon-name="user" placeholder="${lang`Login`}" @blur=${this.loginValidation} button-name=${this.isLoginValid ? "circle-check-sharp-regular" : ''} @input=${this.loginInput}>
                                ${ this.isLoginError || this.isLoginMessage ?
                                    html`
                                        <simple-informer slot="informer" info-message=${this.loginErrorMessage} error-message=${this.loginInfoMessage} ></simple-informer>
                                    `
                                : ''}
                            </simple-input>
                        <simple-input id="email" type="mail" icon-name="mail" placeholder="${lang`E-mail`}" @blur=${this.emailValidation} @input=${this.emailInput} button-name=${this.isEmailValid ? "circle-check-sharp-regular" : ''}>
                            ${ this.isEmailError ?
                                html`
                                    <simple-informer slot="informer" info-message=${this.emailErrorMessage} error-message=${this.emailInfoMessage} ></simple-informer>
                                `
                            : ''}
                        </simple-input>
                        <password-input id="password" sign-up="true" placeholder="${lang`Password`}" icon-name="lock" visible-icon="eye-slash-regular" invisible-icon="eye-regular"  @generate=${this.generatePassword} @keydown=${this.passwordKeyDown} @input=${this.passwordInput} @blur=${this.passwordValidation}>
                                ${ this.isPasswordError || this.isPasswordMessage ?
                                    html`
                                        <simple-informer slot="informer" info-message=${this.passwordErrorMessage} error-message=${this.passwordInfoMessage} ></simple-informer>
                                    `
                                : ''}
                            </password-input>
                        <!-- <password-input id="password" sign-up="true" icon-name="lock" placeholder="Password" visible-icon="eye-slash-regular" invisible-icon="eye-regular" @generate=${this.generatePassword} @input=${this.passwordChange}></password-input> -->
                        <simple-input id="confirm" type="password" icon-name="lock-confirm" placeholder="${lang`Confirm`}" button-name=${this.isConfirmPasswordValid ? "copy-to-clipboard-solid" : ''} @keydown=${this.confirmPasswordKeyDown} @input=${this.confirmPassword} @button-click=${this.copyToClipboard}>
                            ${ this.isConfirmPasswordError || this.isConfirmPasswordMessage ?
                                html`
                                    <simple-informer slot="informer" info-message=${this.confirmPasswordErrorMessage} error-message=${this.confirmPasswordInfoMessage}></simple-informer>
                                `
                            : ''}
                        </simple-input>
                        <div class="sign-up-options">
                            <div class="checkbox-remember">
                                <label>
                                    <b>${lang`Remember me`}</b>
                                    <input type="checkbox" name="remember" @click=${this.RememberMe}>
                                </label>
                            </div>
                        </div>
                        <form-button ?disable=${!this.isEnable()} @click=${this.isEnable() ? this.sendSimpleUser : nothing}>${lang`Sign Up`}</form-button>
                    </div>
                </div>
            </div>
            </form>
        </div>
        `;
    }

    isEnable () {
        return this.isLoginValid && this.isEmailValid && this.isPasswordValid && this.isConfirmPasswordValid
    }

    RememberMe(){
        if (this.#rememberMe) {
            localStorage.setItem('rememberMe', this.#rememberMe)
        }
        else {
            localStorage.removeItem('rememberMe')
        }
    }

    passwordKeyDown(e) {
        if (this.isPasswordError) {
            return
        }
        if (e.key === 'Enter' && this.isEnable()) {
            this.sendSimpleUser()
            return
        }
        let capsLockOn = e.getModifierState?.('CapsLock');
        this.isPasswordMessage = false
        if (capsLockOn) {
            this.isPasswordMessage = true
            this.passwordErrorMessage = "Вы включили Caps Lock"
            this.passwordInfoMessage = "Выключите Caps Lock"
        }
    }

    confirmPasswordKeyDown(e) {
        if (this.isConfirmPasswordError) {
            return
        }
        if (e.key === 'Enter' && this.isEnable()) {
            this.sendSimpleUser()
            return
        }
        let capsLockOn = e.getModifierState?.('CapsLock');
        this.isConfirmPasswordMessage = false
        if (capsLockOn) {
            this.isConfirmMessage = true
            this.ConfirmErrorMessage = "Вы включили Caps Lock"
            this.ConfirmInfoMessage = "Выключите Caps Lock"
        }
    }

    passwordInput(e) {
        if (!e.target.value) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Не задан пароль"
            this.passwordInfoMessage = "Пароль не может быть пустым"
            return
        }

        let regexp=/^.*(?=[А-яЁё])/
        if (regexp.test(e.data)) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Вы набираете на русской раскладке"
            this.passwordInfoMessage = "Переключитесь на английский язык"
            return
        }

        if (regexp.test(e.target.value)) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "У Вас в пароле русские буквы"
            this.passwordInfoMessage = "Исправьте пароль"
            return
        }

        regexp = /[a-zA-Z\d!@#$%&'()*+,^./\\:;<=>?[\]_`{~}|-]/

        if (!regexp.test(e.data)) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = `Недопустимый символ ${e.data}`
            this.passwordInfoMessage = `Использовать символ ${e.data} в пароле запрещено`
		}

        if (!regexp.test(e.target.value)) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Неправильный пароль"
            this.passwordInfoMessage = "Разрешены только символы: a-z, A-Z, 0-9 и !@#$%&'()*+,^./\\:;<=>?[]_`{~}|-"
            return
        }

        if (e.target.value.length < 8) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Должно быть не менее 8 символов: a-z, A-Z, 0-9 и !@#$%&'()*+,^./\\:;<=>?[]_`{~}|-"
            this.passwordInfoMessage = "Увеличьте длину пароля"
            return
        }

        regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&'()*+,^./\\:;<=>?[\]_`"{~}|-])(?=.{8,})/
        if (!regexp.test(e.target.value)) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Увеличьте сложность пароля"
            this.passwordInfoMessage = "В пароле должны присутствовать следующие символы: a-z, A-Z, 0-9 и !@#$%&'()*+,^./\\:;<=>?[]_`{~}|-"
            return
        }


        this.confirmPasswordCheck()

        this.isPasswordError = false
        this.isPasswordMessage = false
    }

    passwordValidation(e) {
        if (this.isPasswordError) {
            return
        }
        if (!e.target.value) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Не задан пароль"
            this.passwordInfoMessage = "Пароль не может быть пустым"
            return
        }
        const regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&'()*+,^./\\:;<=>?[\]_`"{~}|-])(?=.{8,})/
        if (!regexp.test(e.target.value)) {
            this.isPasswordError = true
            this.isPasswordMessage = false
            this.isPasswordValid = false
            this.passwordErrorMessage = "Неправильный пароль"
            this.passwordInfoMessage = "Должно быть не менее 8 символов: a-z, A-Z, 0-9 и ~!@#$%^&*()-=`_+,./\\:;<>?[]_'{}\"|-"
            return
        }
        this.isPasswordError = false
        this.isPasswordMessage = false
        this.isPasswordValid = true
    }

    // passwordChange(e) {
    //     const password = this.$id('password')
    //     const confirm = this.$id('confirm')
    //     this.isCopyToClipboard = false
    //     if (!password.value) {
    //         this.passwordErrorMessage = "Пароль не задан"
    //         this.passwordInfoMessage = "Вы должны задать пароль"
    //         this.isPasswordError = true
    //         this.isPasswordValid = false
    //         this.$id("confirm").value = ''
    //     } else if (password.value !== confirm.value) {
    //         this.passwordErrorMessage = "Пароли не совпадают"
    //         this.passwordInfoMessage = "Пароль и подтверждение должны быть одинаковыми"
    //         this.isPasswordError = true
    //         this.isPasswordValid = false
    //     }
    //     else {
    //         this.isPasswordError = false
    //         this.isPasswordValid = true
    //     }
    // }

    generatePassword(e) {
        this.#confirm = e.target.value
        this.isPasswordError = false
        this.isPasswordValid = true
        this.isConfirmPasswordError = false
        this.isConfirmPasswordValid = true
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
            this.confirmPasswordErrorMessage = "Пароль скопирован в буфер обмена"
            this.confirmPasswordInfoMessage = "Нажмите Ctrl+V, чтобы сохранить его"
            this.isConfirmPasswordMessage = true;
        }
    }

    loginInput(e) {
        if (!e.target.value) {
            this.isLoginError = true
            this.isLoginMessage = false
            this.isLoginValid = false
            this.loginErrorMessage = "Не задано имя пользователя"
            this.loginInfoMessage = "Имя пользователя не может быть пустым"
            return
        }

        let regexp=/^.*(?=[А-яЁё])/
        if (regexp.test(e.data)) {
            this.isLoginError = true
            this.isLoginMessage = false
            this.isLoginValid = false
            this.loginErrorMessage = "Вы набираете на русской раскладке"
            this.loginInfoMessage = "Переключитесь на английский язык"
            return
        }

        if (regexp.test(e.target.value)) {
            this.isLoginError = true
            this.isLoginMessage = false
            this.isLoginValid = false
            this.loginErrorMessage = "У Вас в имени пользователя русские буквы"
            this.loginInfoMessage = "Исправьте пароль"
            return
        }

        if (e.target.value.length < 6) {
            this.loginErrorMessage = "Должно быть от 6 до 16 символов: a-Z 0-9 . _ - или E-mail"
            this.isLoginMessage = false
            this.isLoginValid = false
            this.loginInfoMessage = "Придумайте более длинное имя пользователя"
            this.isLoginError = true
            return
        }

        regexp = /(?=^.{6,16}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/;

        if (!regexp.test(e.target.value)) {
            this.loginErrorMessage = "Неправильное имя пользователя"
            this.isLoginMessage = false
            this.isLoginValid = false
            this.loginInfoMessage = "Должно быть от 6 до 16 символов: a-Z 0-9 . _ - или E-mail"
            this.isLoginError = true
            return
        }

        this.isLoginError = false
    }

    async loginValidation(e) {
        if (this.isLoginError) {
            return
        }

        if (!e.target.value) {
            this.isLoginError = true
            this.isLoginValid = false
            this.loginErrorMessage = "Не задано имя пользователя"
            this.loginInfoMessage = "Имя пользователя не может быть пустым"
            return
        }

        const regexp = /(?=^.{6,16}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/;
        if (!regexp.test(e.target.value)) {
            this.loginErrorMessage = "Неправильное имя пользователя"
            this.loginInfoMessage = "Должно быть от 6 до 16 символов: a-Z 0-9 . _ - или E-mail"
            this.isLoginError = true
            this.isLoginValid = false
            return
        }

        const user = { username: e.target.value}
        try {
            await SignUpForm.checkUsername(user)
            this.isLoginError = false
            this.isLoginValid = true
        } catch (e) {
            this.loginErrorMessage = "Пользователь с таким именем уже существует"
            this.loginInfoMessage = "Придумайте другое имя"
            this.isLoginError = true
            this.isLoginValid = false
        }
    }

    emailInput(e) {
        if (!e.target.value) {
            this.isEmailError = true
            this.isEmailValid = false
            this.emailErrorMessage = "Не задана электронная почта"
            this.emailInfoMessage = "E-mail не может быть пустым"
            return
        }

        const regexp = /^.+@.+\..+$/
        if (!regexp.test(e.target.value)) {
            this.isEmailError = true
            this.isEmailValid = false
            this.emailErrorMessage = "Неправильный формат электронной почты"
            this.emailInfoMessage = "email@example.com"
            return
        }

        this.isEmailError = false
    }

    async emailValidation(e) {
        if (!e.target.value) {
            this.isEmailError = true
            this.isEmailValid = false
            this.emailErrorMessage = "Не задана электронная почта"
            this.emailInfoMessage = "E-mail не может быть пустым"
            return
        }

         const regexp = /^.+@.+\..+$/

         if (!regexp.test(e.target.value)) {
            this.emailErrorMessage = "Неправильный формат электронной почты"
            this.emailInfoMessage = "email@example.com"
            this.isEmailError = true
            this.isEmailValid = false
            return
        }

        const user = { email: e.target.value}
        try {
            await SignUpForm.checkEmail(user)
            this.isEmailError = false
            this.isEmailValid = true
        } catch (e) {
            if (e instanceof TypeError) {
                e.message = "Нет доступа к серверу"
            }
            this.emailErrorMessage = e.message
            if (e.message === 'Вы ошиблись в имени сервера электронной почты') {
                this.emailInfoMessage = "Задайте правильное имя сервера"
            }
            else if (e.message === 'Неправильный формат электронной почты') {
                this.emailInfoMessage = "Формат должен быть email@example.com"
            } else if (e.message === 'Вы указали одноразовую электронную почту. Ай-я-яй') {
                this.emailInfoMessage = "Задайте фактическую почту"
            } else if (e.message === 'Нет mx записи для данной почты в DNS') {
                this.emailInfoMessage = "Проверьте сервер Вашей электронной почты"
            } else if (e.message === 'Такой электронной почты не существует') {
                this.emailInfoMessage = "Вы указали несуществующую электронную почту"
            } else if (e.message === 'Не могу проверить электронную почту') {
                this.emailInfoMessage = "Что-то накрылось у разработчика. Пишите: neuro.rsu.edu.ru@gmail.com"
            }
            this.isEmailError = true
            this.isEmailValid = false
        }
    }

    confirmPasswordCheck() {
        if (!this.#confirm ) {
            return
        }

        if (this.#password !== this.#confirm) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Пароли не совпадают"
            this.confirmPasswordInfoMessage = "Пароль и подтверждение должны быть одинаковыми"
            return
        }

        if (!this.#password ) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Вы еще не задали пароль"
            this.confirmPasswordInfoMessage = "Введите сначала Ваш пароль"
            return
        }

        let regexp=/^.*(?=[А-яЁё])/

        if (regexp.test(this.#confirm)) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "У Вас в подтверждении пароля русские буквы"
            this.confirmPasswordInfoMessage = "Исправьте подтверждение пароля"
            return
        }

        regexp = /[a-zA-Z\d!@#$%&'()*+,^./\\:;<=>?[\]_`{~}|-]/

        if (!regexp.test(this.#confirm)) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Неправильное подтверждение пароля"
            this.confirmPasswordInfoMessage = "Разрешены только символы: a-z, A-Z, 0-9 и !@#$%&'()*+,^./\\:;<=>?[]_`{~}|-"
            return
        }

        this.isConfirmPasswordError = false
        this.isConfirmPasswordValid = true
    }

    confirmPassword(e) {
        const confirm = this.$id('confirm')

        if (!this.#password ) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Вы еще не задали пароль"
            this.confirmPasswordInfoMessage = "Введите сначала Ваш пароль"
            return
        }

        if (!e.target.value) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Вы не задали подтверждение пароля"
            this.confirmPasswordInfoMessage = "Подтверждение не может быть пустым"
            return
        }

        let regexp=/^.*(?=[А-яЁё])/
        if (regexp.test(e.data)) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Вы набираете на русской раскладке"
            this.confirmPasswordInfoMessage = "Переключитесь на английский язык"
            return
        }

        if (regexp.test(e.target.value)) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "У Вас в подтверждении пароля русские буквы"
            this.confirmPasswordInfoMessage = "Исправьте подтверждение пароля"
            return
        }

        regexp = /[a-zA-Z\d!@#$%&'()*+,^./\\:;<=>?[\]_`{~}|-]/

        if (!regexp.test(e.data)) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = `Недопустимый символ ${e.data}`
            this.confirmPasswordInfoMessage = `Использовать символ ${e.data} в пароле запрещено`
		}

        if (!regexp.test(e.target.value)) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordMessage = false
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Неправильное подтверждение пароля"
            this.confirmPasswordInfoMessage = "Разрешены только символы: a-z, A-Z, 0-9 и !@#$%&'()*+,^./\\:;<=>?[]_`{~}|-"
            return
        }

        if (this.#password !== confirm.value) {
            this.isConfirmPasswordError = true
            this.isConfirmPasswordValid = false
            this.confirmPasswordErrorMessage = "Пароли не совпадают"
            this.confirmPasswordInfoMessage = "Пароль и подтверждение должны быть одинаковыми"
            return
        }

        this.isConfirmPasswordError = false
        this.isConfirmPasswordValid = true
    }

    static fetchCheckUsername(user) {
        return fetch(`https://${HOST}:${PORT}/api/sign-up/check-username`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
    }

    static async checkUsername(user) {
        const response = await SignUpForm.fetchCheckUsername(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
    }

    static fetchCheckEmail(user) {
        return fetch(`https://${HOST}:${PORT}/api/sign-up/check-email`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(user)
        })
    }

    static async checkEmail(user) {
        const response = await SignUpForm.fetchCheckEmail(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
    }

    static fetchSendSimpleUser(user) {
        return fetch(`https://${HOST}:${PORT}/api/sign-up`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: "include",
            body: JSON.stringify(user)
        })
    }

    async sendSimpleUser() {
        const user = { username: this.#login, password: this.#password, type: 'simple', email: this.#email}

        let response = await SignUpForm.fetchSendSimpleUser(user)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        saveAccessToken(result.accessToken)
        saveExitToken(result.exitToken)

        await this.getSimpleUserInfo()
    }


    static fetchSimpleUserInfo(token) {
        return fetch(`https://${HOST}:${PORT}/api/user`, {
            headers: {
                'Authorization': `Bearer ${token}`
            },
        })
    }

    async getSimpleUserInfo() {

        let token = getToken();
        let response = await SignUpForm.fetchSimpleUserInfo(token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await SignUpForm.fetchSimpleUserInfo(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        this.saveUserInfo(JSON.stringify(result))

        const modalResult = await this.showDialog("Регистрация прошла успешно")
        if (modalResult === "Ok") {
            this.close(modalResult);
        }
    }

    saveUserInfo(userInfo) {
        if (localStorage.getItem('rememberMe')) {
            localStorage.setItem('userInfo', userInfo)
        }
        else {
            sessionStorage.setItem('userInfo', userInfo)
        }
    }

    open() {
        this.opened = true;
        return new Promise((resolve, reject) => {
            this.resolve = resolve
            this.reject = reject
        })
    }

    close(modalResult) {
        this.opened = false
        this.#login = ""
        this.#password = ""
        this.#email = ""
        this.#confirm = ""
        this.#rememberMe = ""
        this.isLoginError = false
        this.isLoginValid = false
        this.isEmailError = false
        this.isEmailValid = false
        this.isPasswordError = false
        this.isPasswordValid = false
        this.$id('password').strength = -1
        this.resolve(modalResult)
    }

    get #login() {
        return this.renderRoot?.querySelector('#login')?.value ?? null;
    }

    set #login(value) {
        if (this.renderRoot?.querySelector('#login')) {
            this.renderRoot.querySelector('#login').value = value;
        }
    }

    get #password() {
        return this.renderRoot?.querySelector('#password')?.value ?? null;
    }

    set #password(value) {
        if (this.renderRoot?.querySelector('#password')) {
            this.renderRoot.querySelector('#password').value = value;
        }
    }

    get #email() {
        return this.renderRoot?.querySelector('#email')?.value ?? null;
    }

    set #email(value) {
        if (this.renderRoot?.querySelector('#email')) {
            this.renderRoot.querySelector('#email').value = value;
        }
    }

    get #rememberMe() {
        return this.renderRoot?.querySelector('.checkbox-remember input')?.checked ?? null;
    }

    set #rememberMe(value) {
        if (this.renderRoot?.querySelector('.checkbox-remember input')) {
            this.renderRoot.querySelector('.checkbox-remember input').checked = value;
        }
    }

    get #confirm() {
        return this.renderRoot?.querySelector('#confirm')?.value ?? null;
    }

    set #confirm(value) {
        if (this.renderRoot?.querySelector('#confirm')) {
            this.renderRoot.querySelector('#confirm').value = value;
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

customElements.define("sign-up-form", SignUpForm);
