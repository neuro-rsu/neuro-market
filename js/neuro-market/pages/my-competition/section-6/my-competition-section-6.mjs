import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'

import '../../../../../components/buttons/aside-button.mjs';
import '../../../../../components/buttons/simple-button.mjs';

import lang from '../../../neuro-market-dictionary.mjs'

import { isAuth, States } from '../../../../utils.js'

import './my-competition-section-6-list-1.mjs'
import './my-competition-section-6-page-1.mjs'
import './my-competition-section-6-page-2.mjs'
import './my-competition-section-6-page-3.mjs'
import './my-competition-section-6-page-4.mjs'
import './my-competition-section-6-page-5.mjs'
import './my-competition-section-6-page-6.mjs'
import './my-competition-section-6-page-7.mjs'
import './my-competition-section-6-page-8.mjs'
import './my-competition-section-6-page-9.mjs'
import './my-competition-section-6-page-10.mjs'

import './my-competition-section-6-table-1.mjs'
import './my-competition-section-6-table-2.mjs'
import './my-competition-section-6-table-3.mjs'
import './my-competition-section-6-table-4.mjs'
import './my-competition-section-6-table-5.mjs'
import './my-competition-section-6-table-6.mjs'
import './my-competition-section-6-table-7.mjs'
import './my-competition-section-6-table-8.mjs'
import './my-competition-section-6-table-9.mjs'
import './my-competition-section-6-table-10.mjs'

import './my-competition-section-6-lot-1.mjs'

import DataSet from './my-competition-section-6-dataset.mjs'
import DataSource from './my-competition-section-6-datasource.mjs'

import CompetitionDataSource from '../section-1/my-competition-datasource.mjs'

import RefereeDataSet from '../section-3/my-competition-section-3-dataset.mjs'

class MyCompetitionSection6 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            sortDirection: { type: Boolean, default: true},
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            parent: { type: Object, default: {} },
            isTable: { type: Boolean, default: false, local: true },
            isLot: { type: Boolean, default: false, local: true },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: grid;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr 50px;
                    grid-template-areas:
                        "header1 header2"
                        "aside main"
                        "footer1 footer2";
                    gap: 0 20px;
                    width: 100%;
                    height: 100%;
                }

                header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .left-header {
                    grid-area: header1;
                    overflow: hidden;
                    min-width: 230px;
                    p {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin: 0;
                    }
                }

                .right-header {
                    grid-area: header2;
                    justify-content: flex-start;
                    icon-button {
                        height: 100%;
                        padding: 0 1vw;
                        &[active] {
                            background-color: var(--layout-background-color);
                            font-weight: bold;
                        }
                        &:hover {
                            background-color: var(--layout-background-color);
                        }
                    }

                }

                .left-layout {
                    grid-area: aside;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: var(--layout-background-color);
                    gap: 10px;
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                    }
                    .label {
                        text-align: center;
                    }
                }

                .right-layout {
                    grid-area: main;
                    overflow-y: auto;
                    overflow-x: hidden;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: safe center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
                    /* overflow: hidden; */
                    gap: 10px;
                }

                .left-footer {
                    grid-area: footer1;
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
                    grid-area: footer2;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    gap: 10px;
                    nav {
                        width: 100%;
                        height: 70%;
                        display: flex;
                        align-items: center;
                        justify-content: flex-end;
                        padding: 0 10px;
                        gap: 1.5vw;
                        simple-button {
                            height: 100%;
                        }
                        &.buttons {
                            justify-content: center;
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
            `
        ]
    }

    constructor() {
        super();
        this.statusDataSet = new Map()
        this.currentPage = 0;
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'places-solid', page: 'my-coach-categories', title: lang`Sports place`, click: () => this.sportsPlace()},
            {iconName: 'drawing-lots-solid', page: 'my-coach-categories', title: lang`Drawing lots`, click: () => this.drawingLots()},
            {iconName: 'pdf-make',  page: 'my-coach-categories', title: lang`Make in PDF`, click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
        this.pages = [
            {name: 'page1', iconName: 'shooting-solid', page: 0, title: lang`Shooting`, click: () => this.gotoPage(0)},
            {name: 'page4', iconName: 'swimming-solid', page: 1, title: lang`Swimming`, click: () => this.gotoPage(1)},
            {name: 'page6', iconName: 'sprinting-solid', page: 2, title: lang`Sprinting`, click: () => this.gotoPage(2)},
            {name: 'page5', iconName: 'throwing-solid', page: 3, title: lang`Throwing`, click: () => this.gotoPage(3)},
            {name: 'page7', iconName: 'running-solid', page: 4, title: lang`Running`, click: () => this.gotoPage(4)},
            // {name: 'page2', iconName: 'pull-ups-solid', page: 5, title: lang`Pull-ups`, click: () => this.gotoPage(5)},
            {name: 'page3', iconName: 'pull-ups-solid', page: 5, title: lang`Strength training`, click: () => this.gotoPage(5)},
            // {name: 'page3', iconName: 'push-ups-solid', page: 6, title: lang`Push-ups`, click: () => this.gotoPage(6)},
            {name: 'page8', iconName: 'skiing-solid', page: 6, title: lang`Skiing`, click: () => this.gotoPage(6)},
            {name: 'page9', iconName: 'roller-skiing-solid', page: 7, title: lang`Roller skiing`, click: () => this.gotoPage(7)},
            {name: 'page10', iconName: 'jumping-solid', page: 8, title: lang`Jumping`, click: () => this.gotoPage(8)},
        ]
        this.tables = [
            {name: 'table1', iconName: 'shooting-solid', page: 0, title: lang`Shooting`, click: () => this.gotoPage(0)},
            {name: 'table4', iconName: 'swimming-solid', page: 1, title: lang`Swimming`, click: () => this.gotoPage(1)},
            {name: 'table6', iconName: 'sprinting-solid', page: 2, title: lang`Sprinting`, click: () => this.gotoPage(2)},
            {name: 'table5', iconName: 'throwing-solid', page: 3, title: lang`Throwing`, click: () => this.gotoPage(3)},
            {name: 'table7', iconName: 'running-solid', page: 4, title: lang`Running`, click: () => this.gotoPage(4)},
            // {name: 'table2', iconName: 'pull-ups-solid', page: 5, title: lang`Strength training`, click: () => this.gotoPage(5)},
            {name: 'table3', iconName: 'pull-ups-solid', page: 6, title: lang`Strength training`, click: () => this.gotoPage(5)},
            {name: 'table8', iconName: 'skiing-solid', page: 7, title: lang`Skiing`, click: () => this.gotoPage(6)},
            {name: 'table9', iconName: 'roller-skiing-solid', page: 8, title: lang`Roller skiing`, click: () => this.gotoPage(7)},
            {name: 'table10', iconName: 'jumping-solid', page: 9, title: lang`Jumping`, click: () => this.gotoPage(8)},
        ]
        this.lots = [
            {name: 'lot1', iconName: 'shooting-solid', page: 0, title: lang`Shooting`, click: () => this.gotoPage(0)},
            {name: 'lot4', iconName: 'swimming-solid', page: 1, title: lang`Swimming`, click: () => this.gotoPage(1)},
            {name: 'lot6', iconName: 'sprinting-solid', page: 2, title: lang`Sprinting`, click: () => this.gotoPage(2)},
            {name: 'lot5', iconName: 'throwing-solid', page: 3, title: lang`Throwing`, click: () => this.gotoPage(3)},
            {name: 'lot7', iconName: 'running-solid', page: 4, title: lang`Running`, click: () => this.gotoPage(4)},
            // {name: 'lot2', iconName: 'pull-ups-solid', page: 5, title: lang`Pull-ups`, click: () => this.gotoPage(5)},
            {name: 'lot3', iconName: 'push-ups-solid', page: 6, title: lang`Strength training`, click: () => this.gotoPage(5)},
            {name: 'lot8', iconName: 'skiing-solid', page: 7, title: lang`Skiing`, click: () => this.gotoPage(6)},
            {name: 'lot9', iconName: 'roller-skiing-solid', page: 8, title: lang`Roller skiing`, click: () => this.gotoPage(7)},
            {name: 'lot10', iconName: 'jumping-solid', page: 9, title: lang`Jumping`, click: () => this.gotoPage(8)},
        ]
        this.resultNames = ['shooting', 'swimming', 'sprinting', 'throwing', 'running', 'strengthTraining', 'skiing', 'rollerSkiing', 'jumping'];
    }

    pdfMethod() {
        this.renderRoot.querySelector(".right-layout > *").pdfMethod?.(this.refereeDataSet)
    }

    drawingLots() {
        this.isLot = !this.isLot
    }

    allPoints() {

    }

    getPoints(a) {
        return a[this.resultNames[this.currentPage]]?.points ?? 0;
    }

    getPlace(a) {
        return a[this.resultNames[this.currentPage]]?.place ?? 0;
    }

    setPlace(a, value) {
        if (!a[this.resultNames[this.currentPage]])
            a[this.resultNames[this.currentPage]] = {}
        a[this.resultNames[this.currentPage]].place = value;
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
        switch ( this.resultNames[this.currentPage]) {
            case 'shooting':
            case 'pullUps':
            case 'pushUps':
            case 'jumping':
                return +a[this.resultNames[this.currentPage]].result
            case 'swimming':
            case 'running':
            case 'skiing':
            case 'rollerSkiing':
                return -this.resultToValue(a[this.resultNames[this.currentPage]].result)
            case 'throwing':
                return this.throwingResultToValue(a[this.resultNames[this.currentPage]].result)
            case 'sprinting':
                return -this.sprintingResultToValue(a[this.resultNames[this.currentPage]].result)
            default:
                return 0;
        }
    }

    sportsPlace() {
        const item = this.dataSource.items.map(item => item).sort((a, b) =>
        (!this.parent?.championship ? a.gender - b.gender || a.ageGroup?.sortOrder - b.ageGroup?.sortOrder : a.gender - b.gender) || this.getPoints(b) - this.getPoints(a) || this.getResult(b) - this.getResult(a))
        item.reduce((a, b, index) => {
            let place
            if (index === 0 || (!this.parent?.championship ? item[index - 1].ageGroup?.sortOrder != b.ageGroup?.sortOrder : item[index - 1].gender != b.gender)) {
                a = 0
                place = 1
            }
            else {
                place = this.getPoints(b) === this.getPoints(item[index - 1]) && this.getResult(b) === this.getResult(item[index - 1]) ? this.getPlace(item[index - 1]) : a + 1
            }

            if (this.getPlace(b) != place) {
                this.setPlace(b, place)
                this.dataSource.saveItem(b);
            }
            return a + 1
        }, 0)
        this.requestUpdate();
    }

    showPage(page) {
        location.hash = page;
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
        const RegionDataset = await import('../../my-regions/my-regions-dataset.mjs');
        const regionDataset = RegionDataset.default
        raw_data.forEach((r, index) => {
            if(index !== 0){
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
        if (changedProps.has('currentCountryItem')) {
            this.currentPage = 0;
        }
    }

    // async showItem(index, itemId) {
    //     if (this.isModified) {
    //         const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
    //         if (modalResult === 'Ok') {
    //             await this.dataSource.saveItem(this.currentItem);
    //         }
    //         else {
    //             await this.cancelItem()
    //         }
    //     }
    //     else {
    //         this.dataSource.setCurrentItem(this.dataSource.items[index])
    //     }
    // }

    get page() {
        return cache(this[(this.isLot ? this.lots : (this.isTable ? this.tables : this.pages))[this.currentPage].name])
    }

    get page1() {
        return html`
            <my-competition-section-6-page-1 .discipline=${"shooting"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-1>
        `;
    }

    get page2() {
        return html`
            <my-competition-section-6-page-2 .discipline=${"pullUps"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-2>
        `;
    }

    get page3() {
        return html`
            <my-competition-section-6-page-3 .discipline=${"strengthTraining"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-3>
            `;
    }

    get page4() {
        return html`
            <my-competition-section-6-page-4 .discipline=${"swimming"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-4>
            `;
    }

    get page5() {
        return html`
            <my-competition-section-6-page-5 .discipline=${"throwing"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-5>
        `;
    }

    get page6() {
        return html`
            <my-competition-section-6-page-6 .discipline=${"sprinting"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-6>
        `;
    }

    get page7() {
        return html`
            <my-competition-section-6-page-7 .discipline=${"running"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-7>
        `;
    }

    get page8() {
        return html`
            <my-competition-section-6-page-8 .discipline=${"skiing"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-8>
        `;
    }

    get page9() {
        return html`
            <my-competition-section-6-page-9 .discipline=${"rollerSkiing"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-9>
        `;
    }

    get page10() {
        return html`
            <my-competition-section-6-page-10 .discipline=${"jumping"} .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-page-10>
        `;
    }

    get table1() {
        return html`
            <my-competition-section-6-table-1 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"shooting"}></my-competition-section-6-table-1>
        `;
    }

    get table2() {
        return html`

            <my-competition-section-6-table-2 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"pullUps"}></my-competition-section-6-table-2>
        `;
    }

    get table3() {
        return html`
            <my-competition-section-6-table-3 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"strengthTraining"}></my-competition-section-6-table-3>
        `;
    }

    get table4() {
        return html`
            <my-competition-section-6-table-4 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"swimming"}></my-competition-section-6-table-4>
        `;
    }

    get table5() {
        return html`
            <my-competition-section-6-table-5 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"throwing"}></my-competition-section-6-table-5>
        `;
    }

    get table6() {
        return html`
            <my-competition-section-6-table-6 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"sprinting"}></my-competition-section-6-table-6>
        `;
    }

    get table7() {
        return html`
            <my-competition-section-6-table-7 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"running"}></my-competition-section-6-table-7>
        `;
    }

    get table8() {
        return html`
            <my-competition-section-6-table-8 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"skiing"}></my-competition-section-6-table-8>
        `;
    }

    get table9() {
        return html`
            <my-competition-section-6-table-9 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"rollerSkiing"}></my-competition-section-6-table-9>
        `;
    }

    get table10() {
        return html`
            <my-competition-section-6-table-10 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem} .discipline=${"jumping"}></my-competition-section-6-table-10>
        `;
    }

    get lot1() {
        return html`
            <my-competition-section-6-lot-1 .parent=${this.parent} .sportsmenDataSource=${this.dataSource} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-6-lot-1>
        `;
    }

    fio(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName[0]}.`
        }
        return result
    }

    newRecord() {
        return html `<icon-button
                label=${ this.fio(this.currentItem) || "Новый спортсмен" }
                title=''
                icon-name=${ this.currentItem?.gender == 0 ? "sportsman-man-solid" : "sportsman-woman-solid" }
                ?selected=${ true }
                .status=${{ name: this.currentItem?.sportsmanId || this.currentItem?.sportsmanUlid || "sportsman:new", icon: 'id-number-solid'} }
            >
            </icon-button>
        `
    }

    #list1() {
        return html`
            <my-competition-section-6-list-1 .item=${this} .currentItem=${this.currentItem} .sortDirection=${this.sortDirection}></my-competition-section-6-list-1>
        `;
    }

    #list3() {
        return html`
            <my-competition-section-6-list-1 .parent=${this.currentItem}></my-competition-section-6-list-3>
        `;
    }

    get #list() {
        switch (this.currentPage) {
            // case 6: return cache(this.#list2())
            default: return cache(this.#list1())
        }
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    get #firstItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveFirstItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #newItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveNewItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelNewItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #itemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    cancelLot() {
        this.isLot = false
    }

    lot(result) {
        console.log(result)
    }

    async saveLot() {
        await import( '../../../../../components/forms/lot-form.mjs')
        this.renderRoot.querySelector("lot-form").open().then( result => this.lot(result)).catch(() => '');
    }

    get #lotItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.saveLot}>${lang`Lot`}</simple-button>
                <simple-button @click=${this.cancelLot}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #addItemFooter() {
        if (this.isLot) {
            return this.#lotItemFooter
        }
        return html`
            <nav class="buttons">
                ${this.pages.map( (button, index) =>
                    button.visible ? html`<aside-button icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page} size="34"></aside-button>` : ''
                )}
            </nav>
        `
    }

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        if (!this.dataSource?.items)
            return ''
        if (this.dataSource.items.length) {
            if (this.dataSource.state === States.NEW) {
                return this.#newItemFooter
            }
            if (this.isModified) {
                return this.#itemFooter
            }
            return this.#addItemFooter
        }
        if (this.dataSource.state === States.NEW) {
            return this.#newItemFooter
        }
        if (this.isModified) {
            return this.#firstItemFooter
        }
        return ''
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <lot-form></lot-form>
            <header class="left-header">
                <p>${lang`Sportsmen` + ' ('+ this.dataSource?.items?.length +')'}</p>
                <p>
                    <aside-button icon-name=${ this.sortDirection ? "arrow-up-a-z-regular" : "arrow-up-z-a-regular"} @click=${this.sortPage}></aside-button>
                    <aside-button icon-name="filter-regular" @click=${this.filterPage}></aside-button>
                </p>
            </header>
            <header class="right-header">
                ${this.sections.map( (page, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection} icon-name=${page.iconName} label=${page.label} @click=${() => this.gotoSection(index)}></icon-button>
                    `
                )}
            </header>
            <div class="left-layout">
                ${this.dataSource?.state === States.NEW ? this.newRecord() : ''}
                ${this.#list}
            </div>
            <div class="right-layout">
                ${this.page}
            </div>
            <footer class="left-footer">
                ${this.#task}
            </footer>
            <footer class="right-footer">
                ${this.#rightFooter}
            </footer>
            <input type="file" id="fileInput" accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel, .csv" @input=${this.importFromExcel}/>
        `;
    }

    addFirstItem() {
        const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        page.startEdit()
    }

    gotoSection(index) {
        if (this.currentSection == index) {
            this.isTable = !this.isTable
        }
        else {
            this.parentNode.host.currentSection = index;
        }
    }

    gotoPage(index) {
        if (this.currentPage == index) {
            this.isTable = !this.isTable
        }
        else {
            this.currentPage = index
        }
    }

    nextPage() {
        this.currentPage++
    }

    prevPage() {
        this.currentPage--
    }

    filterPage() {
        this.currentFilter = {}
        this.currentPage = this.currentPage === 1 ? 0 : 1
    }

    sortPage() {
        this.sortDirection = !this.sortDirection
        this.dataSource.sort(this.sortDirection)
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message)
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async addNewItem() {
        this.dataSource.addNewItem(this.currentItem)
        // const page = this.renderRoot.querySelector('my-sportsmen-section-6-page-1')
        // page.startEdit()
    }


    async addItem() {
        this.dataSource.addItem(this.currentItem)
    }

    saveFirstItem() {
        this.dataSource.addItem(this.currentItem)
        this.oldValues?.clear()
        this.isModified = false;
    }

    async saveNewItem() {
        this.dataSource.saveNewItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async saveItem() {
        if ('_id' in this.currentItem) {
            await this.dataSource.saveItem(this.currentItem);
        } else {
            await this.dataSource.addItem(this.currentItem);
        }
        if (this.avatarFile) {
            let result = await DataSet.uploadAvatar(this.avatarFile, this.currentItem._id);
            if (!result) return;
        }
        this.avatarFile = null;
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelNewItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить добавление?')
        if (modalResult !== 'Ok')
            return
        this.dataSource.cancelNewItem()
        this.oldValues.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
        if (modalResult !== 'Ok')
            return
        this.oldValues.forEach( (value, key) => {
            if (key.id === 'avatar') {
                window.URL.revokeObjectURL(value);
                this.avatar = value;
                this.avatarFile = null;
            } else {
                const id = key.id?.split('.')
                if (id.length === 1) {
                    this.currentItem[key.id[0]] = value;
                }
                else {
                    this.currentItem[id[0]][id.at(-1)] = value
                }
                key.value = value;
            }
        });
        this.oldValues.clear();
        this.isModified = false;
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

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить этого спортсмена?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem, this.listItem)
    }

    changeVisible() {
        this.pages.forEach(page => {
            this.parent.sportsDiscipline1?.ageGroups?.forEach(ageGroup => {
                ageGroup.sportsDisciplineComponents?.forEach(discipline => {
                    page.visible = page.visible || discipline.group?.icon === page.iconName
                });
            });
        });
    }

    async firstUpdated() {
        super.firstUpdated();
        const parentId = sessionStorage.getItem('competition').split(':')[1]
        this.competitionDataSource = new CompetitionDataSource(this)
        this.parent = await this.competitionDataSource.getItem()
        this.changeVisible()
        this.refereeDataSet = await RefereeDataSet.getDataSet(parentId)
        this.dataSource = new DataSource(this, await DataSet.getDataSet(parentId))
    }
}

customElements.define("my-competition-section-6", MyCompetitionSection6);