import { BaseElement, html, css, cache, nothing } from '../../../base-element.mjs'

import '../../../../components/dialogs/modal-dialog.mjs'
import '../../../../components/buttons/icon-button.mjs'
import '../../../../components/buttons/aside-button.mjs'
import '../../../../components/buttons/simple-button.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import { isAuth, States } from '../../../utils.js'

import './my-sportsmen-section-1-page-1.mjs'
import './my-sportsmen-section-1-page-2.mjs'
import './my-sportsmen-section-1-page-3.mjs'

import DataSet from './my-sportsmen-dataset.mjs'
import DataSource from './my-sportsmen-datasource.mjs'

class MySportsmenSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            statusDataSet: { type: Map, default: null },
            oldValues: { type: Map, default: null },
            currentItem: { type: Object, default: null },
            listItem: { type: Object, default: null },
            listStart: { type: BigInt, default: 0},
            listEnd: { type: BigInt, default: 0},
            listEnd1: { type: String, default: ''},
            isModified: { type: Boolean, default: false, local: true },
            sortDirection: { type: Boolean, default: true},
            isReady: { type: Boolean, default: true },
            // isValidate: {type: Boolean, default: false, local: true},
            itemStatus: { type: Object, default: null, local: true },
            currentPage: { type: BigInt, default: 0 },
            currentFilter: { type: Object, default: {} },
            currentSearch: { type: Object, default: {} },
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
                            --icon-height: 100%;
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
        this.pageNames = [lang`Information`, lang`Search`]
        this.oldValues = new Map();
        this.pages = [
            {iconName: 'sportsman-solid', page: () => this.#page1(), title: lang`Sportsman`, click: () => this.gotoPage(0)},
            {iconName: 'search-regular', page: () => this.#page2(), title: lang`Search`, click: () => this.gotoPage(1)},
            {iconName: 'filter-regular', page: () => this.#page3(), title: lang`Filter`, click: () => this.gotoPage(2)},
        ]
        this.buttons = [
            {iconName: 'qr-code-solid', page: 'my-sportsmen', title: lang`QR code`, click: () => this.getQRCode()},
            {iconName: 'no-avatar', page: 'my-sportsmen', title: lang`Personal page`, click: () => this.gotoPersonalPage()},
            {iconName: 'excel-import-solid', page: 'my-sportsmen', title: lang`Export to Excel`, click: () => this.exportToExcel()},
            {iconName: 'arrow-up-from-bracket-sharp-solid', page: 'my-sportsmen', title: lang`Import from Excel`, click: this.ExcelFile},
            {iconName: 'arrow-rotate-right-solid', page: 'my-sportsmen', title: lang`Refresh`, click: () => this.refresh()},
            {iconName: 'arrow-left-solid', page: 'my-sportsmen', title: lang`Back`, click: () => this.gotoBack()},
        ]
    }

    showPage(page) {
        location.hash = page;
    }

    gotoBack(page) {
        history.back();
    }

    changeStart() {
        this.listStart++;
        this.listEnd--;
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

    async saveToFile(blob, fileName) {
        if (window.navigator && window.navigator.msSaveOrOpenBlob) {
            window.navigator.msSaveOrOpenBlob(blob, 'sportsman-qr.svg');
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
        const dataURI = await DataSet.getQRCode(location.origin+`/system?sportsman=${this.currentItem._id.split(':')[1]}#my-sportsman`)
        const blob = await (await fetch(dataURI)).blob();
        await this.saveToFile(blob, this.fio(this.currentItem).slice(0,-1))
        window.open(URL.createObjectURL(blob))
    }

    gotoPersonalPage() {
        location.hash = "#my-sportsman";
        location.search = `?sportsman=${this.currentItem._id.split(':')[1]}`
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
        const modalResult = await this.showDialog('Вы действительно хотите экспортировать всех спортсменов в Excel?', 'confirm')
        if (modalResult === 'Ok') {
            const raw_data = await DataSet.getAllItems()
            const rows = raw_data.map(row => ({
                lastName: row.doc.lastName,
                firstName: row.doc.firstName,
                middleName: row.doc.middleName,
                category: row.doc.category?.shortName,
                birthday: row.doc.birthday,
                region: row.doc.region?.name,
                club: row.doc.club?.name,
                sportsmanPC: row.doc.sportsmanPC,
                orderNumber: row.doc.order?.number,
                link: row.doc.link,
                orderLink: row.doc.order?.link,
                gender: row.doc.gender,
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
                a = l.birthday?.localeCompare(r.birthday)
                if (a) {
                    return a
                }
                return 0
            });

            /* generate worksheet and workbook */
            const worksheet = XLSX.utils.json_to_sheet(rows);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Спортсмены");

            /* fix headers */
            XLSX.utils.sheet_add_aoa(worksheet, [[
                "Фамилия",
                "Имя",
                "Отчество",
                "Разряд",
                "Дата рождения",
                "Регион",
                "Клуб",
                "ID Спортсмена",
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
            const max_width_5 = rows.reduce((w, r) => r.birthday?.length ? Math.max(w, r.birthday?.length) : w, 10);
            const max_width_6 = rows.reduce((w, r) => r.region?.length ? Math.max(w, r.region?.length) : w, 10);

            const LightBlue = {
                fgColor: { rgb: "BDD7EE" }
            };

            // const alignmentCenter = { horizontal: "center", vertical: "center", wrapText: true };

            // const ThinBorder = {
            //     top: { style: "thin" },
            //     bottom: { style: "thin" },
            //     left: { style: "thin" },
            //     right: { style: "thin" }
            // };

            // const fillAlignmentBorder = {
            //     fill: LightBlue,
            //     alignment: alignmentCenter,
            //     border: ThinBorder
            // };

            // worksheet["A1"].s = fillAlignmentBorder;

            worksheet["!cols"] = [ { wch: max_width_1 },  { wch: max_width_2 }, { wch: max_width_3 }, { wch: max_width_4 }, { wch: max_width_5 }, { wch: max_width_6 },];

            /* create an XLSX file and try to save to Presidents.xlsx */
            XLSX.writeFile(workbook, "Sportsmen.xlsx", { compression: true });
        }
    }

    async refresh() {
        const raw_data = await DataSet.getAllItems()
        const ClubDataset = await import('../my-clubs/my-clubs-dataset.mjs');
        const clubDataset = ClubDataset.default;
        const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
        const regionDataset = RegionDataset.default;
        const CategoryDataset = await import('../my-sports-categories/my-sports-categories-dataset.mjs');
        const categoryDataset = CategoryDataset.default;
        const promises = Array()
        raw_data.forEach(item => {
            let save = false
            if (item.doc.club) {
                const club = clubDataset.find("_id", item.doc.club?._id)
                if (club) {
                    if (item.doc.club?._rev !== club._rev) {
                        item.doc.club = club
                        save = true
                    }
                }
            }
            if (item.doc.region) {
                const region = regionDataset.find("_id", item.doc.region?._id)
                if (club) {
                    if (item.doc.region?._rev !== region._rev) {
                        item.doc.region = region
                        save = true
                    }
                }
            }
            if (item.doc.category) {
                const category = categoryDataset.find("_id", item.doc.category?._id)
                if (club) {
                    if (item.doc.category?._rev !== category._rev) {
                        item.doc.category = category
                        save = true
                    }
                }
            }
            if (save) {
                promises.push(this.dataSource.saveItem2(item.doc))
            }
        })
        try {
            await Promise.allSettled(promises)
            this.showDialog('Все данные были успешно обновлены!')
        } catch(e) {
            this.showDialog('Не все данные успешно обновлены')
        }
    }
    // regionRefresh
    // async refresh() {
    //     const raw_data = await DataSet.getAllItems()
    //     const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
    //     const regionDataset = RegionDataset.default;
    //     const promises = Array()
    //     raw_data.forEach(item => {
    //         if (!item.doc.region?._id) {
    //             console.log(item.doc)
    //         }
    //         const region = regionDataset.find("_id", item.doc.region?._id)
    //         if (region) {
    //            // this.dataSource.addItem(newItem);
    //             if (item.doc.region?._rev !== region._rev) {
    //                 item.doc.region = region
    //                 promises.push(this.dataSource.saveItem2(item.doc))
    //             }
    //         }
    //     })
    //     try {
    //         await Promise.allSettled(promises)
    //         this.showDialog('Все данные были успешно обновлены!')
    //     } catch(e) {
    //         this.showDialog('Не все данные успешно обновлены')
    //     }
    // }

    async importFromExcel(e) {
        const file = e.target.files[0];
        const modalResult = await this.showDialog('Вы действительно хотите экспортировать данные из файла?', 'confirm')
        if (modalResult === 'Ok') {
            const workbook = XLSX.read(await file.arrayBuffer());
            const worksheet = workbook.Sheets[workbook.SheetNames[2]];
            const raw_data = XLSX.utils.sheet_to_json(worksheet, {header:1});
            const RegionDataset = await import('../my-regions/my-regions-dataset.mjs');
            const regionDataset = RegionDataset.default;
            const SportsCategoryDataset = await import('../my-sports-categories/my-sports-categories-dataset.mjs');
            const sportsCategoryDataset = SportsCategoryDataset.default;
            this.dataSource.lock();
            const promises = new Array(raw_data.length)
            raw_data.forEach((r, index) => {
                try {
                if(index !== 0){
                    const newItem = {
                        lastName: r[1].split(' ')[0].toLowerCase()[0].toUpperCase() + r[1].split(' ')[0].toLowerCase().slice(1),
                        firstName: r[1].split(' ')[1],
                        middleName: r[1].split(' ')[2],
                        gender: r[10],
                        category: sportsCategoryDataset.find("shortName", r[2]),
                        region: regionDataset.find("name", r[3]) ?? null,
                        order: {
                            number: r[4],
                            link: r[6]
                        },
                        link: r[5],

                    }
                    promises[index] = this.dataSource.addItem(newItem);
                }
                }
                catch(e) {
                    console.log(index, r)
                }
            });
            try {
                await Promise.allSettled(promises)
                this.showDialog('Все данные были успешно импортированы!')
            } catch(e) {
                this.showDialog('Не все данные успешно импортированы')
            }
            this.dataSource.unlock();
        }
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('itemStatus') && this.itemStatus) {
            this.statusDataSet.set(this.itemStatus._id, this.itemStatus)
            this.requestUpdate()
        }
        if (changedProps.has('currentSportsmanItem')) {
            this.currentPage = 0;
        }
    }

    copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text)
        }
    }

    async showItem(item) {
        if (this.currentPage != 0) {
            this.currentPage = 0
        }
        if (this.currentItem?._id === item.id) {
            this.copyToClipboard(item.value.sportsmanId || item.id)
            return
        }
        if (this.isModified) {
            const modalResult = await this.confirmDialog('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.dataSource.saveItem(this.currentItem, item);
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
        return this.pages[this.currentPage].page();
    }

    #page1() {
        return html`
            <my-sportsmen-section-1-page-1 .oldValues=${this.oldValues} .item=${this.currentItem}></my-sportsmen-section-1-page-1>
        `;
    }

    #page2() {
        return html`
            <my-sportsmen-section-1-page-2 .item=${this.currentSearch}></my-sportsmen-section-1-page-2>
        `;
    }

    #page3() {
        return html`
            <my-sportsmen-section-1-page-3 .item=${this.currentFilter}></my-sportsmen-section-1-page-3>
        `;
    }

    get #pageName() {
        return this.pageNames[this.currentPage];
    }

    newRecord() {
        return html `<icon-button
                label=${ this.listItem.key }
                title=${ this.listItem.id }
                icon-name=${ this.listItem.value?.gender == 0 ? "sportsman-man-solid" : "sportsman-woman-solid" }
                ?selected=${ this.currentItem?._id === this.listItem?.id }
                .status=${{ name: this.listItem.value?.hashNumber, icon: 'id-number-solid'} }
            >
            </icon-button>
        `
    }

    listStart = 0
    listEnd = 0
    itemTemplates = new Array(20)

    //icon-name=${ item.value?.gender == 0 ? "sportsman-man-solid" : "sportsman-woman-solid" }
    makeList() {
        if (!this.dataSource?.items || this.dataSource?.items.length === 0)
            return;
        const size = this.dataSource?.items.length < 20 ? this.dataSource?.items.length : 20
        for( let i = 0; i < size; i++) {
            if (i < this.dataSource?.items.length) {
                const item = this.dataSource?.items[this.listStart + i]
                this.itemTemplates[i] =
                    html `<icon-button
                        label=${ item.key + (item.value?.category ? ' (' + item.value?.category + ')' : '')}
                        title=${ item.id }
                        image-name=${ item.value?.gender == 0 ? "images/sportsman-man-solid.svg" : "images/sportsman-woman-solid.svg" }
                        ?selected=${ this.currentItem?._id === item.id }
                        .status=${{ name: item.value?.sportsmanId || item?.id, icon: 'id-number-solid'} }
                        @click=${() => this.showItem(item)}
                    >
                    </icon-button>
                `
            }
        }
        return this.itemTemplates
    }

    get #simpleList() {
        return html`
            ${this.dataSource?.items?.map((item, index) =>
                html `<icon-button
                        label=${ item.key + (item.value?.category ? ' (' + item.value?.category + ')' : '')}
                        title=${item.id}
                        image-name=${ item.value?.gender == 0 ? "images/sportsman-man-solid.svg" : "images/sportsman-woman-solid.svg" }
                        ?selected=${ this.currentItem?._id === item.id }
                        .status=${ { name: item.value?.sportsmanId || item?.id, icon: 'id-number-solid'} }
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    listTopHeight() {
        return this.listStart*40;
    }
    listBottomHeight() {
        // if (this.dataSource?.items?.length) {
        //     console.log(this.dataSource?.items?.length - 20 - this.listStart)
        // return (this.dataSource?.items?.length - 20 - this.listStart )*40 +'px';
        // }
        return this.listEnd*40
    }
    // .status=${ item.hashNumber ? { name: item.hashNumber, icon: 'id-number-solid'} : '' }
    get #list() {
        // console.log(this.listTopHeight(),this.listBottomHeight(), this.listTopHeight() + this.listBottomHeight())
        // return html`
        //     <div style="min-height: ${this.listStart*40 + 'px'}" data-a=${this.listStart}> </div>
        //     ${this.makeList()}
        //     <div style="min-height: ${this.listEnd*40 + 'px'}"> </div>
        // `
        if (this.dataSource?.items?.length < 20 )
            return this.#simpleList
        return html`
            <div style="min-height: ${this.listStart*40 + 'px'}" data-a=${this.listEnd1}> </div>
            ${this.makeList()}
            <div style="min-height: ${this.listEnd*40 + 'px'}"> </div>
        `
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
            <nav class='save'>
                <simple-button @click=${this.saveFirstItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #newItemFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.saveNewItem}>${lang`Save`}</simple-button>
                <simple-button @click=${this.cancelNewItem}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #itemFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.isModified ? this.saveItem: this.addNewItem}>${this.isModified ? lang`Save`: lang`Add`}</simple-button>
                <simple-button @click=${this.isModified ? this.cancelItem: this.deleteItem}>${this.isModified ? lang`Cancel`: lang`Delete`}</simple-button>
            </nav>
        `
    }

    cancelFind() {
        this.currentPage = 0
    }

    find() {
        // alert(JSON.stringify(this.dataSource.findIndex(this.currentSearch)))
        const result = this.dataSource.find(this.currentSearch)
        this.currentPage = 0
        this.dataSource.setCurrentItem(result)
    }

    async filter() {
        // alert(JSON.stringify(this.dataSource.findIndex(this.currentSearch)))
        const result = await this.dataSource.filter(this.currentFilter)
        this.currentPage = 0
        this.requestUpdate()
        this.dataSource.setCurrentItem(result)
    }

    async clearFilter() {
        const result = await this.dataSource.clearFilter()
        this.currentPage = 0
        this.dataSource.setCurrentItem(this.listItem || result)
        this.requestUpdate()
    }

    get #findFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.find}>${lang`Find`}</simple-button>
                <simple-button @click=${this.cancelFind}>${lang`Cancel`}</simple-button>
            </nav>
        `
    }

    get #filterFooter() {
        return html`
            <nav class='save'>
                <simple-button @click=${this.filter}>${lang`To filter`}</simple-button>
                <simple-button @click=${this.clearFilter}>${lang`Clear`}</simple-button>
            </nav>
        `
    }

    get #rightFooter() {
        if (!isAuth()) {
            return ''
        }
        if (!this.dataSource?.items)
            return ''
        if (this.currentPage === 1) {
            return this.#findFooter
        }
        if (this.currentPage === 2) {
            return this.#filterFooter
        }
        if (this.dataSource.items.length) {
            if (this.dataSource.state === States.NEW) {
                return this.#newItemFooter
            } else {
                return this.#itemFooter
            }

        } else  if (this.dataSource.state === States.NEW) {
            return this.#newItemFooter
        } else if (this.isModified) {
            return this.#firstItemFooter
        } else {
            return html`
                <simple-button @click=${this.addNewItem}>${lang`Add`}</simple-button>
            `
        }
    }

    listScroll(e) {
        const old = this.listStart
        this.listStart = Math.floor(e.target.scrollTop/40);
        // console.log(this.$id("a1"))
        // console.log(this.$id("a2"))
        if (this.listStart > this.dataSource?.items?.length - 20) {
            this.listStart = this.dataSource?.items?.length - 20
        }
        if (old !== this.listStart) {
            e.target.scrollTop = e.target.scrollTop - (this.listStart-old)*40;
        }
        this.listEnd = this.dataSource?.items?.length - 20 - this.listStart
        this.listEnd1 = this.listEnd.toString()
        //console.log(this.listStart, this.listEnd, this.listStart + this.listEnd)
        // this.listEnd = this.listStart + 20;
        //this.requestUpdate()
    }
    // <!-- ${this.#list} -->

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <header class="left-header">
                <p>${lang`Sportsmen` + (this.dataSource?.items?.length ? ' ('+ this.dataSource?.items?.length +')' : '')}</p>
                <p>
                    <aside-button icon-name=${ this.sortDirection ? "arrow-up-a-z-regular" : "arrow-up-z-a-regular"} @click=${this.sortPage}></aside-button>
                    <aside-button icon-name="filter-regular" @click=${this.filterPage}></aside-button>
                </p>
            </header>
            <header class="right-header">
                <div class="left-aside">
                    ${this.sections.map( (section, index) =>
                        html `
                            <icon-button ?active=${index === this.currentSection && this.sections.length !== 1} icon-name=${(this.currentItem?.gender == 0 ? "sportsman-solid" : "sportswoman-solid") || section.iconName || nothing} label=${this.pages[this.currentPage].title} @click=${() => this.gotoSection(index)}></icon-button>
                        `
                    )}
                </div>
                <div class="right-aside">
                    <aside-button icon-name="search-regular" @click=${this.searchPage}></aside-button>
                </div>
            </header>
            <div class="left-layout" @scroll=${this.listScroll} a=${this.listStart}>
                ${this.dataSource?.state === States.NEW ? this.newRecord() : ''}
                <!-- <div id="a1" style="min-height: ${this.listStart*40 + 'px'}" .data-a=${this.listEnd1}> </div>
                ${this.makeList()}
                <div id="a2" style="min-height: ${this.listEnd*40 + 'px'}"> </div> -->
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
        const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        page.startEdit()
    }

    gotoSection(index) {
        this.parentNode.host.currentSection = index;
    }

    nextPage() {
        this.currentPage++;
    }

    prevPage() {
        this.currentPage--;
    }

    searchPage() {
        this.currentSearch = {}
        this.currentPage = this.currentPage === 1 ? 0 : 1
    }

    filterPage() {
        this.currentFilter = {}
        this.currentPage = this.currentPage === 2 ? 0 : 2
    }

    sortPage() {
        this.sortDirection = !this.sortDirection
        this.dataSource.sort(this.sortDirection)
    }

    async showDialog(message, type='message') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async addNewItem() {
        this.dataSource.addNewItem(this.currentItem);
        const page = this.renderRoot.querySelector('my-sportsmen-section-1-page-1')
        page.startEdit()
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
        await this.dataSource.saveItem(this.currentItem, this.listItem);
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
        if (this.oldValues.size === 0) {
            this.isModified = false;
        } else {
            const modalResult = await this.showDialog('Вы действительно хотите отменить все сделанные изменения?', 'confirm')
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
    }

    async deleteItem() {
        const modalResult = await this.confirmDialog('Вы действительно хотите удалить этого спортсмена?')
        if (modalResult !== 'Ok')
            return;
        this.dataSource.deleteItem(this.currentItem, this.listItem)
    }

    async firstUpdated() {
        super.firstUpdated();
        this.dataSource = new DataSource(this, await DataSet.getDataSet())
        await this.dataSource.init();
        this.listEnd = this.dataSource.items.length - 20;
        this.requestUpdate()
    }
}

customElements.define("my-sportsmen-section-1", MySportsmenSection1)

// {
//     "_id": "_design/sportsmen",
//     "_rev": "3-a6ea7536143ba6fff32743d5b63461bd",
//     "views": {
//       "list": {
//         "map": "function (doc) {\n  fio = doc.lastName;\n  if (doc.firstName) { fio += ' ' + doc.firstName + '.'}\n  if (doc.middleName) { fio += doc.middleName[0] + '.' }\n  emit(fio, {sportsmanId: doc.sportsmanId, gender: doc.gender, category: doc.category.shortName})\n}"
//       },
//       "sportsman-id": {
//         "map": "function (doc) {\n  if(doc.sportsmanId)\n    emit(doc.sportsmanId, 1);\n}"
//       },
//       "last-name": {
//         "map": "function (doc) {\n  emit(doc.lastName, 1);\n}"
//       }
//     },
//     "language": "javascript",
//     "options": {
//       "partitioned": true
//     }
//   }


// {
//     "_id": "_design/sportsmen",
//     "_rev": "2-d54962bae939c67bd571c0cec763f41d",
//     "views": {
//       "list": {
//         "map": "function (doc) {\n  fio = doc.lastName;\n  if (doc.firstName) { fio += ' ' + doc.firstName + ''}\n  if (doc.middleName) { fio += ' ' +doc.middleName[0] + '.' }\n  emit(fio, {sportsmanId: doc.sportsmanId, gender: doc.gender, category: doc.category && doc.category.shortName});\n}"
//       }
//     },
//     "language": "javascript",
//     "options": {
//       "partitioned": true
//     }
//   }