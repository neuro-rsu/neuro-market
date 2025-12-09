import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/confirm-dialog.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/upload-input.mjs'
import '../../../../components/inputs/download-input.mjs'
import '../../../../components/buttons/icon-button.mjs'
import '../../../../components/inputs/avatar-input.mjs'
import '../../../../components/buttons/aside-button.mjs';
import '../../../../components/cards/competition-card.mjs';
import '../../../../components/selects/filter-select.mjs';

import lang from '../../neuro-market-dictionary.mjs'

// import './my-competitions-section-1-page-1.mjs'

import CompetitionTypeDataset from '../my-competition-types/my-competition-types-dataset.mjs'
import CompetitionTypeDataSource from '../my-competition-types/my-competition-types-datasource.mjs'

import DataSet from './my-competitions-dataset.mjs'
import DataSource from './my-competitions-datasource.mjs'

class MyCompetitionsSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: {type: Object, default: null},
            competitionTypeDataSource: {type: Object, default: null},
            competitionType: {type: Object, default: null},
            competitionStatus: {type: Object, default: null},
            startDate: {type: String, default: ''},
            statusDataSet: {type: Map, default: null },
            oldValues: {type: Map, default: null },
            currentItem: {type: Object, default: null},
            isModified: {type: Boolean, default: "", local: true},
            isReady: {type: Boolean, default: true},
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: {type: BigInt, default: 0},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    width: 100%;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr 50px;
                    grid-template-areas:
                        "header1 header2"
                        "sidebar content"
                        "footer1  footer2";
                    gap: 0 20px;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .left-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    min-width: 230px;
                    p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                    }
                }

                .right-header{
                    grid-area: header1 / header1 / header1 / header2;
                }

                .filter {
                    display: flex;
                    width: 100%;
                }

                .left-layout {
                    grid-area: sidebar /  sidebar / sidebar / content;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: var(--layout-background-color);
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                    }
                }

                .right-layout {
                    overflow-y: auto;
                    overflow-x: hidden;
                    grid-area: content;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: safe center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
                    overflow: hidden;
                    gap: 10px;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                .left-footer {
                    grid-area: footer1 / footer1 / footer2 / footer2;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    gap: 10px;
                    nav {
                        background-color: rgba(255, 255, 255, 0.1);
                        width: 100%;
                        height: 70%;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        /* padding-right: 10px; */
                        gap: 1vw;
                    }
                }

                .right-footer {
                    grid-area: footer1 / footer1 / footer2 / footer2;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    /* margin-right: 20px; */
                    gap: 10px;
                    nav {
                        width: 100%;
                        height: 70%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding: 0 10px;
                        /* padding-right: 10px; */
                        gap: 1vw;

                        simple-button {
                            height: 100%;
                        }
                    }
                }

                icon-button[selected] {
                    border-radius: 5px;
                    background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                }

                icon-button:hover {
                    background: var(--list-icon-button-hover, rgba(255, 255, 255, 0.1));
                    &[selected] {
                        border-radius: 5px;
                        background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                    }
                }

                 /* width */
                 ::-webkit-scrollbar {
                    width: 10px;
                }

                /* Track */
                ::-webkit-scrollbar-track {
                    box-shadow: inset 0 0 5px grey;
                    border-radius: 5px;
                }

                /* Handle */
                ::-webkit-scrollbar-thumb {
                    background: red;
                    border-radius: 5px;
                }

                #fileInput {
                    display: none;
                }
                .poly-items {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;

                    .poly-item {
                        display: flex;
                        flex-direction: column;
                        flex: 1;
                        margin: 5px;
                        width: 100%;
                        /* min-width: 480px; */
                       flex: 1 1 0%;

                        min-width: 320px;
                        max-width: 320px;
                        font-size: 14px;
                        background-color: rgba(0, 0, 0, 0.1);
                        .poly-header {
                            display: flex;
                            justify-content: flex-start;
                            flex-direction: row-reverse;
                            flex: 0 0 auto;
                            user-select: none;
                            background-color: #6001d2;
                            font-family: 'Rubik', sans-serif;
                            font-size: 18px;
                            color: #FFF;
                            line-height: 25px;
                            box-sizing: border-box;
                            font-weight: 600;
                            text-align: center;
                            padding: 5px;
                            .poly-competition-number {
                                white-space: nowrap;
                                user-select: text;
                            }
                            .poly-competition-name {
                                width: 100%;
                                text-align: center;
                                user-select: text;
                            }
                        }
                        .poly-schedule {
                            display: flex;
                            flex: 1 0 auto;
                            margin: 5px 0px;

                            .poly-left {
                                padding: 5px 5px 5px 0;
                                max-width: 35%;
                                .poly-dates {
                                    background-color: #6001d2;
                                    width: 100%;
                                    color: white;
                                    font-weight: 600;
                                    text-align: center;
                                    padding: 5px 0;
                                }
                                .poly-place {
                                    text-align: center;
                                }
                            }
                            .poly-image {
                                flex: 1;
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
                            .poly-main {
                                flex: 1;
                                width: 70%;
                                padding: 5px 0px 5px 5px;
                                .poly-schedule-title {
                                    width: 100%;
                                    background: darkgray;
                                    text-align: center;
                                    font-weight: 600;
                                    color: white;
                                    border-radius: 5px;
                                    padding: 5px 0;
                                }
                                .poly-age-groups {
                                    display: flex;
                                    justify-items: center;
                                    flex-direction: column;
                                    background: white;
                                    padding-top: 5px;
                                    padding-bottom: 5px;
                                    margin-left: 10px;
                                }
                            }

                        }
                        .poly-footer {
                            display: flex;
                            justify-content: space-evenly;
                            flex: 0 0 auto;
                            font-family: 'Rubik', sans-serif;
                            font-size: 16px;
                            color: white;
                            line-height: 25px;
                            box-sizing: border-box;
                            font-weight: 400;
                            text-align: center;
                            user-select: none;
                            .poly-button {
                                background-color: #121026;
                                border-radius: 5px;
                                cursor: pointer;
                                width: 100%;
                                margin: 0 3px;
                            }
                        }

                    }
                }
                competition-card:nth-of-type(2n + 1) {
                    background-color: rgba(0, 0, 0, 0.3);
                }
            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.pageNames = ['Information']
        this.oldValues = new Map()
        this.startDate = (new Date(Date.now()).toISOString()).split('T')[0]
        this.competitionStatusDateSource = {}
        this.competitionStatusDateSource.items = [
            { name: '--Статус--' },
            { name: 'Текущее' },
            { name: 'Ближайшее' },
            { name: 'Прошедшее' }
        ]
        this.competitionStatus = this.competitionStatusDateSource.items[0];
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-referee-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-referee-categories', title: lang`Back`, click: () => this.gotoBack()},
            {iconName: 'type-solid', page: 'my-competition-types', title: lang`Competition Types`, click: () => this.showPage('my-competition-types')},
            {iconName: 'category-solid', page: 'my-competition-kinds', title: lang`Competition Kinds`, click: () => this.showPage('my-competition-kinds')},
            {iconName: 'swimming-solid', page: 'my-countries', title: lang`Countries`, click: () => this.showPage('my-countries')},
        ]
    }

    showPage(hash, param) {
        sessionStorage.setItem('competition', param)
        location.hash = hash;
        // location.search = `?competition=${param}`;
    }

    gotoBack(page) {
        history.back();
    }

    async getNewFileHandle() {
        const options = {
          types: [
            {
              description: 'Excel files',
              accept: {
                'application/octet-stream': ['.xslx'],
              },
            },
            {
              description: 'Neural Models',
              accept: {
                'application/octet-stream': ['.pkl'],
              },
            },

          ],
        };
        const handle = await window.showSaveFilePicker(options);
        return handle;
    }

    ExcelFile() {
        this.renderRoot.getElementById("fileInput").click();
    }

    async importFromExcel(e) {
        const file = e.target.files[0];
        const workbook = XLSX.read(await file.arrayBuffer());
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
        const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
        const regionDataset = await RegionDataset.RegionDataset()
        raw_data.forEach((r, index) => {
            if( index !== 0 ){
                const newItem = {
                    lastName: r[1].split(' ')[0].toLowerCase()[0].toUpperCase() + r[1].split(' ')[0].toLowerCase().slice(1),
                    firstName: r[1].split(' ')[1],
                    middleName: r[1].split(' ')[2],
                    category: {
                        "_id": "referee-category:01J7NQ2NX0G3Y1R4D0GY1FFJT1",
                        "_rev": "3-ef23dd9cc44affc2ec440951b1d527d9",
                        "name": "Судья всероссийской категории",
                    },
                    region: regionDataset.find("name", r[4]),
                    order: {
                        number: r[5],
                        link: r[6]
                    },
                    link: r[7],
                }
                this.dataSource.addItem(newItem);
            }
        });
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentCompetitionItem')) {
            this.currentPage = 0;
        }
    }

    async showItem(index, itemId) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(this.currentItem);
            }
            else {
                await this.cancelItem()
            }
        }
        else {
            this.dataSource.setCurrentItem(this.dataSource.items[index])
        }
    }

    #page() {
        return html`
            <div class="poly-items">
                <competition-card></competition-card>
                <competition-card></competition-card>
                <competition-card></competition-card>
                <competition-card></competition-card>
                <competition-card></competition-card>
            </div>
        `
        // return cache(this.currentPage === 0 ? this.#page1() : this.#page2());
    }

    // #page1() {
    //     return html`
    //         <my-competitions-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competitions-section-1-page-1>
    //     `;
    // }

    // #page2() {
    //     return html`
    //         <my-competitions-section-1-page-2 .item=${this.currentItem}></my-competitions-section-1-page-2>
    //     `;
    // }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    get #list() {
        return html`
            <div class="poly-items">
                ${this.dataSource?.items?.map((item, index) =>
                    html `
                        <competition-card .item=${item} @click=${() => this.showPage('my-competition', item._id)}></competition-card>
                    `
                )}
            </div>
        `
    }
    // get #list() {
    //     return html`
    //         <div class="poly-items">
    //             ${this.dataSource?.items?.map((item, index) =>
    //                 html `
    //                     <competition-card .item=${item}></competition-card>
    //                 `
    //             )}
    //         </div>
    //     `
    // }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    dateChange(e) {
        console.log(e.target.value)
    }

    // <input type="date" id="competition-time" min="2023-01-01" class="form-control" value="2024-10-07" onchange="competitionTimeFilter(event)">
    //         <!-- <input type="date" id="from" name="from" data-provide="datepicker" placeholder="Дата начало" class="form-control"> -->
    // <!-- <filter-select id="name" icon-name="referee-solid" @icon-click=${() => this.showPage('my-referee-types')} label="Name:" .dataSource=${this.refereeTypeDataSource} .value=${this.item?.name} @input=${this.validateInput}></filter-select> -->
    //
    //


//<simple-select id="name" label="${lang`Competition name`}:" icon-name="competition-solid" @icon-click=${() => this.showPage('my-competition-types')} .dataSource=${this.competitionTypeDataSource} .value=${this.item?.name} @input=${this.validateInput}></simple-select>
    competitionTypeChange(e) {
        this.competitionType = e.target.value
        this.dataSource.filter(this.startDate, this.competitionStatus, this.competitionType)
    }

    competitionStatusChange(e) {
        this.competitionStatus = e.target.value
        this.dataSource.filter(this.startDate, this.competitionStatus, this.competitionType)
    }

    async startDateChange(e) {
        this.startDate = e.target.value
        const currentYear = new Date(this.startDate).getFullYear()
        if (DataSet.year !== currentYear) {
            this.dataSource = new DataSource(this, await DataSet.getDataSetByYear(currentYear))
        }
        this.dataSource.filter(this.startDate, this.competitionStatus, this.competitionType)
    }

    get #filter() {
        return html`
        <div class="filter">
            <simple-input type="date" id="startDate" icon-name="calendar-days-solid" .value=${this.startDate} @input=${this.startDateChange} lang="ru-Ru"></simple-input>
            <filter-select id="status" icon-name="alarm-clock-solid" .dataSource=${this.competitionStatusDateSource} .value=${this.competitionStatus} @input=${this.competitionStatusChange}></filter-select>
            <filter-select id="competition-solid" icon-name="competition-solid" @icon-click=${() => this.showPage('my-referee-types')} .dataSource=${this.competitionTypeDataSource} .value=${this.competitionType} @input=${this.competitionTypeChange}></filter-select>
        </div>
        `
    }

    render() {
        return html`
            <confirm-dialog></confirm-dialog>
            <header class="right-header">${this.#filter}</header>
            <div class="left-layout">
                ${this.#list}
            </div>
            <footer class="right-footer">
                <nav class='save'>
                    <simple-button @click=${() => this.showPage('my-competition', 'new')}>${lang`Add`}</simple-button>
                </nav>
            </footer>
            `;
    }

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    async confirmDialogShow(message) {
        return await this.renderRoot.querySelector('confirm-dialog').show(message);
    }

    async addItem() {
        const newItem = { name: "Новое соревнование" }
        this.dataSource.addItem(newItem);
    }

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialogShow('Вы действительно хотите отменить все сделанные изменения?')
        if (modalResult !== 'Ok')
            return
        this.oldValues.forEach( (value, key) => {
            const currentItem = key.currentObject ?? this.currentItem
            currentItem[key.id] = value;
            key.value = value;
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    async deleteItem() {
        const modalResult = await this.confirmDialogShow('Вы действительно хотите удалить этот проект?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSetByYear(new Date(Date.now()).getFullYear()))
        this.competitionTypeDataSource = new CompetitionTypeDataSource(this, await CompetitionTypeDataset.getDataSet())
        this.competitionTypeDataSource?.items?.unshift({name: '--Наименование--'})
        this.competitionType = this.competitionTypeDataSource?.items?.[0]
    }
}

customElements.define("my-competitions-section-1", MyCompetitionsSection1)