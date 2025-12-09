import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'
import '../../../../../components/buttons/aside-button.mjs'
import '../../../../../components/buttons/simple-button.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import { isAuth, States } from '../../../../utils.js'

import './tab-1/my-sports-disciplines-section-1-tab-1-page-1.mjs'
import './tab-2/my-sports-disciplines-section-1-tab-2-page-1.mjs'
import './tab-2/my-sports-disciplines-section-1-tab-2-page-2.mjs'
import './tab-3/my-sports-disciplines-section-1-tab-3-page-1.mjs'
import './tab-3/my-sports-disciplines-section-1-tab-3-page-2.mjs'

import DataSet from './my-sports-disciplines-dataset.mjs'
import DataSource from './my-sports-disciplines-datasource.mjs'

class MySportsDisciplinesSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            sortDirection: { type: Boolean, default: true},
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            currentTab: { type: BigInt, default: 0 },
            currentRow: { type: BigInt, default: 0 },
        }
    }
    newRow
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
                        "aside main"
                        "footer1  footer2";
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
                    grid-area: main;
                    overflow-y: auto;
                    overflow-x: hidden;
                    display: flex;
                    /* justify-content: space-between; */
                    justify-content: center;
                    align-items: safe center;
                    /* margin-right: 20px; */
                    background: var(--layout-background-color);
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
        this.pageNames = [lang`Sports discipline`]
        this.oldValues = new Map();
        this.currentTab = 0
        this.tabNames = [
            {label: lang`Sports discipline`, iconName: 'category-solid'},
            {label: lang`Components`, iconName: 'puzzle-solid'},
            {label: lang`Categories table`, iconName: 'sportsman-man-solid'},
            {label: lang`Categories table`, iconName: 'sportsman-woman-solid'},
        ]
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
        this.pages = [
            {iconName: 'competition-solid', page: 0, title: lang`Competition`, click: () => this.gotoPage(0)},
            {iconName: 'age-group-solid', page: 1, title: lang`Location`, click: () => this.gotoPage(1)},
            {iconName: 'location-circle-solid', page: 2, title: lang`Location`, click: () => this.gotoPage(2)},
            // {iconName: 'map-solid', page: 3, title: lang`Swimming`, click: () => this.gotoPage(3)},
            {iconName: 'registration-solid', page: 5, title: lang`Swimming`, click: () => this.gotoPage(5)},
            {iconName: 'circle-trash-sharp-solid', page: -2, title: lang`Delete`, click: this.deleteItem},
        ]
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
        const file = e.target.files[0]
        const target = e.target
        const workbook = XLSX.read(await file.arrayBuffer())
        const worksheet = workbook.Sheets[workbook.SheetNames[0]]
        const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1})
        if (this.currentTab === 1) {
            this.currentItem.men = []
        } else {
            this.currentItem.women = []
        }
        raw_data.forEach((r, index) => {
            if(index) {
                if (r[1]) {
                    const result = r[1].toString().trim()
                    if (result) {
                        const results = result.split(":")
                        let value
                        if (results.length > 1) {
                            value = results[0] * 60 * 10
                            const values = results[1].split(',')
                            if (values.length > 1) {
                                value += values[0]*10 + +values[1]
                            } else {
                                value += values[0]*10
                            }
                        } else {
                            const values = results[0].split(',')
                            if (values.length > 1) {
                                value = values[0]*10 + +values[1]
                            } else {
                                value = values[0]*10
                            }
                        }

                        const newItem = {
                            points: +r[0],
                            result,
                            value,
                        }
                        if (this.currentTab === 1) {
                            this.currentItem.men.push(newItem)
                        } else {
                            this.currentItem.women.push(newItem)
                        }
                    }
                }
            }

        });
        // console.log(this.currentItem.men)
        await this.dataSource.saveItem(this.currentItem)
        target.value = ''
        this.requestUpdate()
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentSportsDiscipline')) {
            this.currentPage = 0;
        }
    }

    async showItem(item) {
        if (this.isModified) {
            const modalResult = await this.confirmDialog('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(item);
            }
            else {
                await this.cancelItem()
            }
        }
        else if (this.currentItem !== item) {
            this.dataSource.setCurrentItem(item)
        }
    }

    get #page() {
        switch(this.currentTab) {
            case 0:
                return this.#page1()
            case 2:
                switch(this.currentPage) {
                    case 0: return this.#page21()
                    case 1: return this.#page22()
                    default: return this.#page21()
                }
            case 3:
                switch(this.currentPage) {
                    case 0: return this.#page31()
                    case 1: return this.#page32()
                    default: return this.#page21()
                }
            default: return this.#page1()
        }
    }

    #page1() {
        return html`
            <my-sports-disciplines-section-1-tab-1-page-1 .currentPage=${this.currentPage} .oldValues=${this.oldValues} .item=${this.currentItem}></my-sports-disciplines-section-1-tab-1-page-1>
        `;
    }

    #page21() {
        return html`
            <my-sports-disciplines-section-1-tab-2-page-1 .men=${this.currentItem?.men} .currentPage=${this.currentPage} .item=${this.currentItem} @table-click=${this.tableClick}></my-sports-disciplines-section-1-tab-2-page-1>
        `;
    }
    #page22() {
        return html`
            <my-sports-disciplines-section-1-tab-2-page-2 .currentPage=${this.currentPage} .oldValues=${this.oldValues} .item=${this.newRow}></my-sports-disciplines-section-1-tab-2-page-2>
        `;
    }
    #page31() {
        return html`
            <my-sports-disciplines-section-1-tab-3-page-1 .women=${this.currentItem?.women} .currentPage=${this.currentPage} .item=${this.currentItem} @table-click=${this.tableClick}></my-sports-disciplines-section-1-tab-3-page-1>
        `;
    }
    #page32() {
        return html`
            <my-sports-disciplines-section-1-tab-3-page-2 .currentPage=${this.currentPage} .oldValues=${this.oldValues} .item=${this.newRow}></my-sports-disciplines-section-1-tab-3-page-2>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    get #list() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${item.name}
                        title=${item._id}
                        icon-name=${item.icon || 'category-solid'}
                        ?selected=${this.currentItem === item}
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    newRecord() {
        return html `<icon-button
                label=${ this.currentItem?.name }
                title=${ this.currentItem?.name }
                icon-name=${ this.currentItem?.icon || "category-solid" }
                ?selected=${ true }
            >
            </icon-button>
        `
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    tableClick(e) {
        this.currentRow = e.detail
        if (this.currentTab === 2) {
            this.newRow = structuredClone(this.currentItem.men[this.currentRow])
        } else if (this.currentTab === 3) {
            this.newRow = structuredClone(this.currentItem.women[this.currentRow])
        }
        this.currentPage = 1
    }

    async saveNewItem() {
        this.dataSource.saveNewItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    get #newItemFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.saveNewItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelNewItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    async cancelNewItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить добавление?')
        if (modalResult !== 'Ok')
            return
        this.dataSource.cancelNewItem()
        this.oldValues.clear();
        this.isModified = false;
    }

    get #itemFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.isModified ? this.saveItem: this.addNewItem}>${this.isModified ? lang`Save`: lang`Add`}</simple-button>
                <simple-button @click=${this.isModified ? this.cancelItem: this.deleteItem}>${this.isModified ? lang`Cancel`: lang`Delete`}</simple-button>
            </nav>
        `
    }

    async addNewItem() {
        this.dataSource.addNewItem(this.currentItem);
        // const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        // page.startEdit()
    }

    get #rightFooterTab1Page1() {
        if (!this.dataSource?.items)
            return ''
        if (this.dataSource.items.length) {
            return (this.dataSource.state === States.NEW) ? this.#newItemFooter : this.#itemFooter
        }

        if (this.isModified) {
            return this.#newItemFooter
        }
    }

    get #rightFooterTab2Page1() {
        if (!this.dataSource?.items)
            return ''
        return html`
            <nav class='save'>
                <simple-button @click=${this.addNewRow}>${lang`Add`}</simple-button>
            </nav>
        `
    }

    addNewRow() {
        this.newRow = {}
        this.currentPage = 1
        this.currentRow = -1
    }

    get #rightFooterTab2Page2() {
        if (this.currentRow === -1) {
            return this.#rightFooterTab2Page2Add
        }
        return this.#rightFooterTab2Page2Edit
    }

    get #rightFooterTab2Page2Add() {
        if (this.isModified) {
            return html`
                <nav class='save'>
                    <simple-button @click=${this.saveRow}>${this.isModified ? lang`Save`: lang`Delete`}</simple-button>
                    <simple-button @click=${this.cancelRow}>${this.isModified ? lang`Cancel`: lang`Close`}</simple-button>
                </nav>
            `
        } else {
            return html`
                <nav class='save'>
                    <simple-button @click=${this.closeRow}>${this.isModified ? lang`Cancel`: lang`Close`}</simple-button>
                </nav>
            `
        }
    }

    async saveRow() {
        if (this.currentRow === -1) {
            if (this.currentTab === 2) {
                if (!this.currentItem.men) {
                    this.currentItem.men = []
                }
                this.currentItem.men.push(this.newRow)
            } else {
                if (!this.currentItem.women) {
                    this.currentItem.women = []
                }
                this.currentItem.women.push(this.newRow)
            }
        } else {
            if (this.currentTab === 2) {
                this.currentItem.men[this.currentRow].category = this.newRow.category
                this.currentItem.men[this.currentRow].points = this.newRow.points
            } else {
                this.currentItem.women[this.currentRow].category = this.newRow.category
                this.currentItem.women[this.currentRow].points = this.newRow.points
            }
        }
        await this.dataSource.saveItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
        this.currentPage = 0
    }

    get #rightFooterTab2Page2Edit() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.isModified ? this.saveRow: this.deleteRow}>${this.isModified ? lang`Save`: lang`Delete`}</simple-button>
                <simple-button @click=${this.isModified ? this.cancelRow: this.closeRow}>${this.isModified ? lang`Cancel`: lang`Close`}</simple-button>
            </nav>
        `
    }

    async cancelRow() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
        if (modalResult !== 'Ok')
            return
        if (this.currentRow === -1) {
            this.newRow = {category: "", points: ""}
        } else {
            this.oldValues.forEach( (value, key) => {
                this.newRow[key.id] = value
                key.value = value;
            });
        }
        this.oldValues.clear();
        this.isModified = false;
    }

    closeRow() {
        this.currentPage = 0;
    }

    deleteRow() {
        if (this.currentTab === 2) {
            if (this.currentRow === -1) {
                this.currentPage = 0;
                return
            }
            this.currentItem.men.splice(this.currentRow, 1);
            this.saveItem()
        } else {
            if (this.currentRow === -1) {
                this.currentPage = 0;
                return
            }
            this.currentItem.women.splice(this.currentRow, 1);
            this.saveItem()
        }
        this.currentPage = 0
    }

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        switch(this.currentTab) {
            case 0:
                return this.#rightFooterTab1Page1
            case 2:
                switch(this.currentPage) {
                    case 0: return this.#rightFooterTab2Page1
                    case 1: return this.#rightFooterTab2Page2
                    default: return this.#rightFooterTab2Page1
                }
            case 3:
                switch(this.currentPage) {
                    case 0: return this.#rightFooterTab2Page1
                    case 1: return this.#rightFooterTab2Page2
                    default: return this.#rightFooterTab2Page1
                }
            default: this.#rightFooterTab1Page1
        }
    }

    // get #rightFooter() {
    //     if (this.isModified) {
    //         return html`
    //             <nav>
    //                 <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
    //                 <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
    //             </nav>
    //         `
    //     } else {
    //         return html`
    //             <nav>
    //                 <simple-button @click=${this.addItem}>${lang`Add`}</simple-button>
    //                 <simple-button @click=${this.deleteItem}>${lang`Delete`}</simple-button>
    //             </nav>
    //         `
    //     }

    // }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header"><p>${lang`Sports disciplines`}</p></header>
            <header class="right-header">
                ${this.tabNames.map( (tab, index) =>
                    html `
                        <icon-button ?active=${index === this.currentTab} icon-name=${tab.iconName || nothing} label=${tab.label} @click=${() => this.gotoTab(index)}></icon-button>
                    `
                )}

            </header>
            <div class="left-layout">
                ${this.dataSource?.state === States.NEW ? this.newRecord() : ''}
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
        this.parentNode.host.currentSection = index
    }

    gotoTab(index) {
        if (index === 1) {
            this.parentNode.host.currentSection = index
        } else {
            // this.parentNode.host.currentTab = index
            this.currentTab = index
        }
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

    async addItem() {
        const newItem = { name: "Новая группа дисциплин" }
        this.dataSource.addItem(newItem);
    }

    async saveItem() {
        await this.dataSource.saveItem(this.currentItem);
        this.oldValues?.clear();
        this.isModified = false;
    }

    async cancelItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все сделанные изменения?')
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
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить эту дисциплину?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
        await this.dataSource.init();
    }
}

customElements.define("my-sports-disciplines-section-1", MySportsDisciplinesSection1);