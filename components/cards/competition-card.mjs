import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../buttons/simple-button.mjs'

// import styles from './input-css.mjs'

customElements.define("competition-card", class CompetitionCard extends BaseElement {
    static get properties() {
        return {
            item: { type: Object, default: undefined},
        }
    }

    static get styles() {
        return [
            // styles,
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 4fr 8fr;
                    grid-template-rows: 35px 1fr 25px;
                    grid-template-areas:
                        "header header"
                        "aside main"
                        "footer  footer";
                    gap: 0 0px;
                    min-width: 320px;
                    max-width: 320px;
                    font-size: 12px;
                    padding: 5px;
                    background-color: rgba(0, 0, 0, 0.1);
                }
                header {
                    grid-area: header;
                    display: flex;
                    flex-direction: row-reverse;
                    align-items: safe center;
                    background-color: #6001d2;
                    font-size: 14px;
                    font-weight: bold;
                    overflow: hidden;
                    padding: 0px 5px;
                    .competition-number {
                        white-space: nowrap;
                        user-select: text;
                    }
                    .competition-name {
                        width: 100%;
                        hyphens: auto;
                    }
                }
                aside {
                    grid-area: aside;
                    padding: 5px;
                    .dates {
                        background-color: #6001d2;
                        width: 100%;
                        color: white;
                        font-weight: 600;
                        text-align: center;
                        padding: 5px 0;
                    }
                    .place {
                        text-align: center;
                    }
                    .image {
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        max-width: 100%;
                        padding: 10px 5px 5px;
                        img {
                            max-width: 100%;
                            max-height: 150px;
                        }
                    }
                }
                main {
                    grid-area: main;
                    padding: 5px 0px 5px 5px;
                    .title {
                        width: 100%;
                        background: darkgray;
                        text-align: center;
                        font-weight: 600;
                        color: white;
                        border-radius: 5px;
                        padding: 5px 0;
                    }
                    .age-groups {
                        display: flex;
                        justify-items: center;
                        flex-direction: column;
                        padding-top: 5px;
                        padding-bottom: 5px;
                        margin-left: 10px;
                    }
                }
                footer {
                    grid-area: footer;
                    display: flex;
                    justify-content: space-evenly;
                    font-size: 16px;
                    color: white;
                    line-height: 25px;
                    box-sizing: border-box;
                    font-weight: 400;
                    text-align: center;
                }
            `
        ]
    }

    get #competitionName() {
        if (!this.item?.name) {
            return ''
        }
        if (this.item?.stage) {
            return `${this.item?.name?.name} ${this.item?.stage?.name}`
        }
        return this.item?.name?.name
    }

    static monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    get #competitionDate() {
        if (this.item?.startDate) {
            const start = this.item?.startDate.split("-")
            const end = this.item?.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${CompetitionCard.monthNames[start[1] - 1]}`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${CompetitionCard.monthNames[start[1] - 1]}`
            }
            return `${start[2]} ${CompetitionCard.monthNames[start[1]-1]} - ${end[2]} ${CompetitionCard.monthNames[end[1] - 1]}`
        }
        return ''
    }

    get #competitionPlace() {
        if (this.item?.city) {
            return `${this.item?.city?.name}, ${this.item?.city?.region?.name}, ${this.item?.city?.region?.country?.name}`
        }
        return ''
    }

    get #competitionDisciplines() {
        if (this.item?.sportsDiscipline2) {
            return `${this.item?.sportsDiscipline1.name}, ${this.item?.sportsDiscipline2?.name}`
        }
        return this.item?.sportsDiscipline1?.name
    }

    render() {
        return html`
            <header>
                <div class="competition-number">${this.#competitionDate}</div>
                <div class="competition-name">${this.#competitionName}</div>
                <!-- <div class="competition-name">${this.#competitionDate}</div> -->
            </header>
            <aside>
                <div class="dates">
                    ${this.item?.ekpNumber || this.item?.competitionId}
                </div>
                <div class="image">
                    <img src="images/competition.svg">
                </div>
                <div class="place">
                    ${this.#competitionPlace}
                </div>
            </aside>
            <main>
                <div class="title">
                    ${this.#competitionDisciplines}
                </div>
                <div class="age-groups">
                    <div class="age-group">
                        Мужчины, женщины
                    </div>
                    <div class="age-group">
                        Мужчины, женщины
                    </div>
                </div>
            </main>
            <footer>
                <simple-button @click=${this.saveItem}>Регламент</simple-button>
                <simple-button @click=${this.saveItem}>Протоколы</simple-button>
                <simple-button @click=${this.saveItem}>Подробнее</simple-button>
            </footer>
        `;
    }
});