import { BaseElement, html, css, cache, nothing } from '../../../../base-element.mjs'

import '../../../../../components/dialogs/modal-dialog.mjs'
import '../../../../../components/buttons/icon-button.mjs'

import '../../../../../components/buttons/aside-button.mjs';
import '../../../../../components/buttons/simple-button.mjs';

import lang from '../../../neuro-market-dictionary.mjs'

import { isAuth, States } from '../../../../utils.js'

import './my-competition-section-5-page-1.mjs'
import './my-competition-section-5-list-1.mjs'

import DataSet from './my-competition-section-5-dataset.mjs'
import DataSource from './my-competition-section-5-datasource.mjs'

import CompetitionDataSource from '../section-1/my-competition-datasource.mjs'

import CompetitionSportsmenDataSet from '../section-2/my-competition-section-2-dataset.mjs'
import CompetitionSportsmenDataSource from '../section-2/my-competition-section-2-dataset.mjs'

import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'
import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'

class MyCompetitionSection5 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null, local: true },
            isModified: { type: Boolean, default: false, local: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            parent: { type: Object, default: {} },
            status: { type: Object, default: null},
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
                        justify-content: center;
                        padding: 0 10px;
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
            {iconName: 'pdf-make',  page: 'my-referee-categories', title: lang`Make in PDF`, click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-coach-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
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

    pdfMethod() {
        const mainReferee = this.dataSource.items.find((item) => item.position.name === "Главный судья")
        const mainSecretary = this.dataSource.items.find((item) => item.position.name === "Главный секретарь")
        const docInfo = {
          info: {
            title: "Referees",
            author: "Polyathlon systems",
          },

          pageSize: "A4",
          pageOrientation: 'portrait',
          pageMargins: [50, 50, 30, 60],

          content: [
            {
              text: "Министерство спорта Российской федерации",
              fontSize: 14,
              alignment: "center",
              //margin: [0, 0, 0, 0], //левый, верхний, правый, нижний
            },
            {
                text: "Всероссийская федерация Полиатлона",
                fontSize: 14,
                alignment: "center",
            },
            {
                text: this.parent.name.name,
                fontSize: 18,
                bold:true,
                alignment: "center",
                margin: [0, 15, 0, 0],
            },
            {
                text: "по полиатлону в спортивной дисциплине",
                fontSize: 18,
                alignment: "center",
            },
            {
                text: this.parent?.sportsDiscipline1?.name,
                fontSize: 18,
                bold:true,
                alignment: "center",
            },
            {
                columns: [

                    {
                        width: 'auto',
                        text: this.#competitionDate(this.parent),
                        margin: [0, 15, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `г. ${this.parent?.city.name}, ${this.parent?.city?.region?.name}`,
                        alignment: "right",
                        margin: [0, 15, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                text: "СПРАВКА О СОСТАВЕ И КВАЛИФИКАЦИИ",
                fontSize: 18,
                bold:true,
                alignment: "center",
                margin: [0, 30, 0, 0],
            },
            {
                text: "ГЛАВНОЙ СУДЕЙСКОЙ КОЛЛЕГИИ",
                fontSize: 18,
                bold:true,
                alignment: "center",
                margin: [0, 0, 0, 15],
            },
            {
                table:{
                    width:['auto','*'],
                    body: this.dataSource.items.map( (item, index) => [
                        item.position.name, `${item.category.name} ${item.lastName} ${item.firstName} ${item.middleName} (${item?.city?.name}, ${item?.city?.region?.name})`
                        // ['Первая ячейка второй строки','Вторая ячейка второй строки'],
                        // [{text:'текстовое содержимое',bold:true},'Текст']
                    ]),
                    headerRows:1
                },
            },
            {
                columns: [
                    {
                        width: 300,
                        text: mainReferee?.position.name,
                        margin: [20, 40, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `${mainReferee?.firstName[0]}.${mainReferee?.middleName[0]}. ${mainReferee?.lastName}`,
                        alignment: "left",
                        margin: [0, 40, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                columns: [

                    {
                        width: 300,
                        text: mainReferee?.category.name,
                        margin: [20, 0, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `(г. ${mainReferee?.city?.name}, ${mainReferee?.city?.region?.name})`,
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                columns: [

                    {
                        width: 300,
                        text: mainSecretary?.position.name,
                        margin: [20, 50, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `${mainSecretary?.firstName[0]}.${mainSecretary?.middleName[0]}. ${mainSecretary?.lastName}`,
                        alignment: "left",
                        margin: [0, 50, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
            {
                columns: [

                    {
                        width: 300,
                        text: mainSecretary?.category.name,
                        margin: [20, 0, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: `(г. ${mainSecretary?.city?.name}, ${mainSecretary?.city?.region?.name})`,
                        alignment: "left",
                        margin: [0, 0, 0, 0],
                        fontSize: 12,
                    },
                ],
                columnGap: 20
            },
          ],

          styles: {
            header0:{
            }
          }
        };

        pdfMake.createPdf(docInfo).open();
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
        return this.#page1()
    }

    #page1() {
        return html`
            <my-competition-section-5-page-1 .parent=${this.parent} .oldValues=${this.oldValues} .item=${this.currentItem}></my-competition-section-5-page-1>
        `;
    }

    #page2() {
        return html`
            <my-competition-section-5-page-1 .item=${this.currentItem}></my-competition-section-5-page-1>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
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
                label=${ this.fio(this.currentItem) || "Новый судья" }
                title=''
                icon-name=${ this.currentItem?.gender == 0 ? "referee-man-solid" : "referee-woman-solid" }
                ?selected=${ true }
                .status=${{ name: this.currentItem?.refereeId || this.currentItem?.refereeUlid || "referee:new", icon: 'id-number-solid'} }
            >
            </icon-button>
        `
    }

    #list1() {
        return html`
            <my-competition-section-5-list-1 .item=${this} .status=${this.status}></my-competition-section-5-list-1>
        `;
    }

    #list3() {
        return html`
            <my-competition-section-5-list-1 .parent=${this.currentItem}></my-competition-section-5-list-3>
        `;
    }

    get #list() {
        switch(this.currentPage) {
            case 0: return cache(this.#list1())
            case 1: return cache(this.#list1())
            default: return cache(this.#list3())
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

    get #addItemFooter() {
        return html`
            <nav>
                <simple-button @click=${this.addNewItem}>${lang`Add`}</simple-button>
                <simple-button @click=${this.deleteItem}>${lang`Delete`}</simple-button>
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

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        if (!this.dataSource?.items) {
            return ''
        }
        if (this.isModified) {
            return html`
                <nav class='save'>
                    <simple-button @click=${this.saveItem}>${lang`Save`}</simple-button>
                    <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
                </nav>
            `
        }
        return html`
            <nav class="buttons">
                <aside-button icon-name=${"verified-status-solid"} title=${'Принять'} @click=${this.verified}></aside-button>
                <aside-button icon-name=${"clock-status-solid"} title=${'Отложить'} @click=${this.clock}></aside-button>
                <aside-button icon-name=${"add-status-solid"} title=${'Создать'} @click=${this.add}></aside-button>
                <aside-button icon-name=${"reject-status-solid"} title=${'Отклонить'} @click=${this.reject}></aside-button>
                <aside-button icon-name=${"accept-status-solid"} title=${'Завершить'} @click=${this.accept}></aside-button>
            </nav>
        `
        // if (this.dataSource.items.length) {
        //     if (this.dataSource.state === States.NEW) {
        //         return this.#newItemFooter
        //     }
        //     if (this.isModified) {
        //         return this.#itemFooter
        //     }
        //     return this.#addItemFooter
        // }
        // if (this.dataSource.state === States.NEW) {
        //     return this.#newItemFooter
        // }
        // if (this.isModified) {
        //     return this.#firstItemFooter
        // }
        return ''
    }

    async verified() {
        const modalResult = await this.confirmDialog('Вы действительно хотите рассмотреть эту заявку?')
        if (modalResult !== 'Ok')
            return
        this.currentItem.status = { name: 'Рассматривается' }
        try {
            await this.saveItem()
        } catch (error) {
            await this.errorDialog(error)
            return
        }
        await this.showDialog('Заявка успешно принята к рассмотрению')
        this.status = this.currentItem.status
    }

    async clock() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отложить эту заявку?')
        if (modalResult !== 'Ok')
            return
        this.currentItem.status = { name: 'Отложено' }
        try {
            await this.saveItem()
        } catch (error) {
            await this.errorDialog(error)
            return
        }
        await this.showDialog('Заявка успешно отложена')
        this.status = this.currentItem.status
    }

    async reject() {
        const modalResult = await this.confirmDialog('Вы действительно хотите отклонить эту заявку?')
        if (modalResult !== 'Ok')
            return
        this.currentItem.status = { name: 'Отклонено' }
        try {
            await this.saveItem()
        } catch (error) {
            await this.errorDialog(error)
            return
        }
        await this.showDialog('Заявка успешно отклонена')
        this.status = this.currentItem.status
    }

    async accept() {
        const modalResult = await this.confirmDialog('Вы действительно хотите завершить эту заявку?')
        if (modalResult !== 'Ok')
            return
        this.currentItem.status = { name: 'Завершено' }
        try {
            await this.saveItem()
        } catch (error) {
            await this.errorDialog(error)
            return
        }
        await this.showDialog('Заявка успешно завершена')
        this.status = this.currentItem.status
    }

    async add() {
        let modalResult = await this.confirmDialog('Вы действительно хотите зарегистрировать этого спортсмена на это соревнование?')
        if (modalResult !== 'Ok')
            return
        const newSportsman = Object.assign({}, this.currentItem.payload)
        newSportsman.sportsmanId = this.currentItem.sportsman._id
        CompetitionSportsmenDataSet.addItem(newSportsman)
        modalResult = await this.confirmDialog('Спортсмен успешно зарегистрирован на соревновании. Завершить заявку?')
        if (modalResult === 'Ok')
            this.accept()
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Requests`}</p>
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

    addFirstItem() {
        const page = this.renderRoot.querySelector('my-sportsmen-section-5-page-1')
        page.startEdit()
    }

    gotoSection(index) {
        this.parentNode.host.currentSection = index;
    }

    gotoPage(index) {
        this.currentPage = index
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

    async errorDialog(message) {
        return this.showDialog(message, 'error', 'Ошибка')
    }

    async addNewItem() {
        this.dataSource.addNewItem(this.currentItem);
        // const page = this.renderRoot.querySelector('my-sportsmen-section-5-page-1')
        // page.startEdit()
    }


    async addItem() {
        this.dataSource.addItem(this.currentItem);
    }

    saveFirstItem() {
        this.dataSource.addItem(this.currentItem);
        this.oldValues?.clear();
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
        // if (this.avatarFile) {
        //     let result = await DataSet.uploadAvatar(this.avatarFile, this.currentItem._id);
        //     if (!result) return;
        // }
        // this.avatarFile = null;
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
                const currentItem = key.currentObject ?? this.currentItem
                currentItem[key.id] = value;
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

    async firstUpdated() {
        super.firstUpdated()
        const parentId = sessionStorage.getItem('competition').split(':')[1]
        this.competitionDataSource = new CompetitionDataSource(this)
        this.parent = await this.competitionDataSource.getItem()
        this.dataSource = new DataSource(this, await DataSet.getDataSet(parentId))
        this.competitionSportsmenDataSet = await CompetitionSportsmenDataSet.getDataSet(parentId)
    }
}

customElements.define("my-competition-section-5", MyCompetitionSection5);