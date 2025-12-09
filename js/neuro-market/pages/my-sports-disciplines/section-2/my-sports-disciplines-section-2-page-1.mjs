import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import AgeGroupsDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupsDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'
import SportsDisciplineComponentsDataset from '../../my-sports-discipline-components/section-1/my-sports-discipline-components-dataset.mjs'
import SportsDisciplineComponentsDataSource from '../../my-sports-discipline-components/section-1/my-sports-discipline-components-datasource.mjs'

// import RefereePositionsDataset from '../../my-referee-positions/my-referee-positions-dataset.mjs'
// import RefereePositionsDataSource from '../../my-referee-positions/my-referee-positions-datasource.mjs'

// import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
// import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

// import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
// import CityDataset from '../../my-cities/my-cities-dataset.mjs'

import RefereeDataset from '../../my-referees/my-referees-dataset.mjs'


class MySportsDisciplinesSection2Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            refereeCategoriesDataSource: {type: Object, default: null},
            refereePositionsDataSource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
            ageGroupsDataSource: {type: Object, default: null},
            sportsDisciplineComponentsDataSource: {type: Object, default: null},
            findDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
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
                <simple-select id="ageGroup" label="${lang`Age group`}:"  icon-name=${this.item?.ageGroup?.gender == "1"  ? "age-group-women-solid" : "age-group-solid"} @icon-click=${() => this.showPage('my-age-groups')} .dataSource=${this.ageGroupsDataSource} .value=${this.item?.ageGroup} @input=${this.validateInput}></simple-select>
                <checkbox-group-input id="sportsDisciplineComponents" label="${lang`Components`}:" .value=${this.item?.sportsDisciplineComponents || []} .dataSet=${this.sportsDisciplineComponentsDataSource} @input=${this.validateInput}></checkbox-group-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (Array.isArray(e.target.value)) {
                this.oldValues.set(e.target, e.target.oldValue)
            } else {
                if (currentItem[e.target.id] !== e.target.value) {
                    this.oldValues.set(e.target, currentItem[e.target.id])
                }
            }
        }
        else {
            const oldValue = this.oldValues.get(e.target)
            if (Array.isArray(oldValue)) {
                if (oldValue.length === e.target.value.length && e.target.value.every(item1 => oldValue.some( item2 =>
                    item1.name ===  item2.name
                ))) {
                    this.oldValues.delete(e.target)
                }
            } else if (oldValue === e.target.value) {
                this.oldValues.delete(e.target)
            }
        }

        currentItem[e.target.id] = e.target.value

        // if (e.target.id === 'name' || e.target.id === 'startDate' || e.target.id === 'endDate' || e.target.id === 'stage') {
        //     this.parentNode.parentNode.host.requestUpdate()
        // }
        this.isModified = this.oldValues.size !== 0;
    }

    // async findSportsman(e) {
    //     const target = e.target
    //     let sportsman
    //     const value = target.value
    //     if (target.isShowList)
    //         target.isShowList = false
    //     if (!value) {
    //         const lastName = this.$id('lastName').value
    //         if (!lastName) {
    //             await this.errorDialog('Вы не задали фамилию для поиска')
    //             return
    //         }
    //         sportsman = await RefereeDataset.getItemByLastName(lastName)
    //         if (sportsman.rows.length === 0) {
    //             this.showDialog('Такой спортсмен не найден')
    //             return
    //         }
    //         if (sportsman.rows.length >= 1) {
    //             this.findDataSource = {}
    //             this.findDataSource.items = sportsman.rows.map(item => item.doc)
    //             target.isShowList = true
    //             return
    //         }
    //         sportsman = sportsman.rows[0].doc
    //     } else if (value.includes(":")) {
    //         sportsman = await RefereeDataset.getItem(value)
    //     } else if (target.value.includes("-")) {
    //         sportsman = await RefereeDataset.getItemBySportsmanPC(value)
    //         if (sportsman.rows.length === 0) {
    //             this.showDialog('Такой спортсмен не найден')
    //             return
    //         }
    //         if (sportsman.rows.length > 1) {
    //             this.showDialog('Найдено несколько спортсменов с таким ID')
    //             return
    //         }
    //         sportsman = sportsman.rows[0].doc
    //     } else {
    //         sportsman = await RefereeDataset.getItemByLastName(value)
    //         if (sportsman.rows.length >= 0) {
    //             this.findDataSource = sportsman.rows
    //         }
    //     }
    //     if (sportsman) {
    //         const inputs = this.$id()
    //         sportsman.refereeUlid = sportsman._id
    //         inputs.forEach(input => {
    //             if (input.id in sportsman) {
    //                 input.setValue(sportsman[input.id])
    //             }
    //         })
    //         // Object.assign(this.item, sportsman)
    //         this.requestUpdate()
    //     } else {
    //         this.showDialog('Такой спортсмен не найден')
    //     }
    // }

    // sportsmanChoose(e) {
    //     let sportsman = e.detail
    //     if (sportsman) {
    //         sportsman.refereeUlid = sportsman._id
    //         const inputs = this.$id()
    //         inputs.forEach(input => {
    //             if (input.id in sportsman) {
    //                 input.setValue(sportsman[input.id])
    //             }
    //         })
    //         //Object.assign(this.item, sportsman)
    //         this.requestUpdate()
    //     }
    // }

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

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        this.ageGroupsDataSource = new AgeGroupsDataSource(this, await AgeGroupsDataset.getDataSet())
        this.sportsDisciplineComponentsDataSource = new SportsDisciplineComponentsDataSource(this, await SportsDisciplineComponentsDataset.getDataSet())
        // this.refereePositionsDataSource = new RefereePositionsDataSource(this, await RefereePositionsDataset.getDataSet())
        // this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        // this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-sports-disciplines-section-2-page-1", MySportsDisciplinesSection2Page1);