import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../neuro-market-dictionary.mjs'
import { skiingMask } from './masks.mjs'
import { isSkiingValid } from './validation.mjs'

class MyCompetitionSection6Page8 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
            findDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }
                .container {
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
            `
        ]
    }

    sportsmanName(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName}`
        }
        return result
    }

    sportsmanIconName() {
        return this.item?.gender == true ? "sportsman-woman-solid" : "sportsman-man-solid"
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <div class="container">
                <simple-input id="sportsman" label="${lang`Sportsman`}:" icon-name=${this.sportsmanIconName()} @icon-click=${this.gotoSportsmanPage} .value=${this.sportsmanName(this.item)}></simple-input>
                <simple-input id="ageGroup" label="${lang`Age group`}:" icon-name=${this.item?.gender == true ? "age-group-women-solid" : "age-group-solid"} .value=${this.item?.ageGroup?.name}></simple-input>
                <simple-input id="sportsNumber" label="${lang`Sports number`}:" icon-name="sports-number-solid" .value=${this.item?.sportsNumber} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="skiing.race" label="${lang`Race`}:" icon-name="ski-solid" .value=${this.item?.skiing?.race} @input=${this.validateInput}></simple-input>
                    <simple-input id="skiing.number" label="${lang`Skier number`}:" icon-name="number-circle-solid" .value=${this.item?.skiing?.number} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="skiing.start" label="${lang`Start`}:" icon-name="start-gun-solid" .mask=${skiingMask} .value=${this.item?.skiing?.start} @input=${this.validateInput}></simple-input>
                    <simple-input id="skiing.finish" label="${lang`Finish`}:" icon-name="flag-checkered-solid" .mask=${skiingMask} .value=${this.item?.skiing?.finish} @input=${this.validateInput}></simple-input>
                </div>
                <div class="name-group">
                    <simple-input id="skiing.result" label="${lang`Result`}:" icon-name="timer-solid" .mask=${skiingMask} .value=${this.item?.skiing?.result} @input=${this.validateInput}></simple-input>
                    <simple-input id="skiing.points" label="${lang`Points`}:" icon-name="hundred-points-solid" .value=${this.item?.skiing?.points} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="skiing.place" label="${lang`Place`}:" icon-name="places-solid" .value=${this.item?.skiing?.place} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    gotoSportsmanPage() {
        if (!this.item?.sportsmanUlid) {
            return
        }
        location.hash = "#my-sportsman";
        location.search = `?sportsman=${this.item?.sportsmanUlid.split(':')[1]}`
    }

    resultToValue(result) {
        const parts = result.split(':')
        const minutes = parts[1].split(',')
        return (+parts[0] * 60 + +minutes[0]) * 10 + +minutes[1];
    }

    pointsFind(result, table) {
        let value = this.resultToValue(result)
        return table.reduce( (last, item) =>
            value <= item.value && item.points > last ? item.points : last
        , 0)
    }

    setPoints(target) {
        if (isSkiingValid(target.value)) {
            let a = this.parent.sportsDiscipline1.ageGroups.find( item => item.ageGroup._id === this.item.ageGroup._id)
            let b = a.sportsDisciplineComponents.find( item => item.group.name === "Лыжная гонка")
            this.$id("skiing.points").value = this.pointsFind(target.value, this.item.gender == 0 ? b.men : b.women)
            this.$id("skiing.points").fire('input')
        }
        else {
            this.$id("skiing.points").value = ''
            this.$id("skiing.points").fire('input')
        }
    }

    setResult() {
        const start = this.$id("skiing.start").value;
        const finish = this.$id("skiing.finish").value;
        if (isSkiingValid(start) && isSkiingValid(finish)) {
            const startValue = this.resultToValue(start)
            const finishValue = this.resultToValue(finish)
            if (finishValue >= startValue) {
                const resultValue = finishValue - startValue;
                const a = (resultValue % 10).toString();
                const b = (Math.floor(resultValue / 10) % 60).toString().padStart(2, "0");
                const c = Math.floor(resultValue / 10 / 60).toString().padStart(2, "0");
                this.$id("skiing.result").value = `${c}:${b},${a}`
                this.$id("skiing.result").fire('input')
            }
        }
    }

    validateInput(e) {
        let id = e.target.id.split('.')

        let currentItem = this.item

        if (id.length === 1) {
            id = id[0]
        }
        else {
            currentItem = this.item[id[0]] ??= {}
            id = id.at(-1)
        }
        if (!this.oldValues.has(e.target)) {
            if (currentItem[id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[id] = e.target.value

        if (id === "result")
        {
            this.setPoints(e.target)
        }

        if (e.target.id === "start" || e.target.id === "finish")
        {
            this.setResult(e.target)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    async showDialog(message, type='message', title='') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        if (title) {
            modalDialog.title = title
        }
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async errorDialog(message) {
        return this.showDialog(message, 'error', 'Ошибка')
    }

    #competitionDate(parent) {
        const monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

        if (parent.startDate) {
            const start = parent.startDate.split("-")
            const end = parent.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${monthNames[start[1] - 1]} ${start[0]} года`
            }
            return `${start[2]} ${monthNames[start[1]-1]} - ${end[2]} ${monthNames[end[1] - 1]} ${start[0]} года`
        }
        return ''
    }

    pdfMethod(refereeDataSource) {
        const mainReferee = refereeDataSource.items.find( item => item.position.name === "Главный судья");
        const mainSecretary = refereeDataSource.items.find(item => item.position.name === "Главный секретарь");

        const tableBody = [
            [
                { text: 'Место', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Спортсмен', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Год рожд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Звание, разряд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Субъект РФ', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Спортивный клуб', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Очки', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
                { text: 'Вып. разряд', rowSpan: 2, fontSize: 8, fillColor: '#eeeeee' },
            ],
            [
                '', '', '', '', '', '', '', ''
            ].map(cell => ({ text: cell, fillColor: '#eeeeee' })),
        ];

        tableBody.push(...this.items.map((item, index) => ([
            { text: item.place ?? index + 1, fontSize: 8 },
            { text: item.sportsman ?? '', fontSize: 8 },
            { text: item.year ?? '', fontSize: 8 },
            { text: item.category ?? '', fontSize: 8 },
            { text: item.region ?? '', fontSize: 8 },
            { text: item.club ?? '', fontSize: 8 },
            { text: item.points ?? '', fontSize: 8 },
            { text: item.completedCategory ?? '', fontSize: 8 }
        ])));

        const docInfo = {
            info: {
                title: "sportsmen",
                author: "Polyathlon systems",
            },
            pageSize: "A4",
            pageOrientation: 'landscape',
            pageMargins: [20, 15, 20, 40],
            content: [
                { text: "Министерство спорта Российской Федерации", fontSize: 9, alignment: "center", margin: [0, 2, 0, 2] },
                { text: "Всероссийская Федерация Полиатлона", fontSize: 9, alignment: "center", margin: [0, 2, 0, 2] },
                {
                    text: `${this.parent.name.name}${this.parent.stage ? ' ' + this.parent.stage.name : ''} по полиатлону в спортивной дисциплине ${this.parent?.sportsDiscipline1?.name}`,
                    fontSize: 11, bold: true, alignment: "center", margin: [0, 4, 0, 2]
                },
                {
                    text: `№ СМ ${this.parent?.ekpNumber} в ЕКП`,
                    fontSize: 11, bold: true, alignment: "center", margin: [0, 0, 0, 4]
                },
                {
                    columns: [
                        {
                            text: this.#competitionDate(this.parent),
                            margin: [20, 0, 0, 0],
                            fontSize: 9,
                            alignment: "left",
                        },
                        {
                            text: `г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`,
                            alignment: "right",
                            margin: [0, 0, 20, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    text: "Протокол командного зачета среди команд спортивных клубов",
                    fontSize: 11,
                    bold: true,
                    alignment: "center",
                    margin: [0, 6, 0, 6],
                },
                {
                    table: {
                        widths: [25, 150, 35, 60, 120, 170, 75, 90],
                        body: tableBody,
                        headerRows: 2
                    },
                },
                {
                    columns: [
                        {
                            text: mainReferee?.position.name ?? '',
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `${mainReferee?.firstName?.[0] ?? ''}.${mainReferee?.middleName?.[0] ?? ''}. ${mainReferee?.lastName ?? ''}`,
                            alignment: "left",
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainReferee?.category?.name ?? '',
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `(г. ${mainReferee?.city?.name ?? ''}, ${mainReferee?.city?.region?.name ?? ''})`,
                            alignment: "left",
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainSecretary?.position.name ?? '',
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `${mainSecretary?.firstName?.[0] ?? ''}.${mainSecretary?.middleName?.[0] ?? ''}. ${mainSecretary?.lastName ?? ''}`,
                            alignment: "left",
                            margin: [50, 20, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
                {
                    columns: [
                        {
                            text: mainSecretary?.category?.name ?? '',
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                        {
                            text: `(г. ${mainSecretary?.city?.name ?? ''}, ${mainSecretary?.city?.region?.name ?? ''})`,
                            alignment: "left",
                            margin: [50, 0, 0, 0],
                            fontSize: 9,
                        },
                    ]
                },
            ]
        };

        pdfMake.createPdf(docInfo).open();
    }

    startEdit() {
        let input = this.$id("skiing.result")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("my-competition-section-6-page-8", MyCompetitionSection6Page8);