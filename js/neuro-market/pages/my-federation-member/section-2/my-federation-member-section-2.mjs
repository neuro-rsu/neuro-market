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

import SportsmanDataset from '../../my-sportsmen/my-sportsmen-dataset.mjs'
import RefereeDataset from '../../my-referees/my-referees-dataset.mjs'
import TrainerDataset from '../../my-trainers/my-trainers-dataset.mjs'
import FederationMemberDataset from '../../my-federation-members/my-federation-members-dataset.mjs'
import ClubDataset from '../../my-clubs/my-clubs-dataset.mjs'

import './my-federation-member-section-2-page-1.mjs'
import './my-federation-member-section-2-page-2.mjs'
import './my-federation-member-section-2-page-3.mjs'
import './my-federation-member-section-2-page-4.mjs'
import './my-federation-member-section-2-page-5.mjs'
import './my-federation-member-section-2-page-6.mjs'

import './my-federation-member-section-2-list-1.mjs'
//import './my-competition-section-1-page-2.mjs'
// import './my-competition-section-2-page-1.mjs'
// import './my-competition-section-2-list-1.mjs'

import DataSet from './my-federation-member-dataset.mjs'
//import SportsmenDataSet from './my-sportsmen/my-sportsmen-dataset.mjs'
import DataSource from './my-federation-member-datasource.mjs'

class MyFederationMemberSection2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
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
                    /* justify-content: center; */
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
        this.listNames = [
            {label: lang`Federation member`, iconName: ''},
        ]
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
        this.pages = [
            {name: 'page1', iconName: 'sportsman-man-solid', page: 0, title: lang`Sportsman`, click: () => this.gotoPage(0)},
            {name: 'page2', iconName: 'referee-man-solid', page: 1, title: lang`Referee`, click: () => this.gotoPage(1)},
            {name: 'page3', iconName: 'trainer-man-solid', page: 2, title: lang`Trainer`, click: () => this.gotoPage(2)},
            {name: 'page4',iconName: 'federation-member-solid', page: 4, title: lang`Federation member`, click: () => this.gotoPage(3)},
            {name: 'page5',iconName: 'sportsman-man-solid', page: 4, title: lang`Sportsman`, click: () => this.gotoPage(4)},
            {name: 'page6',iconName: 'sportsman-man-solid', page: 4, title: lang`Sportsman`, click: () => this.gotoPage(5)},
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
        // if (changedProps.has('dataSource')) {
        //     this.requestUpdate()
        // }
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
        return this[this.pages[this.currentPage].name]
    }

    get page1() {
        return html`
            <my-federation-member-section-2-page-1 id="page1" .oldValues=${this.oldValues} .item=${this.currentItem}></my-federation-member-section-2-page-1>
        `;
    }

    get page2() {
        return html`
            <my-federation-member-section-2-page-2 id="page2" .oldValues=${this.oldValues} .item=${this.currentItem}></my-federation-member-section-2-page-2>
        `;
    }

    get page3() {
        return html`
            <my-federation-member-section-2-page-3 id="page3" .oldValues=${this.oldValues} .item=${this.currentItem}></my-federation-member-section-2-page-3>
        `;
    }

    get page4() {
        return html`
            <my-federation-member-section-2-page-4 id="page4" .oldValues=${this.oldValues} .item=${this.currentItem}></my-federation-member-section-2-page-4>
        `;
    }

    get page5() {
        return html`
            <my-federation-member-section-2-page-5 id="page5" .oldValues=${this.oldValues} .item=${this.currentItem}></my-federation-member-section-2-page-5>
        `;
    }

    get page6() {
        return html`
            <my-federation-member-section-2-page-6 id="page6" .oldValues=${this.oldValues} .item=${this.currentItem}></my-federation-member-section-2-page-6>
        `;
    }

    #list1() {
        return html`
            <my-federation-member-section-2-list-1 .item=${this.dataSource} .currentItem=${this.currentItem}></my-federation-member-section-2-list-1>
        `;
    }

    #list2() {
        return html`
            <my-federation-member-section-2-list-2 .parent=${this.currentItem}></my-federation-member-section-2-list-2>
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
        if (!this.dataSource?.items)
            return ''
        if (this.isModified) {
            return html`
                <nav class='save'>
                    <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                    <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
                </nav>
            `
        }
        else {
        //     ${this.pages.map( (button, index) =>
        //         button.visible ? '' : html`<aside-button icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page}></aside-button>`)
        //     }
        // </nav>
            return html`
                <nav class="buttons">
                    <aside-button icon-name=${"verified-status-solid"} title=${'Принять'} @click=${this.verified}></aside-button>
                    <aside-button icon-name=${"cancel-status-solid"} title=${'Отказаться'} @click=${this.cancel}></aside-button>
                    <aside-button icon-name=${"clock-status-solid"} title=${'Отложить'} @click=${this.clock}></aside-button>
                    <aside-button icon-name=${"add-status-solid"} title=${'Создать'} @click=${this.add}></aside-button>
                    <aside-button icon-name=${"reject-status-solid"} title=${'Отклонить'} @click=${this.reject}></aside-button>
                    <aside-button icon-name=${"accept-status-solid"} title=${'Завершить'} @click=${this.accept}></aside-button>
                </nav>
            `
        }
    }

    verified() {
      this.currentItem.status = { name: 'Рассматривается' }
      this.saveItem()
    }

    cancel() {
      this.currentItem.status = { name: 'Отказались' }
      this.saveItem()
    }

    clock() {
      this.currentItem.status = { name: 'Отложено' }
      this.saveItem()
    }

    reject() {
      this.currentItem.status = { name: 'Отклонено' }
      this.currentItem.active = false
      this.saveItem()
    }

    async accept() {
        this.currentItem.status = { name: 'Выполнено' }
        this.currentItem.active = false
        switch (this.currentPage) {
            case 0:
                await DataSet.addSportsmanProfile(this.currentItem)
                break;
            case 1:
                await DataSet.addRefereeProfile(this.currentItem)
                break;
            case 2:
                await DataSet.addTrainerProfile(this.currentItem)
                break;
            case 3:
                await DataSet.addFederationMemberProfile(this.currentItem)
                break;
        }
        this.saveItem()
    }

    async add() {
        switch (this.currentPage) {
            case 0:
                if (this.currentItem?.payload) {
                    this.currentItem.sportsman = await SportsmanDataset.addItem(this.currentItem?.payload)
                    this.$id("page1").requestUpdate()
                    this.isModified = true
                }
                break;
            case 1:
                if (this.currentItem?.payload) {
                    this.currentItem.referee = await RefereeDataset.addItem(this.currentItem?.payload)
                    this.$id("page2").requestUpdate()
                    this.isModified = true
                }
                break;
            case 2:
                if (this.currentItem?.payload) {
                    this.currentItem.trainer = await TrainerDataset.addItem(this.currentItem?.payload)
                    this.$id("page3").requestUpdate()
                    this.isModified = true
                }
                break;
            case 3:
                if (this.currentItem?.payload) {
                    this.currentItem.federationMember = await FederationMemberDataset.addItem(this.currentItem?.payload)
                    this.$id("page4").requestUpdate()
                    this.isModified = true
                }
                break;
            case 4:
                if (this.currentItem?.payload) {
                    this.currentItem.sportsman = await SportsmanDataset.addItem(this.currentItem?.payload)
                    this.$id("page5").requestUpdate()
                    this.isModified = true
                }
                break;
            case 5:
                if (this.currentItem?.payload) {
                    this.currentItem.club = await ClubDataset.addItem(this.currentItem?.payload)
                    this.$id("page6").requestUpdate()
                    this.isModified = true
                }
                break;
            default:
                break;
        }
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
                        <icon-button ?active=${index === this.currentSection} icon-name=${section.iconName instanceof Function ? section.iconName(this.currentItem) : section.iconName || nothing} label=${section.label} @click=${() => this.gotoSection(index)}></icon-button>
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
        this.parentNode.host.currentSection = index
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
        this.isFirst  = false;
        const parentId = sessionStorage.getItem('federationMember')
        this.dataSource = new DataSource(this, await DataSet.getDataSet(parentId))
        await this.dataSource.init();
        this.currentPage = (this.currentItem.type ?? 1) - 1
    }
}

customElements.define("my-federation-member-section-2", MyFederationMemberSection2);