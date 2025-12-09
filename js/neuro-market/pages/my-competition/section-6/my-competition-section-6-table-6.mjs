import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/tables/simple-table.mjs'
import '../../../../../components/tables/simple-table-header.mjs'
import lang from '../../../neuro-market-dictionary.mjs'

class MyCompetitionSection6Table6 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            items: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            sportsmenDataSource: { type: Object, default: null },
            isChampionship: {type: Boolean, default: false},
        }
    }
    constructor() {
        super()
        this.columns = [[
            { name: "place", label: lang`Place`, },
            { name: "sportsman", label: lang`Sportsman`, },
            { name: "category", label: lang`Short sports category`, },
            { name: "birthday", label: lang`Birthday`, },
            { name: "region", label: lang`Region RF`, },
            { name: "club", label: lang`Sports club`, },
            { name: "sportsNumber", label: lang`Number`, },
            { name: "result", label: lang`Result`, },
            { name: "points", label: lang`Points`, },
        ]]
        if (!this.parent?.championship) {
            this.groups = [
                { name: "ageGroup", label: item => item.ageGroup, title: lang`Age group` },
            ]
        }
        else {
            this.groups = [
                { name: "gender", label: item => item.gender == true ? lang`Women` : lang`Men`, title: lang`Gender` },
            ]
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    gap: 0px;
                    height: 100%;
                    width: 100%;
                    flex-direction: column;
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #item-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #item-header p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                }

                #property-header{
                    grid-area: header2;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;

                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }

                .left-layout item-button {
                    width: 100%;
                    height: 40px;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    gap: 10px;
                }

                h1 {
                    font-size: 3.4375rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 20px 0 0;
                }

                h2 {
                    font-weight: 300;
                    line-height: 1.2;
                    font-size: 1.25rem;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                a {
                    display: inline-block;
                    text-transform: uppercase;
                    color: var(--native-color);
                    margin: 20px auto 0 0;
                    background-color: var(--background-green);
                    letter-spacing: 1px;
                    text-decoration: none;
                    white-space: nowrap;
                    padding: 10px 30px;
                    border-radius: 0;
                    font-weight: 600;
                }

                a:hover {
                    background-color: var(--button-hover-color);
                }

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                footer simple-button {
                    height: 40px;
                }
                #drop_zone {
                    border: 5px solid blue;
                    width: 200px;
                    height: 100px;
                }
                avatar-input {
                    height: 50px;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .left-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                .right-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }

                .table {
                    overflow-y: auto;
                    overflow-x: auto;
                    height: 100%;
                    width: 100%;
                    /* width */
                    &::-webkit-scrollbar {
                        width: 10px;
                    }

                    /* Track */
                    &::-webkit-scrollbar-track {
                        box-shadow: inset 0 0 5px grey;
                        border-radius: 5px;
                    }

                    /* Handle */
                    &::-webkit-scrollbar-thumb {
                        background: red;
                        border-radius: 5px;
                    }

                }
            `
        ]
    }

    sportsmanName(sportsman) {
        if (!sportsman) {
            return sportsman
        }
        let result = sportsman.lastName
        if (sportsman.firstName) {
            result += ` ${sportsman.firstName}`
        }
        if (sportsman.middleName) {
            result += ` ${sportsman.middleName}`
        }
        return result
    }

    clubShowValue(club) {
        if (club?.name)
            return `${club?.name}, ${club?.city?.type?.shortName || ''} ${club?.city?.name}`
        return ''
    }

    resultToValue(result) {
        const parts = result.split(':')
        const minutes = parts[1].split(',')
        return (+parts[0] * 60 + +minutes[0]) * 10 + +minutes[1];
    }

    throwingResultToValue(result) {
        let parts = result.split(',')
        return +parts[0] * 100 + +parts[1];
    }

    sprintingResultToValue(result) {
        let parts = result.split(',')
        return +parts[0] * 10 + +parts[1];
    }

    getResult(a) {
        if (a.result === '')
            return ''
        switch ( this.discipline) {
            case 'shooting':
            case 'pullUps':
            case 'pushUps':
            case 'jumping':
                return +a.result
            case 'swimming':
            case 'running':
            case 'skiing':
            case 'rollerSkiing':
                return -this.resultToValue(a.result)
            case 'throwing':
                return this.throwingResultToValue(a.result)
            case 'sprinting':
                return -this.sprintingResultToValue(a.result)
            default:
                return 0;
        }
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
        if (changedProps.has('sportsmenDataSource')) {
            this.items = this.sportsmenDataSource.items.map(item => {
                return {
                    _id: item?._id,
                    place: item?.[this.discipline]?.place ?? '',
                    sportsman: this.sportsmanName(item),
                    gender: item.gender,
                    ageGroup: item.ageGroup?.name,
                    ageGroupOrder: item.ageGroup?.sortOrder,
                    birthday: new Date(item.birthday).toLocaleDateString(),
                    category: item.category?.shortName,
                    // year: new Date(item.birthday).getFullYear(),
                    region: item.region?.shortName ?? item.region?.name,
                    club: this.clubShowValue(item.club),
                    sportsNumber: item.sportsNumber,
                    result: item?.[this.discipline]?.result ?? '',
                    points: item?.[this.discipline]?.points ?? ''
                    /* + +(item.pushUps?.points ?? 0) + +(item.pullUps?.points ?? 0)
                      + +(item.swimming?.points ?? 0) + +(item.throwing?.points ?? 0) + +(item.sprinting?.points ?? 0) + +(item.running?.points ?? 0)
                      + +(item.skiing?.points ?? 0) + +(item.rollerSkiing?.points ?? 0)  + +(item.jumping?.points ?? 0),
                    */
                }
            }).sort((a, b) => (!this.parent?.championship ? a.gender - b.gender || a.ageGroupOrder - b.ageGroupOrder : a.gender - b.gender) || b.points - a.points || this.getResult(b) - this.getResult(a))
        }
    }

    render() {
        return html`
            <!-- <simple-table-header .columns=${this.columns}></simple-table-header> -->
            <div class="table">
                <!-- <simple-table @click=${this.tableClick} .hideHead=${true} .columns=${this.columns} .rows=${this.items}></simple-table> -->
                <simple-table @click=${this.tableClick} @dblclick=${this.tableClick} .columns=${this.columns} .rows=${this.items} .groups=${this.groups}></simple-table>
            </div>
        `;
    }

    tableClick(e) {
        console.log(e)
    }

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

    pdfMethod(refereeDataSet) {
    //     pdfMake.fonts = {
    //     // Courier: {
    //     //     normal: 'Courier',
    //     //     bold: 'Courier-Bold',
    //     //     italics: 'Courier-Oblique',
    //     //     bolditalics: 'Courier-BoldOblique'
    //     // },
    //     // Helvetica: {
    //     //     normal: 'Helvetica',
    //     //     bold: 'Helvetica-Bold',
    //     //     italics: 'Helvetica-Oblique',
    //     //     bolditalics: 'Helvetica-BoldOblique'
    //     // },
    //     Times: {
    //         normal: 'Times-Roman',
    //         bold: 'Times-Bold',
    //         italics: 'Times-Italic',
    //         bolditalics: 'Times-BoldItalic'
    //     },
    //     // Symbol: {
    //     //     normal: 'Symbol'
    //     // },
    //     // ZapfDingbats: {
    //     //     normal: 'ZapfDingbats'
    //     // }
    // };
    // pdfMake.addFonts(fonts);
    const mainReferee = refereeDataSet.find( item => item.position.name === "Главный судья");
    const mainSecretary = refereeDataSet.find(item => item.position.name === "Главный секретарь");

    const tableBody = [
        [
            { text: 'Место', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 0, 0, 0] },
            { text: 'Спортсмен', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 5, 0, 0] },
            { text: 'Разряд', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 5, 0, 0] },
            { text: 'Дата рожд.', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 0, 0, 0] },
            { text: 'Субъект РФ', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 5, 0, 0] },
            { text: 'Спортивный клуб', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 5, 0, 0] },
            { text: 'Но\nмер', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 0, 0, 0] },
            { text: 'Результат', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 0, 0, 0] },
            { text: 'Очки', rowSpan: 2, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 5, 0, 0] },
        ],
        [
            '', '', '', '', '', '', '', '', ''
        ].map(cell => ({ text: cell, fillColor: '#d7e1b9' })),
    ];

    tableBody.push(...this.items.flatMap((item, index, rows) =>
            index === 0 && this.groups?.length || (this.groups && item[this.groups[0].name] != rows[index-1][this.groups[0].name]) ? [
            [
                {text: this.groups[0].label instanceof Function ? this.groups[0].label(item) : this.groups[0].label ? item[this.groups[0].name] + ' ' + this.groups[0].label : this.groups[0].label, fontSize: 10, fillColor: '#d7e1b9', alignment: "center", margin: [0, 0, 0, 0], colSpan: 9},
                {}, {}, {}, {}, {}, {}, {}, {},
            ],
            [
                { text: item.place ?? index + 1, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: item.sportsman ?? '', fontSize: 10, margin: [0, 0, 0, 0] },
                { text: item.category ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: item.birthday ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: item.region ?? '', fontSize: 10, margin: [0, 0, 0, 0] },
                { text: item.club ?? '', fontSize: 10, margin: [0, 0, 0, 0] },
                { text: item.sportsNumber ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: item.result ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
                { text: item.points ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
            ]
        ]
    :
        [[
            { text: item.place ?? index + 1, fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
            { text: item.sportsman ?? '', fontSize: 10, margin: [0, 0, 0, 0] },
            { text: item.category ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
            { text: item.birthday ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
            { text: item.region ?? '', fontSize: 10, margin: [0, 0, 0, 0] },
            { text: item.club ?? '', fontSize: 10, margin: [0, 0, 0, 0] },
            { text: item.sportsNumber ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
            { text: item.result ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
            { text: item.points ?? '', fontSize: 10, alignment: 'center', margin: [0, 0, 0, 0] },
        ]]
        ));

    const dot = 2.835;

    const docInfo = {
        info: {
            title: "sportsmen",
            author: "Polyathlon systems",
        },
        pageSize: 'A4',
        // { width: 297, height: 210 },
        pageOrientation: 'landscape',
        // pageOrientation: 'portrait',
        pageMargins: [28.35, 28.35, 28.35, 28.35],
        // defaultStyle: {
        //      font: 'timesnewromanpsmt'
        // },
        content: [
            { text: "Министерство спорта Российской Федерации", fontSize: 10, alignment: "center", margin: [0, 2, 0, 2] },
            { text: "Всероссийская Федерация Полиатлона", fontSize: 10, alignment: "center", margin: [0, 2, 0, 2] },
            {
                text: `${this.parent.name.name}${this.parent.stage ? ' ' + this.parent.stage.name : ''} по полиатлону в спортивной дисциплине`,
                fontSize: 14, bold: true, alignment: "center", margin: [0, 4, 0, 2]
            },
            {
                text: `${this.parent?.sportsDiscipline1?.name}`,
                fontSize: 14, bold: true, alignment: "center", margin: [0, 0, 0, 2]
            },
            {
                text: `№ СМ ${this.parent?.ekpNumber} в ЕКП`,
                fontSize: 12, bold: true, alignment: "center", margin: [0, 2, 0, 4]
            },
            {
                columns: [
                    {
                        text: this.#competitionDate(this.parent),
                        margin: [10, 0, 0, 0],
                        fontSize: 10,
                        alignment: "left",
                    },
                    {
                        text: `г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`,
                        alignment: "right",
                        margin: [0, 0, 10, 0],
                        fontSize: 10,
                    },
                ]
            },
            {
                text: "Итоговый протокол по спринту",
                fontSize: 14,
                bold: true,
                alignment: "center",
                margin: [0, 6, 0, 10],
            },
            {
                table: {
                    margin: [0, 0, 0, 0],
                    // widths: [20, 90, 18, 20, 84, 88, 20, 20, 20],
                    widths: [7*dot, '*', 12*dot, 16*dot, 40*dot, '*', 9*dot, 9*dot, 9*dot],
                    // widths: [28.35, 45*dot, 28.35, 15*dot, 42*dot, 44*dot, 28.35, 28.35, 28.35],
                    body: tableBody,
                    alignment: "center",
                    headerRows: 2
                },
            },
            {
                columns: [
                    {
                        text: mainReferee?.position.name ?? '',
                        margin: [50, 20, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: `${mainReferee?.firstName?.[0] ?? ''}.${mainReferee?.middleName?.[0] ?? ''}. ${mainReferee?.lastName ?? ''}`,
                        alignment: "left",
                        margin: [50, 20, 0, 0],
                        fontSize: 10,
                    },
                ]
            },
            {
                columns: [
                    {
                        text: mainReferee?.category?.name ?? '',
                        margin: [50, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: `(г. ${mainReferee?.city?.name ?? ''}, ${mainReferee?.city?.region?.name ?? ''})`,
                        alignment: "left",
                        margin: [50, 0, 0, 0],
                        fontSize: 10,
                    },
                ]
            },
            {
                columns: [
                    {
                        text: mainSecretary?.position.name ?? '',
                        margin: [50, 10, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: `${mainSecretary?.firstName?.[0] ?? ''}.${mainSecretary?.middleName?.[0] ?? ''}. ${mainSecretary?.lastName ?? ''}`,
                        alignment: "left",
                        margin: [50, 10, 0, 0],
                        fontSize: 10,
                    },
                ]
            },
            {
                columns: [
                    {
                        text: mainSecretary?.category?.name ?? '',
                        margin: [50, 0, 0, 0],
                        fontSize: 10,
                    },
                    {
                        text: `(г. ${mainSecretary?.city?.name ?? ''}, ${mainSecretary?.city?.region?.name ?? ''})`,
                        alignment: "left",
                        margin: [50, 0, 0, 0],
                        fontSize: 10,
                    },
                ]
            },
        ]
    };
    pdfMake.createPdf(docInfo).open();
}

}

customElements.define("my-competition-section-6-table-6", MyCompetitionSection6Table6);