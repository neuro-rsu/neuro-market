import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

//import { default as wsClient, sendMessage, setDialog, repairDialog, setForm} from '../../js/ws-client.mjs'

import '../dialogs/modal-dialog.mjs';
import './sign-up-form.mjs';
import './password-recovery-form.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/password-input.mjs';
import '../inputs/simple-informer.mjs';
import '../buttons/close-button.mjs';
import '../buttons/vk-button.mjs';
import '../buttons/form-button.mjs';
import '../buttons/link-button.mjs';
import '../auth/vk-auth.mjs';

import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

import {HOST} from "../../js/neuro-market/neuro-market-config.mjs";

import refreshToken, {getToken, saveAccessToken, saveExitToken} from "../../js/neuro-market/refresh-token.mjs";

customElements.define("sign-in-form", class SignInForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0'},
            login: { type: String, default: ''},
            isLoginError: { type: Boolean, default: false},
            isLoginMessage: { type: Boolean, default: false},
            loginErrorMessage: { type: String, default: ''},
            loginInfoMessage: { type: String, default: ''},
            opened: { type: Boolean, default: false},
            password: {type: String, default: ''},
            isPasswordError: { type: Boolean, default: false},
            isPasswordMessage: { type: Boolean, default: false},
            isPasswordValid: { type: Boolean, default: false},
            passwordErrorMessage: { type: String, default: ''},
            passwordInfoMessage: { type: String, default: ''},
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
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    // <span id="close" class="close-button no-select" title="Закрыть"  @click=${()=>this.close('CANCEL')}>&times;</span>
    render() {
        return html`
            <div id="form-background" class="form-background" style=${this.opened ? 'display: block' : ''}>
                <modal-dialog></modal-dialog>
                <form class="form animate" method="post">
                    <div class="form-header">
                        <div class="form-tabs no-select">
                            <div class="form-tab" selected data-label=${lang`Sign in`}>${lang`Sign in`}</div>
                        </div>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="form-body">
                        <div id="db-tab-section" class="form-tab-section selected">
                            <simple-input id="login" icon-name="user" placeholder=${lang`Login`} size="20"  @keydown=${this.loginKeyDown} @input=${this.loginInput} @blur=${this.loginValidation}>
                                ${ this.isLoginError || this.isLoginMessage ?
                                    html`
                                        <simple-informer slot="informer" info-message=${this.loginErrorMessage} error-message=${this.loginInfoMessage} ></simple-informer>
                                    `
                                : ''}
                            </simple-input>
                            <password-input id="password" placeholder=${lang`Password`} icon-name="lock" visible-icon="eye-slash-regular" invisible-icon="eye-regular" @keydown=${this.passwordKeyDown} @input=${this.passwordInput} @blur=${this.passwordValidation}>
                                ${ this.isPasswordError || this.isPasswordMessage ?
                                    html`
                                        <simple-informer slot="informer" info-message=${this.passwordErrorMessage} error-message=${this.passwordInfoMessage} ></simple-informer>
                                    `
                                : ''}
                            </password-input>

                            <div class="login-options">
                                <div class="checkbox-remember">
                                    <label>
                                        ${lang`Remember me`}
                                        <input type="checkbox" name="remember" @click=${this.rememberMe}>
                                    </label>
                                </div>
                                <link-button @click=${this.forgotClick}>${lang`Forgot password?`}</link-button>
                            </div>

                            <form-button ?disable=${!this.isEnable()} @click=${this.isEnable() ? this.sendSimpleUser : nothing}>${lang`Sign in`}</form-button>
                            <div id="google"></div>
                            <vk-button></vk-button>
                        </div>
                    </div>

                    <div class="form-footer">
                        <link-button @click=${this.signUpClick}>${lang`Registration`}</link-button>
                    </div>
                </form>
            </div>
            `;
    }
    // <a class="sign-up-link" @click=${this.signUpClick}>New user? Sign up!</a>

    isEnable() {
        return this.isLoginValid && this.isPasswordValid
    }
    // async getVKToken(res) {
    //     // let o = window.VKIDSDK.Config.get()
    //     // let params1 = new URLSearchParams(window.location.search)
    //     // let code = params1.get("code")
    //     // let device_id = params1.get("device_id")
    //     // let params = new URLSearchParams()
    //     // params.append("grant_type", "authorization_code")
    //     // params.append("redirect_uri", "https://polyathlon.github.io/neuro-market")
    //     // params.append("client_id", "52051268")
    //     // params.append("code_verifier", "h3YlUL7y_YI2xd3M2uAasDANHfQZdpbkFW5lQeiKAVE")
    //     // params.append("device_id", device_id)
    //     // //params.append("code", code)
    //     // params.append("state", "dj29fnsadjsd85")

    //     // //window.VKIDSDK.Auth.exchangeCode(code, device_id).then(d => console.log(d))
    //     // let uri = "https://id.vk.com/oauth2/auth?".concat(params.toString())
    //     // // redirect_uri=https%3A%2F%2Fpolyathlon.github.io%2Fneuro-market&
    //     // // client_id=52051268&
    //     // // code_verifier=h3YlUL7y_YI2xd3M2uAasDANHfQZdpbkFW5lQeiKAVE&
    //     // // state=dj29fnsadjsd85&
    //     // // device_id=Ljab4hFntNWyWCdLl0BVHFEDswZqk7KoqxesOFMH0nHgk4CM2b4NGrxbicmIKE9J44rALREG8_6fqfHb_jZhPQ

    //     // fetch(uri, {
    //     //     method: 'POST',
    //     //     mode: 'cors',
    //     //     // headers: {
    //     //     //   'Content-Type': 'application/json;charset=utf-8'
    //     //     // },
    //     //     body: new URLSearchParams({
    //     //         code
    //     //     })
    //     //   })
    //     // .then(response => response.json())
    //     // .then(json => {
    //     //     if ("error" in json) {
    //     //         throw Error(json)
    //     //     }
    //     //     return json.token
    //     // })


    //     // const params = new URLSearchParams(window.location.search)
    //     // const result = {
    //     //     code: params.get("code"),
    //     //     device_id: params.get("device_id"),
    //     //     state: params.get("state"),
    //     // }

    //     const response = await fetch(`https://${HOST}:${PORT}/api/sign-in-vk`, {
    //         method: 'POST',
    //         mode: 'cors',
    //         headers: {
    //           'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    //         },
    //         credentials: "include",
    //         body: new URLSearchParams(window.location.search)
    //     })
    //     const result = await response.json()
    //     if (Object.hasOwn(result, "error")) {
    //         throw Error(result.error)
    //     }
    //     return result?.token
    //   }


 // //window.VKIDSDK.Auth.exchangeCode(code, device_id).then(d => console.log(d))


    static fetchGetVKToken() {
        return fetch(`https://${HOST}:${PORT}/api/sign-in-vk`, {
            method: 'POST',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
            },
            credentials: "include",
            body: new URLSearchParams(window.location.search)
        })
    }

    async getVKToken(res) {
        let response
        try {
            response = await SignInForm.fetchGetVKToken()
        } catch(e) {
            await this.showDialog("Ошибка подключения к серверу")
            return
        }

        const result = await response.json()

        if (!response.ok) {
            await this.showDialog(result.error)
            return
        }

        window.history.replaceState(null, '', window.location.pathname);

        saveAccessToken(result.accessToken)
        saveExitToken(result.exitToken)

        await this.getSimpleUserInfo()
      }


    static fetchSendGoogleToken(token) {
        return fetch(`https://${HOST}:${PORT}/api/sign-in-google`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: "include",
            body: JSON.stringify(token)
          })
    }

    async sendGoogleToken(res) {
        const token = { token: res.credential, type: 'google'}
        let response
        try {
            response = await SignInForm.fetchSendGoogleToken(token)
        } catch(e) {
            await this.showDialog("Ошибка подключения к серверу")
            return
        }

        const result = await response.json()

        if (!response.ok) {
            await this.showDialog(result.error)
            return
        }

        saveAccessToken(result.accessToken)
        saveExitToken(result.exitToken)

        await this.getSimpleUserInfo()
    }

    createGoogleButton() {
        google.accounts.id.initialize({
            client_id: '152529125992-h422kajfg36g0e9gptsu7auv090okqlv.apps.googleusercontent.com',
            callback: res => this.sendGoogleToken(res)
        });
        google.accounts.id.renderButton(
            this.renderRoot.querySelector('#google'),
            { theme: 'outline', size: 'large'}
        );
    }

    async sendVKToken() {
        await this.getVKToken()
        // window.history.replaceState(null, '', window.location.pathname);
        // this.saveToken(token)
        // this.getSimpleUserInfo(token)
    }

    firstUpdated() {
        super.firstUpdated();
        this.createGoogleButton();
        let params = new URLSearchParams(window.location.search)
        if (params.size) {
            this.sendVKToken()
        }
        // window.VKIDSDK.Auth.exchangeCode(code, device_id).then(d => console.log(d))
    }

    getCodeChallenge(obj) {
        fetch(`https://${HOST}:${PORT}/api/sign-in-vk`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: obj
          })
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            return json
        })
        // .then(token => this.getSimpleUserInfo(token))
        .catch(err => {console.error(err.message)});
    }

    open() {
        this.opened = true;
        return new Promise((res, rej) => {
            this.resolveForm = res
            this.rejectFrom = rej
        })
    }

    close(modalResult) {
        this.opened = false
        this.#login = ''
        this.#password = ''
        this.#rememberMe = ''
        this.isLoginError = false
        this.isLoginMessage = false
        this.isLoginValid = false

        this.isPasswordError = false
        this.isPasswordMessage = false
        this.isPasswordValid = false

        if (modalResult == 'Ok')
            this.resolveForm(modalResult)
        else
            this.rejectFrom(modalResult)
    }

    signUpClick() {
        this.opened = false;
        this.#signUpForm.open().then(modalResult => {
            if (modalResult == "SIGNIN") {
                this.opened = false;
            }
            else {
                this.close(modalResult)
            }
        }, modalResult => this.close(modalResult));
    }
    forgotClick() {
        this.opened = false;
        // this.#recoverPasswordForm.open().then(modalResult => {
        //         this.close(modalResult)
        // }, modalResult => this.close(modalResult));
        this.#recoverPasswordForm.open().then(modalResult => {

        }, modalResult => this.close(modalResult));
    }
    get #recoverPasswordForm() {
        return this.parentElement.querySelector('password-recovery-form') ?? null;
    }
    get #signUpForm() {
        return this.parentElement.querySelector('sign-up-form') ?? null;
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

    get #rememberMe() {
        return this.renderRoot?.querySelector('.checkbox-remember input')?.checked ?? null;
    }

    set #rememberMe(value) {
        if (this.renderRoot?.querySelector('.checkbox-remember input')) {
            this.renderRoot.querySelector('.checkbox-remember input').checked = value;
        }
    }

    static fetchSendSimpleUser(user) {
        return fetch(`https://${HOST}:${PORT}/api/sign-in`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            credentials: "include",
            body: JSON.stringify(user)
        })
    }

    async sendSimpleUser() {
        const user = { username: this.#login, password: this.#password, type: 'simple'}
        let response
        try {
            response = await SignInForm.fetchSendSimpleUser(user)
        } catch(e) {
            await this.showDialog("Ошибка подключения к серверу")
            return
        }

        const result = await response.json()

        if (!response.ok) {
            await this.showDialog(result.error)
            return
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
        let response = await SignInForm.fetchSimpleUserInfo(token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await SignInForm.fetchSimpleUserInfo(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        this.saveUserInfo(JSON.stringify(result))

        const modalResult = await this.showDialog("Подключение прошло успешно")
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

    rememberMe(){
        if (this.#rememberMe) {
            localStorage.setItem('rememberMe', this.#rememberMe)
        }
        else {
            localStorage.removeItem('rememberMe')
        }
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    passwordKeyDown(e) {
        if (this.isPasswordError) {
            return
        }
        if (e.key === 'Enter' && this.isPasswordValid) {
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
            this.passwordInfoMessage = "Разрешены только символы [a-z], [A-Z], [0-9] и [~!@#$%^&*()_+]"
            return
        }

        regexp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&'()*+,^./\\:;<=>?[\]_`{~}|-])(?=.{8,})/
        if (regexp.test(e.target.value)) {
            this.isPasswordValid = true
        }
        else {
            this.isPasswordValid = false
        }
        this.isPasswordError = false
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
            this.passwordInfoMessage = "Должно быть не менее 8 символов [a-z], [A-Z], [0-9] и [~!@#$%^&*()-=`_+,./\\:;<>?[]_'{}\"|-]"
            return
        }
        this.isPasswordError = false
        this.isPasswordMessage = false
        this.isPasswordValid = true

    }

    loginKeyDown(e) {
        let capsLockOn = e.getModifierState?.('CapsLock');
        this.isLoginMessage = false
        if (capsLockOn) {
            this.isLoginMessage= true
            this.loginErrorMessage = "Вы включили Caps Lock"
            this.loginInfoMessage = "Выключите Caps Lock"
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

        if (e.target.value.length < 6 && !this.isLoginError) {
            return
        }

        regexp = /(?=^.{6,60}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/;

        regexp = /^[A-Za-z\d]+([A-Za-z\d]*|[._-]?[A-Za-z\d]+)*$|^.+@.+\..+$/;
        if (!regexp.test(e.target.value)) {
            this.loginErrorMessage = "Неправильное имя пользователя"
            this.isLoginMessage = false
            this.isLoginValid = false
            this.loginInfoMessage = "Должно быть от 6 до 16 символов [a-Z], [0-9] и [._-] или E-mail"
            this.isLoginError = true
            return
        }
        regexp = /(?=^.{6,60}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/
        if (regexp.test(e.target.value)) {
            this.isLoginValid = true
        } else {
            this.isLoginValid = false
        }
        this.isLoginError = false
    }

    loginValidation(e) {
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

        const regexp = /(?=^.{4,60}$)^[A-Za-z0-9]+([A-Za-z0-9]*|[._-]?[A-Za-z0-9]+)*$|^.+@.+\..+$/;
        if (!regexp.test(e.target.value)) {
            this.loginErrorMessage = "Неправильное имя пользователя"
            this.loginInfoMessage = "от 4 до 16 символов [a-Z] [0-9] [._-] или E-mail"
            this.isLoginError = true
            this.isLoginValid = false
            return
        }
        this.isLoginMessage = false
        this.isLoginError = false
        this.isLoginValid = true
    }
})