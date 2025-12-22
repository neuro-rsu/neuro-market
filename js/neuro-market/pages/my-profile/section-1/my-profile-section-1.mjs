import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'
import '../../../../../components/buttons/aside-button.mjs'
import '../../../../../components/buttons/simple-button.mjs'
import '../../../../../components/buttons/fashion-button.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs';

import { isAuth, States } from '../../../../utils.js'

import { TELEGRAM_BOT_NAME } from '../../../neuro-market-config.mjs';

import './my-profile-section-1-page-1.mjs'

import DataSet from './my-profile-dataset.mjs'
import DataSource from './my-profile-datasource.mjs'

class MyProfileSection1 extends BaseElement {
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
            avatar: { type: Object, default: null },
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
                    fashion-button {
                        margin-top: 10px;
                        border-radius: 8px;
                        padding: 10px 10px;
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
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'telegram-bot-solid', page: 'my-referee-categories', title: lang`Telegram bot`, click: () => this.telegramBot()},
            {iconName: 'no-avatar', page: 'my-sportsmen', title: lang`Remove avatar`, click: () => this.removeAvatar()},
            {iconName: 'excel-import-solid', page: 'my-referee-categories', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'arrow-left-solid', page: 'my-referee-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]

        this.pages = [
            {name: 'page1', iconName: 'user', page: 0, title: lang`User`, click: () => this.gotoPage(0), visible: true},
            {name: 'page2', iconName: () => this.currentItem?.personalInfo?.gender == true ? 'sportsman-woman-solid' : 'sportsman-man-solid', page: 1, title: lang`Sportsman`, click: () => this.gotoPage(1)},
            {name: 'page3', iconName: () => this.currentItem?.personalInfo?.gender == true ? 'referee-woman-solid' : 'referee-man-solid', page: 2, title: lang`Referee`, click: () => this.gotoPage(2)},
            {name: 'page4', iconName: () => this.currentItem?.personalInfo?.gender == true ? 'trainer-woman-solid' : 'trainer-man-solid', page: 3, title: lang`Trainer`, click: () => this.gotoPage(3)},
            {name: 'page5', iconName: () => this.currentItem?.personalInfo?.gender  == true ? 'federation-member-woman-solid' : 'federation-member-man-solid', page: 4, title: lang`Federation member`, click: () => this.gotoPage(4)},
        ]
    }

    async removeAvatar() {
        if (this.avatar) {
            let result = await DataSet.deleteAvatar();
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
        if (changedProps.has('currentProfileItem')) {
            this.currentPage = 0;
        }
    }

    async showItem(index, itemId) {
        if (this.isModified) {
            const modalResult = await this.confirmDialog('Запись была изменена. Сохранить изменения?')
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

    get page() {
        return cache(this[this.pages[this.currentPage].name])
    }

    get page1() {
        return html`
            <my-profile-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-profile-section-1-page-1>
        `;
    }

    get page2() {
        return html`
            <my-profile-section-1-page-2 .item=${this.currentItem}></my-profile-section-1-page-2>
        `;
    }

    get page3() {
        return html`
            <my-profile-section-1-page-3 .item=${this.currentItem}></my-profile-section-1-page-3>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    #list1() {
         return html`
            <div class="avatar">
                ${this.isFirst ? html`<avatar-input id="avatar" .currentObject=${this} .avatar=${this.avatar || 'images/no-avatar.svg'} @input=${this.validateAvatar}></avatar-input>` : ''}
            </div>
            <div class="label">
                ${JSON.parse(this.#loginInfo).login}
            </div>
            <fashion-button @click=${this.startTelegramBot}>Telegram Bot</fashion-button>
            <div class="statistic">
                <statistic-button label="Projects" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                <statistic-button label="Sales" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
                <statistic-button label="Wallet" @click=${this.certificatesClick} max=${this.projectCount} duration="5000"></statistic-button>
            </div>
        `
    }

    get #list() {
        switch(this.currentList) {
            case 0: return cache(this.#list1())
            default: return cache(this.#list1())
        }
    }

    async startTelegramBot() {
        const ulid = await DataSet.telegramToken()
        // window.open(`https://t.me/NeuroMarketBot?start=${token}`)
        // window.open(`https://t.me/system_polyathlon_bot?start=${token}`)
        window.open(`https://t.me/${TELEGRAM_BOT_NAME}?start=${ulid}`)
    }

    async telegramBot() {
        window.open(`https://t.me/${TELEGRAM_BOT_NAME}`)
    }

    // href="https://t.me/HTMLAcademyKeksobot?start=eyJib251c0lkIjoiYm9udXMxZGF5In0="

    get #task() {
        return html`
            <nav>${this.buttons.filter(button => button.iconName!=='no-avatar' || button.iconName==='no-avatar' && this.avatar).map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName instanceof Function ? button.iconName() : button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    get #loginInfo() {
        if (localStorage.getItem('rememberMe')) {
            return localStorage.getItem('userInfo')
        }
        else {
            return sessionStorage.getItem('userInfo')
        }
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
        } else {
            return html`
                <nav class="buttons">
                    ${this.pages.map( (button, index) =>
                        button.visible ? html`<aside-button icon-name=${button.iconName instanceof Function ? button.iconName() : button.iconName} title=${button.title} @click=${button.click} ?active=${this.currentPage === button.page}></aside-button>` : '' )
                    }
                </nav>
            `
        }
    }

    //  <!-- ${this.pageNames.map( (page, index) =>
    //                 html `
    //                     <icon-button ?active=${index === this.currentPage} icon-name=${page.iconName} label=${page.label} @click=${() => this.currentPage = index}></icon-button>
    //                 `
    //             )} -->
    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Profile`} ${this.currentItem?.name}</p>
            </header>
            <header class="right-header">
                ${this.sections.map( (section, index) =>
                    html `
                        <icon-button ?active=${index === this.currentSection && this.sections.length !== 1} icon-name=${section.iconName || nothing} label=${index === this.currentSection ? section.activeLabel ?? section.label : section.label} @click=${() => this.gotoSection(index)}></icon-button>
                    `
                )}
            </header>
            <div class="left-layout">
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

    gotoSection(index) {
        this.parentNode.host.currentSection = index
    }

    gotoPage(index) {
        switch (index) {
            case 1:
                location.hash = "#my-sportsman";
                location.search = `?sportsman=${this.sportsman.sportsman}`
                break;
            case 2:
                location.hash = "#my-referee";
                location.search = `?referee=${this.referee.referee}`
                break;
            case 3:
                location.hash = "#my-trainer";
                location.search = `?trainer=${this.trainer.trainer}`
                break;
            case 4:
                location.hash = "#my-federation-member";
                location.search = `?federation-member=${this.federationMember.federationMember}`
                break;

            default:
                break;
        }

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
        if (this.avatarFile) {
            let result = await DataSet.uploadAvatar(this.avatarFile);
            if (!result) return;
        }
        await this.dataSource.saveItem(this.currentItem);
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
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
        try {
            this.sportsman = await DataSet.getSportsmanProfile()
            this.pages[1].visible = '_id' in this.sportsman
        } catch(e) {

        }
        try {
            this.referee = await DataSet.getRefereeProfile()
            this.pages[2].visible = '_id' in this.referee
        } catch(e) {

        }
        try {
            this.trainer = await DataSet.getTrainerProfile()
            this.pages[3].visible = '_id' in this.trainer
        } catch(e) {

        }
        try {
            this.federationMember = await DataSet.getFederationMemberProfile()
            this.pages[4].visible = '_id' in this.federationMember
        } catch(e) {

        }
        this.avatar = await DataSet.downloadAvatar();
        this.isFirst = true;
    }
}

customElements.define("my-profile-section-1", MyProfileSection1);