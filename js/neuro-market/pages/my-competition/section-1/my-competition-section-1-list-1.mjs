import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

class MyCompetitionSection1List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            avatar: {type: Object, default: null, local: true},
            avatarFile: {type: Object, default: null, local: true},
            name: {type: String, default: null},
            regulationsLink: {type: String, default: null},
            protocolLink: {type: String, default: null},
            startDate: {type: String, default: null},
            endDate: {type: String, default: null},
            startRegistration: {type: String, default: null},
            endRegistration: {type: String, default: null},
            stage: {type: String, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            isFirst: { type: Boolean, default: false },
            currentPage: { type: Boolean, default: false, local: true },
            currentItem: {type: Object, default: null},
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
                .label {
                    text-align: center;
                }
                avatar-input {
                    width: 80%;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }
                fashion-button {
                    border-radius: 8px;
                    padding: 10px 10px;
                    &.regulations-link {
                        --button-background-color: white;
                        --native-color: red;
                    }
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

    get #competitionName() {
        if (!this.name) {
            return ''
        }
        if (this.stage) {
            return `${this.name.name} ${this.stage?.name}`
        }
        return this.name.name
    }

    static monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    get #competitionDate() {
        if (this.startDate) {
            const start = this.startDate.split("-")
            const end = this.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${MyCompetitionSection1List1.monthNames[start[1] - 1]}`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${MyCompetitionSection1List1.monthNames[start[1] - 1]}`
            }
            return `${start[2]} ${MyCompetitionSection1List1.monthNames[start[1]-1]} - ${end[2]} ${MyCompetitionSection1List1.monthNames[end[1] - 1]}`
        }
        return ''
    }

    get #registration() {
        const currentDate = new Date(Date.now())
        const startDate = new Date(this.startRegistration)
        const endDate = new Date(this.endRegistration)
        if (currentDate >= startDate && currentDate <= endDate ) {
            return html`<fashion-button @click=${this.registration}>Зарегистрироваться</fashion-button>`
        }
        return ''
    }

    render() {
        return html`
            <div class="avatar">
                ${this.isFirst ? html`<avatar-input id="avatar" .currentObject=${this} .avatar=${this.avatar || 'images/competition.svg'} @input=${this.validateAvatar}></avatar-input>` : ''}
            </div>
            <div class="label">
                ${this.#competitionName}
            </div>
            <div class="label">
                ${this.#competitionDate}
            </div>
            ${this.#registration}
            ${this.regulationsLink && !this.protocolLink ? html`<fashion-button class="regulations-link" @click=${this.regulationsLinkClick}>Регламент</fashion-button>` : ''}
            ${this.protocolLink ? html`<fashion-button @click=${this.protocolLinkClick}>Протоколы</fashion-button>` : ''}
        `
    }

    registration() {
        this.currentPage = 3
    }

    validateAvatar(e) {
        this.oldValues ??= new Map();
        if (!this.oldValues.has(e.target)) {
            this.oldValues.set(e.target, e.target.avatar)
            this.avatar = window.URL.createObjectURL(e.target.value);
            this.avatarFile = e.target.value;
            this.requestUpdate();
        }
        else if (this.oldValues.get(e.target) === e.target.avatar) {
            this.oldValues.delete(e.target.id)
            this.avatarFile = null;
        } else {
            this.avatar = window.URL.createObjectURL(e.target.value);
            this.avatarFile = e.target.value;
            this.requestUpdate();
        }
        this.isModified = this.oldValues.size !== 0;
    }

    regulationsLinkClick() {
        window.open(this.regulationsLink);
    }

    protocolLinkClick() {
        window.open(this.protocolLink);
    }

    async firstUpdated() {
        super.firstUpdated();
        this.isFirst  = false;
        this.isFirst = true;
    }
}

customElements.define("my-competition-section-1-list-1", MyCompetitionSection1List1);