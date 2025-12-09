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

import './my-competition-section-1-page-1.mjs'
import './my-competition-section-1-list-1.mjs'
import './my-competition-section-1-page-2.mjs'
import './my-competition-section-1-page-3.mjs'
import './page-4/my-competition-section-1-page-4.mjs'
// import './page-2/my-competition-section-1-page-2.mjs'
// import './my-competition-section-2-page-1.mjs'
// import './my-competition-section-2-list-1.mjs'

import DataSet from './my-competition-dataset.mjs'
//import SportsmenDataSet from './my-sportsmen/my-sportsmen-dataset.mjs'
import DataSource from './my-competition-datasource.mjs'

class MyCompetitionSection1 extends BaseElement {
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
            currentPage: { type: BigInt, default: 0, local: true },
            isFirst: { type: Boolean, default: false },
            currentList: { type: BigInt, default: 0, local: true},
            avatar: {type: Object, default: null, local: true},
            avatarFile: {type: Object, default: null, local: true},
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
            {label: lang`Competition`, iconName: ''},
        ]
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'qr-code-solid', page: 'my-sportsmen', title: lang`QR code`, click: () => this.getQRCode()},
            {iconName: 'no-avatar', page: 'my-sportsmen', title: lang`Remove avatar`, click: () => this.removeAvatar()},
            {iconName: 'excel-import-solid', page: 'my-coach-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
        this.pages = [
            {name: 'page1', iconName: 'competition-solid', page: 0, title: lang`Competition`, click: () => this.gotoPage(0)},
            {name: 'page2', iconName: 'age-group-solid', page: 1, title: lang`Age groups`, click: () => this.gotoPage(1)},
            {name: 'page3', iconName: 'location-circle-solid', page: 2, title: lang`Location`, click: () => this.gotoPage(2)},
            // {iconName: 'map-solid', page: 3, title: lang`Swimming`, click: () => this.gotoPage(3)},
            {name: 'page4', iconName: 'registration-solid', page: 3, title: lang`Registration`, click: () => this.gotoPage(3)},
            {iconName: 'circle-trash-sharp-solid', page: -2, title: lang`Delete`, click: this.deleteItem},
        ]
    }

    async removeAvatar() {
        if (this.avatar) {
            let result = await DataSet.deleteAvatar(this.currentItem._id);
            if (!result) return;
            this.avatar = null;
        }
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
        // if (changedProps.has('currentCountryItem')) {
        //     this.currentPage = 0;
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
            <my-competition-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-1-page-1>
        `;
    }

    get page2() {
        return html`
            <my-competition-section-1-page-2 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-1-page-2>
        `;
    }

    get page3() {
        return html`
            <my-competition-section-1-page-3 .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-1-page-3>
        `;
    }

    get page4() {
        return html`
            <my-competition-section-1-page-4 .parent=${this.currentItem}></my-competition-section-1-page-4>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    #list1() {
        return html`
            <my-competition-section-1-list-1 .oldValues=${this.oldValues} .startRegistration=${this.currentItem?.startRegistration} .endRegistration=${this.currentItem?.endRegistration} .avatar=${this.avatar} .name=${this.currentItem?.name} .startDate=${this.currentItem?.startDate} .endDate=${this.currentItem?.endDate} .stage=${this.currentItem?.stage} .regulationsLink=${this.currentItem?.regulationsLink} .protocolLink=${this.currentItem?.protocolLink}></my-competition-section-1-list-1>
        `;
    }

    #list2() {
        return html`
            <my-competition-section-1-list-2 .avatar=${this.avatar} .item=${this}></my-competition-section-1-list-2>
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
            <nav>${this.buttons.filter(button => button.iconName!=='no-avatar' || button.iconName==='no-avatar' && this.avatar).map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    async saveRegistration() {
        const page  = this.renderRoot.querySelector('my-competition-section-1-page-4')
        await page.saveItem()
        const modalResult = await this.showDialog("Ваша заявка получена. Скоро она будет рассмотрена")
        if (modalResult === "Ok") {
            this.currentPage = 0;
        }
    }

    async cancelRegistration() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отменить все изменения?')
        if (modalResult !== "Ok") {
            return
        }
        this.currentPage = 0;
    }

    get #rightFooter() {
        if (this.currentPage === 3) {
            if (!isAuth()) {
                return ''
            }
            return html`
                <nav>
                    <simple-button @click=${this.saveRegistration}>${lang`Send request`}</simple-button>
                    <simple-button @click=${this.cancelRegistration}>${lang`Cancel`}</simple-button>
                </nav>
            `
        }
        if (this.isModified) {
            if (!isAuth()) {
                return ''
            }
            return html`
                <nav>
                    <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                    <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
                </nav>
            `
        } else {
            return html`
                <nav class="buttons">
                    ${this.pages.map( (button, index) =>
                        html`<aside-button icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page} size="30"></aside-button>`)
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

    competitionName(item) {
        if (!item.name) {
            return ''
        }
        if (item.stage) {
            return `${item.name.name} ${item.stage?.name}`
        }
        return item.name.name
    }

    static monthNames = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']

    competitionDate(item) {
        if (item.startDate) {
            const start = item.startDate.split("-")
            const end = item.endDate.split("-")
            if (start[2] === end[2] && start[1] === end[1]) {
                return `${start[2]} ${MyCompetitionSection1.monthNames[start[1] - 1]}`
            }
            if (start[1] === end[1]) {
                return `${start[2]}-${end[2]} ${MyCompetitionSection1.monthNames[start[1] - 1]}`
            }
            return `${start[2]} ${MyCompetitionSection1.monthNames[start[1]-1]} - ${end[2]} ${MyCompetitionSection1List1.monthNames[end[1] - 1]}`
        }
        return ''
    }

    async saveToFile(blob, fileName) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'competition-qr.svg');
        } else {
            const options = {
                suggestedName: fileName,
                types: [
                    {
                        description: 'SVG Files',
                        accept: {
                            'image/svg+xml': ['.svg']
                        }
                    },
                ],
                excludeAcceptAllOption: true
            };
            try {
                // Для других браузеров
                const fileHandle = await window.showSaveFilePicker(options);
                const writable = await fileHandle.createWritable();
                await writable.write(blob);
                await writable.close();
            } catch (err){
                if (err.name === 'AbortError')
                    return
                console.error(err);
                // Для других браузеров
                const downloadUrl =  window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = fileName + '.svg';
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    window.URL.revokeObjectURL(downloadUrl);
                    document.body.removeChild(a);
                }, 0);
            }
        }
    }

    async getQRCode() {
        const dataURI = await DataSet.getQRCode(location.origin+`/system?competition=${this.currentItem._id.split(':')[1]}#my-competition`)
        const blob = await (await fetch(dataURI)).blob();
        await this.saveToFile(blob, this.competitionName(this.currentItem) + ' ' + this.competitionDate(this.currentItem))
        window.open(URL.createObjectURL(blob))
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
                const id = key.id?.split('.')
                if (id.length === 1) {
                    this.currentItem[key.id[0]] = value;
                }
                else {
                    let currentItem
                    for (let index = 0; index < id.length - 1; index++) {
                        currentItem = this.currentItem[id[index]] ??= {}
                    }
                    currentItem[id.at(-1)] = value
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

    async firstUpdated() {
        super.firstUpdated();
        this.isFirst  = false;
        this.dataSource = new DataSource(this)
        await this.dataSource.getItem()
        try {
            if (this.currentItem._id) {
                this.avatar = await DataSet.downloadAvatar(this.currentItem._id);
            }
        } catch {

        }
        this.isFirst = true;
    }
}

customElements.define("my-competition-section-1", MyCompetitionSection1);