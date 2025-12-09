import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

import styles from './input-css.mjs'

customElements.define("password-input", class PasswordInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'password' },
            required: { type: Boolean, default: false },
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            value: { type: String, default: ''},
            iconName: { type: String, default: '', attribute: 'icon-name' },
            visibleIcon: { type: String, default: '', attribute: 'visible-icon' },
            invisibleIcon: { type: String, default: '', attribute: 'invisible-icon' },
            placeholder: { type: String, default: '' },
            strength: {type: BigInt, default: -1},
            isSignUp: {type: Boolean, default: false, attribute: 'sign-up'},
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
                    user-select: none;
                    color: var(--form-input-color, gray);
                }

                .strength-lines {
                    position: absolute;
                    display: flex;
                    justify-content: stretch;
                    gap: 4px;
                    bottom: 2px;
                    left: 40px;
                    width: calc(100% - 84px);
                    height: 4px;
                    z-index: 1;
                    div {
                        width: 100%;
                        &.bg-0 {
                            background-color:  var(--password-weak-color, #e74c3c);
                        }
                        &.bg-1 {
                            background-color: var(--password-medium-color,  #e67e22);
                        }
                        &.bg-2 {
                            background-color: var(--password-strong-color,  #2ecc71);
                        }
                    }
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name="${this.iconName}" title=${(this.isSignUp ? "Генерация пароля" : null) || nothing} @click=${(this.isSignUp ? this.generatePassword : null) || nothing}></simple-icon>
        `
    }

    changeType() {
        this.type = this.type === "text" ? "password" : "text"
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.type==="password" ? this.visibleIcon : this.invisibleIcon} @mouseenter=${this.changeType} @mouseleave=${this.changeType} @click=${this.$fire("button-click")}></simple-icon>
        `
    }

    setValue(value) {
        this.value = value;
        if (this.value === '') {
            this.strength = -1
        }
        else {
            this.strength = this.testPasswordStrength(this.value)
        }
        this.fire('input')
    }

    get strengthLines() {
        return html`
            <div class="strength-lines">
                <div class=${(this.strength > -1 ? 'bg-' + this.strength : '') || nothing } title="8 символов a-z, A-Z, 0-9 или !@#$%&'()*+,^./\\:;<=>?[]_\`{~}|-"></div>
                <div class=${(this.strength > 0  ? 'bg-' + this.strength : '') || nothing } title="8 символов a-z, A-Z, 0-9 или !@#$%&'()*+,^./\\:;<=>?[]_\`{~}|-"></div>
                <div class=${(this.strength > 1  ? 'bg-' + this.strength : '') || nothing } title="8 символов a-z, A-Z, 0-9 и !@#$%&'()*+,^./\\:;<=>?[]_\`{~}|-""></div>
            </div>
        `
    }

    testPasswordStrength(value) {
		let strongRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&'()*+,^./\\:;<=>?[\]_`{~}|-])(?=.{8,})/

		let mediumRegex = /^(?=.{8,})/;

		if (strongRegex.test(value)) {
			return 2;
		} else if (mediumRegex.test(value)) {
			return 1;
		} else {
			return 0;
		}
	}

    render() {
        return html`
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <input type=${this.type}
                    placeholder=${this.placeholder || nothing}
                    ${this.required ? 'required' : ''}
                    .value=${this.value || ''} @input=${this.changeValue} @change=${this.changeValue}>
                ${this.iconName ? this.#icon : ''}
                ${this.visibleIcon || this.invisibleIcon ? this.#button : ''}
                ${(this.isSignUp ? this.strengthLines : '') || nothing}
            </div>
            <slot name="informer"></slot>
        `;
    }

    generatePassword() {
        const passwordOptions = {
            num: "1234567890",
            specialChar: "!@#$%&'()*+,^-./:;<=>?[]_`{~}|",
            lowerCase: "abcdefghijklmnopqrstuvwxyz",
            upperCase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
        };
        const password = []
        for (let i in passwordOptions) {
            for (let j=0; j<2; j++) {
                const r = this.randomInteger(0, passwordOptions[i].length - 1)
                password.push(passwordOptions[i][r])
            }
        }
        for (let j=0; j<2; j++) {
            const index = this.randomInteger(0, 3);
            let option
            switch(index) {
                case 0: option = passwordOptions.num
                break;
                case 1: option = passwordOptions.lowerCase
                break;
                case 2: option = passwordOptions.upperCase
                break;
                case 3: option = passwordOptions.upperCase
            }
            const r = this.randomInteger(0, option.length - 1)
            password.push(option[r])
        }
        for (let i = password.length - 1; i > 0; i--) {
            const swapIndex = this.randomInteger(0, i - 1);
            [password[i], password[swapIndex]] = [password[swapIndex], password[i]];
        };
        this.setValue(password.join(""))
        this.fire('generate')
    }

    randomInteger(min, max) {
        // случайное число от min до (max+1)
        let rand = min + Math.random() * (max + 1 - min);
        return Math.floor(rand);
    }

    changeValue(e) {
        this.value = e.target.value;
        if (e.target.value === '') {
            if (this.strength !== -1) {
                this.fire("strength-change", {strength: this.strength})
                this.strength = -1
            }
        } else {
            const currentStrength = this.testPasswordStrength(e.target.value)
            if (currentStrength !== this.strength) {
                this.strength = currentStrength
                this.fire("strength-change", {strength: currentStrength})
            }
        }
    }
});