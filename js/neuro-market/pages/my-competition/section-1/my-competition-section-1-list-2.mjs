import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

class MyCompetitionSection1List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
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
                ${JSON.parse(this.#loginInfo).login}
            </div>
            <div class="statistic">
                <statistic-button label="Projects" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                <statistic-button label="Sales" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                <statistic-button label="Wallet" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
            </div>
        `
    }

//     <div>
//     <simple-input id="firstName" icon-name="user" label="Country name:" .value=${this.item?.personalInfo?.firstName} @input=${this.validateInput}></simple-input>
//     <simple-input id="lastName" icon-name="flag-solid" label="Flag name:" .value=${this.item?.personalInfo?.lastName} @input=${this.validateInput}></simple-input>
// </div>
    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value
        if (e.target.id === 'name') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.isFirst  = false;
        this.avatar = null; // await this.downloadAvatar();
        this.isFirst = true;
    }
}

customElements.define("my-competition-section-1-list-1", MyCompetitionSection1List1);