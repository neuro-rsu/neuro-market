import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/upload-input.mjs'
import '../../../../../components/inputs/download-input.mjs'
import '../../../../../components/buttons/icon-button.mjs'
import '../../../../../components/inputs/avatar-input.mjs'
import '../../../../../components/buttons/aside-button.mjs';
import '../../../../../components/buttons/simple-button.mjs';

import lang from '../../../neuro-market-dictionary.mjs'

import { isAuth, States } from '../../../../utils.js'

import './my-competition-section-4-page-1.mjs'
import './my-competition-section-4-list-1.mjs'
import './my-competition-section-4-page-2.mjs'
import './my-competition-section-4-page-3.mjs'
import './my-competition-section-4-page-4.mjs'
import './my-competition-section-4-page-5.mjs'
import './my-competition-section-4-page-6.mjs'
import './my-competition-section-4-page-7.mjs'
import './my-competition-section-4-page-8.mjs'
import './my-competition-section-4-page-9.mjs'
//import './my-competition-section-4-page-2.mjs'
// import './my-competition-section-2-page-1.mjs'
// import './my-competition-section-2-list-1.mjs'

// import DataSet from './my-competition-dataset.mjs'
import CompetitionDataSource from '../section-1/my-competition-datasource.mjs'
import SportsmenDataSet from '../section-2/my-competition-section-2-dataset.mjs'
import SportsmenDataSource from '../section-2/my-competition-section-2-datasource.mjs'
import RefereeDataSource from '../section-3/my-competition-section-3-datasource.mjs'
import RefereeDataSet from '../section-3/my-competition-section-3-dataset.mjs'
//import SportsmenDataSet from './my-sportsmen/my-sportsmen-dataset.mjs'
import DataSource from './my-competition-datasource.mjs'

class MyCompetitionSection4 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            competitionDataSource: { type: Object, default: null },
            refereeDataSource: { type: Object, default: null },
            sportsmenDataSource: { type: Object, default: null },
            sportsCategoriesDataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            isFirst: { type: Boolean, default: false },
            currentList: { type: BigInt, default: 0, local: true},
            parent: { type: Object, default: {} },
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
                    justify-content: flex-start;
                    min-width: 230px;
                    p {
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        margin: 0;
                    }
                    icon-button {
                        height: 100%;
                        padding: 0 1vw;
                        font-weight: 400;
                        &:not(:only-child):active {
                            background-color: var(--layout-background-color);
                        }
                        &:not(:only-child):hover {
                            background-color: var(--layout-background-color);
                        }
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

                .avatar {
                    width: 100%;
                }

                avatar-input {
                    width: 80%;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    grid-area: main;
                    overflow-y: hidden;
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
                        gap: 1vw;
                        simple-button {
                            height: 100%;
                        }
                        &.buttons {
                            justify-content: center;
                        }
                    }
                }

                /* icon-button[selected] {
                    border-radius: 5px;
                    background: rgba(255, 255, 255, 0.1)
                }

                icon-button:hover {
                    background: var(--list-icon-button-hover, rgba(255, 255, 255, 0.1));
                    &[selected] {
                        border-radius: 5px;
                        background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                    }
                }   */

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
        this.listNames = [
            {label: lang`Competition`, iconName: ''},
        ]
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'pdf-make',  page: 'my-referee-categories', title: lang`Make in PDF`, click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
        this.pages = [
            {title: lang`Competition statistic`, page: () => this.#page1(), iconName: 'chart-pie-solid', click: () => this.gotoPage(0)},
            {title: lang`Sport categories statistic`, page: () => this.#page5(), iconName: 'sportsman-category-solid', click: () => this.gotoPage(1)},
            {title: lang`Club types statistic`, page: () => this.#page6(), iconName: 'club-type-solid', click: () => this.gotoPage(2)},
            {title: lang`Region statistic`, page: () => this.#page8(), iconName: 'region-solid', click: () => this.gotoPage(3)},
            {title: lang`Medal counts`, page: () => this.#page9(), iconName: 'medal-1-solid', click: () => this.gotoPage(4)},
            {title: lang`Winners`, page: () => this.#page10(), iconName: 'competition-solid', click: () => this.gotoPage(5)},
            {title: lang`Stadium statistic`, page: () => this.#page11(), iconName: 'stadium-solid', click: () => this.gotoPage(6)},
            {title: lang`Referee categories statistic`, page: () => this.#page7(), iconName: 'referee-category-solid', click: () => this.gotoPage(7)},
            {title: lang`Personal championship`, page: () => this.#page2(), iconName: 'person-championship-solid', click: () => this.gotoPage(8)},
            {title: lang`Team championship`, page: () => this.#page4(), iconName: 'team-championship-solid', click: () => this.gotoPage(10)},
            {title: lang`Club championship`, page: () => this.#page3(), iconName: 'club-championship-solid', click: () => this.gotoPage(9)},
        ]
    }

    pdfMethod() {
        this.renderRoot.querySelector(".right-layout > *").pdfMethod?.(this.refereeDataSource)
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

    get #page() {
        return this.pages[this.currentPage].page()
    }

    #page1() {
        return html`
            <my-competition-section-4-page-1 .parent=${this.parent} .sportsmenDataSource=${this.sportsmenDataSource} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-4-page-1>
        `;
    }

    #page2() {
        return html`
            <my-competition-section-4-page-2 .parent=${this.parent} .sportsmenDataSource=${this.sportsmenDataSource}></my-competition-section-4-page-2>
        `;
    }

    #page3() {
        return html`
            <my-competition-section-4-page-3 .parent=${this.parent} .dataSource=${this.clubDataSource}></my-competition-section-4-page-3>
        `;
    }

    #page4() {
        return html`
            <my-competition-section-4-page-4 .parent=${this.parent} .dataSource=${this.teamDataSource}></my-competition-section-4-page-4>
        `;
    }

    #page5() {
        return html`
            <my-competition-section-4-page-5 .parent=${this.parent} .categoryDataSource=${this.sportsCategoriesDataSource}></my-competition-section-4-page-5>
        `;
    }

    #page6() {
        return html`
            <my-competition-section-4-page-6 .parent=${this.parent} .clubTypesDataSource=${this.clubTypesDataSource}></my-competition-section-4-page-6>
        `;
    }


    #page7() {
        return html`
            <my-competition-section-4-page-7 .parent=${this.parent} .clubTypesDataSource=${this.refereeCategoryDataSource}></my-competition-section-4-page-7>
            `;
    }

    #page8() {
        return html`
            <my-competition-section-4-page-8 .parent=${this.parent} .dataSource=${this.teamDataSource}></my-competition-section-4-page-8>
        `;
    }

    #page9() {
        return html`
            <my-competition-section-4-page-9 .parent=${this.parent} .dataSource=${this.teamDataSource}></my-competition-section-4-page-9>
        `;
    }

    #page10() {
        return html`
            <my-competition-section-4-page-8 .parent=${this.parent} .dataSource=${this.teamDataSource}></my-competition-section-4-page-8>
        `;
    }

    #page11() {
        return html`
            <my-competition-section-4-page-8 .parent=${this.parent} .dataSource=${this.teamDataSource}></my-competition-section-4-page-8>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    #list1() {
        return html`
            <my-competition-section-4-list-1 .avatar=${this.avatar} .name=${this.currentItem?.name} .startDate=${this.currentItem?.startDate} .endDate=${this.currentItem?.endDate} .stage=${this.currentItem?.stage}></my-competition-section-4-list-1>
        `;
    }

    #list2() {
        return html`
            <my-competition-section-4-list-2 .avatar=${this.avatar} .item=${this}></my-competition-section-4-list-2>
        `;
    }

    get #list() {
        switch(this.currentList) {
            case 0: return cache(this.#list1())
            case 1: return cache(this.#list2())
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

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        if (this.isModified) {
            return html`
                <nav>
                    <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                    <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
                </nav>
            `
        }
        else {
            return html`
                <nav class="buttons">
                    ${this.pages.map( (button, index) =>
                        html`<aside-button size="34" icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page}></aside-button>`)
                    }
                </nav>
            `
        }
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить это соревнование?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                ${this.listNames.map( (list, index) =>
                    html `
                        <icon-button ?active=${index === this.currentList} icon-name=${list.iconName || nothing} label=${list.label} @click=${() => this.gotoList(index)}></icon-button>
                    `
                )}
            </header>
            <header class="right-header">
                ${this.sections.map( (section, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection} icon-name=${section.iconName || nothing} label=${section.label} @click=${() => this.gotoSection(index)}></icon-button>
                    `
                )}
            </header>
            <div class="left-layout">
                ${this.#list}
            </div>
            <div class="right-layout">
                ${this.#page}
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

    gotoSection(index) {
        this.parentNode.host.currentSection = index;
    }

    gotoPage(index) {
        this.currentPage = index
    }

    gotoList(index) {
        this.currentList = index
    }

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
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
        this.oldValues.forEach( (value, key) => {
            if (key.oldValue)
                key.oldValue = null;
        })
        this.oldValues?.clear();
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
                const currentItem = key.currentObject ?? this.currentItem
                currentItem[key.id] = value;
                key.oldValue = null;
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

    async firstUpdated() {
        super.firstUpdated();
        const parentId = sessionStorage.getItem('competition').split(':')[1]
        this.competitionDataSource = new CompetitionDataSource(this)
        this.parent = await this.competitionDataSource.getItem()
        this.sportsmenDataSource = new SportsmenDataSource(this, await SportsmenDataSet.getDataSet(parentId))
        this.refereeDataSource = new RefereeDataSource(this, await RefereeDataSet.getDataSet(parentId))
        this.teamDataSource = { items: this.sportsmenDataSource.getTeamResults() }
        this.clubDataSource = { items: this.sportsmenDataSource.getClubResults() }
        this.sportsCategoriesDataSource = this.sportsmenDataSource.sportsCategories()
        this.clubTypesDataSource = await this.sportsmenDataSource.clubTypes()
        this.refereeCategoryDataSource = await this.refereeDataSource.refereeCategories()

    }
}

customElements.define("my-competition-section-4", MyCompetitionSection4);