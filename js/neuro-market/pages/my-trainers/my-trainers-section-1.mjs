import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/modal-dialog.mjs'
import '../../../../components/buttons/icon-button.mjs'
import '../../../../components/buttons/aside-button.mjs'
import '../../../../components/buttons/simple-button.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import { isAuth, States } from '../../../utils.js'

import './my-trainers-section-1-page-1.mjs'

import DataSet from './my-trainers-dataset.mjs'
import DataSource from './my-trainers-datasource.mjs'

class MyTrainersSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            isModified: { type: Boolean, default:  "", local: true },
            sortDirection: { type: Boolean, default: true },
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            currentFilter: { type: Object, default: {} },
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
                        font-weight: 700;
                    }
                }

                .right-header {
                    grid-area: header2;
                    display: flex;
                    justify-content: space-between;
                    .left-aside {
                        height: 100%;
                        icon-button {
                            height: 100%;
                            padding: 0 1vw;
                            /* --icon-height: 100%; */
                            &[active] {
                                background-color: var(--layout-background-color);
                                font-weight: bold;
                            }
                            &:hover {
                                background-color: var(--layout-background-color);
                                &:only-of-type {
                                    background-color: inherit;
                                }
                            }
                            &:first-of-type {
                                padding-left: 0;
                                font-weight: 700;
                            }
                        }
                    }
                    .right-aside {
                        display: flex;
                        justify-content: right;
                        align-items: center;
                        height: 100%;
                        padding-right: 10px;
                    }
                }

                .left-layout {
                    grid-area: sidebar;
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
                    grid-area: content;
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
        this.pageNames = [lang`Information`]
        this.oldValues = new Map();
        this.buttons = [
            {iconName: 'qr-code-solid', page: 'my-sportsmen', title: lang`QR code`, click: () => this.getQRCode()},
            {iconName: 'no-avatar', page: 'my-sportsmen', title: lang`Personal page`, click: () => this.gotoPersonalPage()},
            {iconName: 'excel-import-solid', page: 'my-trainers', title: lang`Export to Excel`, click: () => this.ExportToExcel()},
            {iconName: 'arrow-up-from-bracket-sharp-solid', page: 'my-trainers', title: lang`Import from Excel`, click: () => this.ExcelFile()},
            {iconName: 'pdf-make',  page: 'my-trainer-categories', title: lang`Make in PDF`, click: () => this.pdfMethod()},
            {iconName: 'arrow-left-solid', page: 'my-trainer-categories', title: lang`Back`, click: () => this.gotoBack()},
        ]
    }

    pdfMethod() {
        var docInfo = {
          info: {
            title: "Trainers",
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
                text: "I-ый этап КУБКА РОССИИ — 2023",
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
                text: "3-борье с лыжной гонкой",
                fontSize: 18,
                bold:true,
                alignment: "center",
            },
              {
                  columns: [

                      {
                          width: 'auto',
                          text: '12-15 января 2023 года',
                          margin: [0, 15, 0, 0],
                          fontSize: 12,
                      },
                      {
                          width: '*',
                          text: 'г.Ковров, Владимирская обл.',
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
                    widths:['auto','*'],

                    body:[
                        ['Первая ячейка первой строки','Вторая ячейка первой строки'],
                        ['Первая ячейка второй строки','Вторая ячейка второй строки'],
                        [{text:'текстовое содержимое',bold:true},'Текст']
                    ],
                    headerRows:1
                },
            },
            {
                columns: [

                    {
                        width: 300,
                        text: 'Главный судья,',
                        margin: [20, 40, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: 'Д.В.Ерёмкин',
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
                        text: 'судья всероссийской категории',
                        margin: [20, 0, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: '(г.Ковров, Владимирская обл.)',
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
                        text: 'Главный секретарь,',
                        margin: [20, 50, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: 'Е.В.Ерёмкина',
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
                        text: 'судья всероссийской категории',
                        margin: [20, 0, 0, 0],
                        fontSize: 12,
                    },
                    {
                        width: '*',
                        text: '(г.Ковров, Владимирская обл.)',
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

    ExcelFile() {
        this.renderRoot.getElementById("fileInput").click();
    }

    async exportToExcel(e) {
        const modalResult = await this.showDialog('Вы действительно хотите экспортировать всех тренеров в файл Excel?', 'confirm')
        if (modalResult === 'Ok') {
            const raw_data = await this.dataSource.items
            const rows = raw_data.map(row => ({
                lastName: row.lastName,
                firstName: row.firstName,
                middleName: row.middleName,
                category: row.category?.shortName,
                region: row.region?.name,
                city: row.city?.name,
                trainerPC: row.trainerPC,
                orderNumber: row.order?.number,
                link: row.link,
                orderLink: row.order?.link,
                gender: row.gender,
            })).sort((l, r) => {
                let a = l.lastName?.localeCompare(r.lastName)
                if (a) {
                    return a
                }
                a = l.firstName?.localeCompare(r.firstName)
                if (a) {
                    return a
                }
                a = l.middleName?.localeCompare(r.middleName)
                if (a) {
                    return a
                }
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Тренеры");

            /* fix headers */
            XLSX.utils.sheet_add_aoa(worksheet, [[
                "Фамилия",
                "Имя",
                "Отчество",
                "Разряд",
                "Регион",
                "Населенный пункт",
                "Персональный код тренера",
                "Дата приказа",
                "Персональная ссылка",
                "Ссылка на приказ",
                "Пол",
            ]], { origin: "A1" });

            /* calculate column width */
            const max_width_1 = rows.reduce((w, r) => Math.max(w, r.lastName?.length), 10);
            const max_width_2 = rows.reduce((w, r) => r.firstName?.length ? Math.max(w, r.firstName?.length) : w, 10);
            const max_width_3 = rows.reduce((w, r) => r.middleName?.length ? Math.max(w, r.middleName?.length) : w, 10);
            const max_width_4 = rows.reduce((w, r) => r.category?.length ? Math.max(w, r.category?.length) : w, 6);
            const max_width_5 = rows.reduce((w, r) => r.region?.length ? Math.max(w, r.region?.length) : w, 10);

            const LightBlue = {
                fgColor: { rgb: "BDD7EE" }
            };

            worksheet["!cols"] = [ { wch: max_width_1 },  { wch: max_width_2 }, { wch: max_width_3 }, { wch: max_width_4 }, { wch: max_width_5 }, ];

            XLSX.writeFile(workbook, "Trainers.xlsx", { compression: true });
        }
    }

    async importFromExcel(e) {
        const file = e.target.files[0];
        const workbook = XLSX.read(await file.arrayBuffer());
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
        const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
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
                    region: regionDataset.find("name", r[3]),
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

    async refresh() {
        const raw_data = await DataSet.getDataSet()
        const CityDataset = await import('../my-cities/my-cities-dataset.mjs');
        const cityDataset = CityDataset.default;
        const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
        const regionDataset = RegionDataset.default;
        const CategoryDataset = await import('../my-trainer-categories/my-trainer-categories-dataset.mjs');
        const categoryDataset = CategoryDataset.default;
        const promises = Array()
        raw_data.forEach(item => {
            let save = false
            if (item.region) {
                const region = regionDataset.find("_id", item.region?._id)
                if (region) {
                    if (item.region?._rev !== region._rev) {
                        item.region = region
                        save = true
                    }
                }
            }
            if (item.city) {
                const city = cityDataset.find("_id", item.city?._id)
                if (city) {
                    if (item.city?._rev !== city._rev) {
                        item.city = city
                        save = true
                    }
                }
            }
            if (item.category) {
                const category = categoryDataset.find("_id", item.category?._id)
                if (category) {
                    if (item.category?._rev !== category._rev) {
                        item.category = category
                        save = true
                    }
                }
            }
            if (save) {
                promises.push(this.dataSource.saveItem(item))
            }
        })
        try {
            await Promise.allSettled(promises)
            this.showDialog('Все данные были успешно обновлены!')
        } catch(e) {
            this.showDialog('Не все данные успешно обновлены')
        }
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentTrainerItem')) {
            this.currentPage = 0;
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
    }

    async showItem(item) {
        if (this.currentPage == 1) {
            this.currentPage = 0
        }
        if (this.currentItem?._id === item._id) {
            this.copyToClipboard(item.id || item._id)
            return
        }
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
            this.dataSource.setCurrentItem(item)
        }
    }

    get #page() {
        return cache(this.currentPage === 0 ? this.#page1() : this.#page2());
    }

    #page1() {
        return html`
            <my-trainers-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-trainers-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-trainers-section-1-page-2 .item=${this.currentItem}></my-trainers-section-1-page-2>
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

    get #list() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `<icon-button
                        label=${this.fio(item)}
                        title=${item._id}
                        image-name=${ item.gender == 0 ? "images/trainer-man-solid.svg" : "images/trainer-woman-solid.svg" }
                        ?selected=${this.currentItem === item}
                        .status=${ { name: item.category?.name || item?._id, icon: 'trainer-category-solid'} }
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    get #task() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
        `
    }

    cancelFind() {
        this.currentPage = 0
    }

    find() {
        // alert(JSON.stringify(this.dataSource.findIndex(this.currentFilter)))
        const result = this.dataSource.find(this.currentFilter)
        this.currentPage = 0
        this.dataSource.setCurrentItem(result)
    }

    get #findFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.find}>${lang`Find`}</simple-button>
                <simple-button @click=${this.cancelFind}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #rightFooter() {
        if (this.currentPage === 1) {
            return this.#findFooter
        }
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
                <nav>
                    <simple-button @click=${this.addItem}>${lang`Add`}</simple-button>
                    <simple-button @click=${this.deleteItem}>${lang`Delete`}</simple-button>
                </nav>
            `
        }

    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Trainers` + ' ('+ this.dataSource?.items?.length +')'}<p>
                <aside-button icon-name=${ this.sortDirection ? "arrow-up-a-z-regular" : "arrow-up-z-a-regular"} @click=${this.sortPage}></aside-button>
                <aside-button icon-name="filter-regular" @click=${this.filterPage}></aside-button>
            </header>
            <header class="right-header">
                <div class="left-aside">
                    ${this.sections.map( (section, index) =>
                        html `
                            <icon-button ?active=${index === this.currentSection && this.sections.length !== 1} icon-name=${(this.currentItem?.gender == 0 ? "trainer-man-solid" : "trainer-woman-solid") || section.iconName || nothing} label=${section.label} @click=${() => this.gotoSection(index)}></icon-button>
                        `
                    )}
                </div>
                <div class="right-aside">
                    <aside-button icon-name="search-regular" @click=${this.searchPage}></aside-button>
                </div>
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

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    searchPage() {
        this.currentFilter = {}
        this.currentPage = this.currentPage === 1 ? 0 : 1
    }

    sortPage() {
        this.sortDirection = !this.sortDirection
        this.dataSource.sort(this.sortDirection)
    }

    filterPage() {

    }

    async saveToFile(blob, fileName) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'trainer-qr.svg');
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
        const dataURI = await DataSet.getQRCode(location.origin+`/system?trainer=${this.currentItem._id.split(':')[1]}#my-trainer`)
        const blob = await (await fetch(dataURI)).blob();
        await this.saveToFile(blob, this.fio(this.currentItem).slice(0,-1))
        window.open(URL.createObjectURL(blob))
    }

    gotoPersonalPage() {
        location.hash = "#my-trainer";
        location.search = `?trainer=${this.currentItem._id.split(':')[1]}`
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
        const newItem = { name: "Новый регион" }
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
            let id = key.id
            let currentItem = this.currentItem
            if (id == "order.number") {
                id = "number"
                currentItem = this.currentItem.order
            }
            if (id == "order.link") {
                id = "link"
                currentItem = this.currentItem.order
            }
            currentItem[id] = value;
            key.value = value;
        });
        this.oldValues.clear();
        this.isModified = false;
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить этого тренера?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
    }
}

customElements.define("my-trainers-section-1", MyTrainersSection1)