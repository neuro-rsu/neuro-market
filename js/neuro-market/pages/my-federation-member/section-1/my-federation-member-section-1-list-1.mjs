import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

class MyFederationMemberSection1List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            avatar: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            isFirst: { type: Boolean, default: false }
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                    }

                }
                .avatar {
                    width: 100%
                }

                avatar-input {
                    width: 80%;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }

            `
        ]
    }

    get #loginInfo() {
        if (localStorage.getItem('rememberMe')) {
            return localStorage.getItem('userInfo')
        }
        else {
            return sessionStorage.getItem('userInfo')
        }
    }

    render() {
        return html`
            <div class="avatar">
                ${this.isFirst ? html`<avatar-input id="avatar" .currentObject=${this} .avatar=${this.avatar || 'images/no-avatar.svg'} @input=${this.validateAvatar}></avatar-input>` : ''}
            </div>
            <div class="label">
                ${this.item?.firstName + ' ' + this.item?.lastName}
            </div>
            <fashion-button @click=${this.startTelegramBot}>Telegram Bot</fashion-button>
            <div class="statistic">
                <statistic-button label="Projects" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                <statistic-button label="Sales" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                <statistic-button label="Wallet" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
            </div>
        `
    }

    validateAvatar(e) {
        this.oldValues ??= new Map();
        if (!this.oldValues.has(e.target)) {
            this.oldValues.set(e.target, e.target.avatar)
            this.item.avatar = window.URL.createObjectURL(e.target.value);
            this.item.avatarFile = e.target.value;
            this.requestUpdate();
        }
        else if (this.oldValues.get(e.target) === e.target.avatar) {
            this.oldValues.delete(e.target.id)
            this.item.avatarFile = null;
        } else {
            this.item.avatar = window.URL.createObjectURL(e.target.value);
            this.item.avatarFile = e.target.value;
            this.requestUpdate();
        }
        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        // this.isFirst  = false;
        // this.avatar = null; // await this.downloadAvatar();
        this.isFirst = true;
    }
}

customElements.define("my-federation-member-section-1-list-1", MyFederationMemberSection1List1);