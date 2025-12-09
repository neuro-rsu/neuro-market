import { BaseElement, html, css } from '../../../../../base-element.mjs'

import '../../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/inputs/gender-input.mjs'
import '../../../../../../components/inputs/birthday-input.mjs'
import '../../../../../../components/selects/simple-select.mjs'

import lang from '../../../../neuro-market-dictionary.mjs'

import SportsCategoryDataSource from '../../../my-sports-categories/my-sports-categories-datasource.mjs'
import SportsCategoryDataset from '../../../my-sports-categories/my-sports-categories-dataset.mjs'

import RegionDataSource from '../../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../../my-regions/my-regions-dataset.mjs'

import ClubDataSource from '../../../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../../../my-clubs/my-clubs-dataset.mjs'

import AgeGroupDataSource from '../../../my-age-groups/my-age-groups-datasource.mjs'
import AgeGroupDataset from '../../../my-age-groups/my-age-groups-dataset.mjs'

import Dataset from './my-competition-section-1-dataset.mjs'
import DataSource from './my-competition-section-1-datasource.mjs'

import SportsmanDataset from '../../../my-sportsmen/my-sportsmen-dataset.mjs'

class MyCompetitionSection1Page4 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            dataSource: { type: Object, default: null },
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
            findDataSource: {type: Object, default: null},
            item: {type: Object, default: {}},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            parent: { type: Object, default: {} },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }
                .container {
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
            `
        ]
    }

    render() {
        return html`
            <modal-dialog></modal-dialog>
            <div class="container">
                <div class="name-group">
                    <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <birthday-input id="birthday" label="${lang`Data of birth`}:" .value="${this.item?.birthday}" @input=${this.validateInput}></birthday-input>
                <simple-input id="sportsmanId" label="${lang`Sportsman ID`}:" .dataSource=${this.findDataSource} icon-name="id-number-solid" @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .value=${this.item?.sportsmanId} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="ageGroup" label="${lang`Age group`}:" icon-name="age-group-solid" @icon-click=${() => this.showPage('my-age-groups')} .dataSource=${this.ageGroupDataSource} .value=${this.item?.ageGroup} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .dataSource=${this.clubDataSource} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <simple-select id="category" label="${lang`Sports category`}:" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-input id="sportsmanUlid" label="${lang`Sportsman Ulid`}:" icon-name=${+this.item?.gender ? "sportsman-woman-solid" : "sportsman-man-solid"} @icon-click=${() => this.showPage('my-sportsman')} .value=${this.item?.sportsmanUlid} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value
        if (e.target.id === 'name') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        if (e.target.id === 'birthday' || e.target.id === 'gender') {
            try {
                this.changeAgeGroup()
                this.requestUpdate()
            }
            catch {

            }
        }

        if (e.target.id === 'region') {
            this.$id('club').setValue('')
            this.clubDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    async findSportsman(e) {
        const target = e.target
        let sportsman
        const value = target.value
        if (target.isShowList)
            target.isShowList = false
        if (!value) {
            const lastName = this.$id('lastName').value
            if (!lastName) {
                await this.errorDialog('Вы не задали фамилию для поиска')
                return
            }
            sportsman = await SportsmanDataset.getItemByLastName(lastName)
            if (sportsman.rows.length === 0) {
                this.showDialog('Такой спортсмен не найден')
                return
            }
            if (sportsman.rows.length >= 1) {
                this.findDataSource = {}
                this.findDataSource.items = sportsman.rows.map(item => item.doc)
                target.isShowList = true
                return
            }
            sportsman = sportsman.rows[0].doc
        } else if (value.includes(":")) {
            sportsman = await SportsmanDataset.getItem(value)
        } else if (target.value.includes("-")) {
            sportsman = await SportsmanDataset.getItemBySportsmanPC(value)
            if (sportsman.rows.length === 0) {
                this.showDialog('Такой спортсмен не найден')
                return
            }
            if (sportsman.rows.length > 1) {
                this.showDialog('Найдено несколько спортсменов с таким ID')
                return
            }
            sportsman = sportsman.rows[0].doc
        } else {
            sportsman = await SportsmanDataset.getItemByLastName(value)
            if (sportsman.rows.length >= 0) {
                this.findDataSource = sportsman.rows
            }
        }
        if (sportsman) {
            const inputs = this.$id()
            sportsman.sportsmanUlid = sportsman._id
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            // Object.assign(this.item, sportsman)
            this.requestUpdate()
        } else {
            this.showDialog('Такой спортсмен не найден')
        }
    }

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            sportsman.sportsmanUlid = sportsman._id
            const inputs = this.$id()
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            //Object.assign(this.item, sportsman)
            this.requestUpdate()
        }
    }

    async showDialog(message, type='message', title='') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        if (title) {
            modalDialog.title = title
        }
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async errorDialog(message) {
        return this.showDialog(message, 'error', 'Ошибка')
    }

    changeAgeGroup() {
        const gender = this.$id('gender').value
        const year = this.$id('birthday').value.split('.')[2]
        if ((gender || gender === 0) && year) {
            const ageGroupComponent = this.$id('ageGroup')
            const nowYear = this.parent.startDate.split("-")[0]
            const age = nowYear - year
            const item = this.parent.ageGroups.find( item => item.gender == gender && age >= item.minAge && age <= item.maxAge)
            if (item) {
                ageGroupComponent.setValue(item)
            } else {
                this.errorDialog("Такая возрастная группа в соревновании не найдена")
                delete this.item.ageGroup
                ageGroupComponent.setValue('')
            }
        }
    }

    async saveItem() {
        await Dataset.addItem(this.item);
    }

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        // this.dataSource = new DataSource(this)
        // await this.dataSource.getItem()
        const parentId = sessionStorage.getItem('competition').split(':')[1]
        Dataset.getDataSet(parentId)
        this.sportsman = await Dataset.getSportsman()
        Object.assign(this.item, this.sportsman)
        if ("_id" in this.sportsman) {
            this.item.sportsmanUlid = this.sportsman._id
        }
        delete this.item._id
        delete this.item._rev
        this.sportsCategoryDataSource = new SportsCategoryDataSource(this, await SportsCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
        this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
    }

}

customElements.define("my-competition-section-1-page-4", MyCompetitionSection1Page4);