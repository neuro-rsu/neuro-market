import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

class MyCompetitionSection4List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            avatar: {type: Object, default: null},
            name: {type: String, default: null},
            startDate: {type: String, default: null},
            endDate: {type: String, default: null},
            stage: {type: String, default: null},
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
                return `${start[2]} ${MyCompetitionSection4List1.monthNames[start[1] - 1]}`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${MyCompetitionSection4List1.monthNames[start[1] - 1]}`
            }
            return `${start[2]} ${MyCompetitionSection4List1.monthNames[start[1]-1]} - ${end[2]} ${MyCompetitionSection4List1.monthNames[end[1] - 1]}`
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
            <fashion-button>Зарегистрироваться</fashion-button>
        `
    }

    async firstUpdated() {
        super.firstUpdated();
        this.isFirst  = false;
        this.avatar = null; // await this.downloadAvatar();
        this.isFirst = true;
    }
}

customElements.define("my-competition-section-4-list-1", MyCompetitionSection4List1);