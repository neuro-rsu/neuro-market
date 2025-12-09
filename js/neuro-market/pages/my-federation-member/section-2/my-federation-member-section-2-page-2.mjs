import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/gender-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import RefereeCategoryDataSource from '../../my-referee-categories/my-referee-categories-datasource.mjs'
import RefereeCategoryDataset from '../../my-referee-categories/my-referee-categories-dataset.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

import SportsmanDataset from '../../my-referees/my-referees-dataset.mjs'

class MyFederationMemberSection2Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            refereeCategorySource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
            findDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: { type: Boolean, default: false, local: true },
            oldValues: { type: Map, default: null },
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

                #birthday {
                    --text-align: center;
                }
            `
        ]
    }

    sportsmanShowValue(item) {
         if (item?.lastName) {
            return item.lastName
         }
    }

    cityShowValue(item) {
        return item?.name ? `${item?.type?.shortName || ''} ${item?.name}` : ''
    }

    cityListLabel(item) {
        if (item?.name) {
            return item?.type?.shortName ? `${item?.type?.shortName} ${item?.name}` : item?.name
        }
        return ''
    }

    cityListStatus(item) {
        return { name: item?.region?.name ?? ''}
    }

    refereeListIcon(item) {
        return item.gender == true ? "referee-woman-solid" : "referee-man-solid"
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.payload?.lastName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.payload?.firstName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.payload?.middleName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.payload?.gender}" .currentObject=${this.item?.payload} @input=${this.validateInput}></gender-input>
                <simple-select id="category" label="${lang`Category`}:" icon-name="referee-category-solid" @icon-click=${() => this.showPage('my-referee-categories')} .dataSource=${this.refereeCategoryDataSource} .value=${this.item?.payload?.category} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-input id="refereePC" label="${lang`Referee PC`}:" icon-name="referee-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createRefereePC} .value=${this.item?.payload?.refereePC} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <simple-input id="referee" label="${lang`Referee`}:" .listIcon=${this.refereeListIcon} .dataSource=${this.findDataSource} icon-name=${this.item?.payload?.gender == true ? "referee-woman-solid" : "referee-man-solid"} @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .showValue=${this.sportsmanShowValue} .value=${this.item?.referee} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.payload?.region} .currentObject=${this.item?.payload}  @input=${this.validateInput}></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" .showValue=${this.cityShowValue} .listLabel=${this.cityListLabel} .listStatus=${this.cityListStatus} @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.payload?.city} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .value=${this.item?.payload?.order?.number} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .value=${this.item?.payload?.order?.link} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .value=${this.item?.payload?.link} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    async createRefereePC(e) {
        const target = e.target
        const id = await DataSet.createRefereePC({
            countryCode: this.item?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.region?.code,
            ulid: this.item?.profileUlid,
        })
        target.setValue(id)
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
                this.parentNode.parentNode.host.showDialog('Такой спортсмен не найден')
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
            sportsman = await SportsmanDataset.getItemByRefereePC(value)
            if (sportsman.rows.length === 0) {
                this.parentNode.parentNode.host.showDialog('Такой спортсмен не найден')
                return
            }
            if (sportsman.rows.length > 1) {
                this.parentNode.parentNode.host.showDialog('Найдено несколько спортсменов с таким ID')
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
            this.parentNode.parentNode.host.showDialog('Такой спортсмен не найден')
        }
    }

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            this.item.referee = sportsman
            // this.$id('sportsman').setValue(sportsman)
            // sportsman.sportsmanUlid = sportsman._id
            // const inputs = this.$id()
            // inputs.forEach(input => {
            //     if (input.id in sportsman) {
            //         input.setValue(sportsman[input.id])
            //     }
            // })
            // //Object.assign(this.item, sportsman)
            this.requestUpdate()
        }
    }

    async getQRCode() {
        // const hashNumber = await DataSet.getQRCode({
        //     countryCode: this.item?.region?.country?.flag.toUpperCase(),
        //     regionCode: this.item?.region?.code,
        //     ulid: this.item?.profileUlid,
        // })
        e.target.setValue(hashNumber);
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    showPage(page) {
        location.hash = page;
    }

    linkClick(e) {
        window.open(e.target.value);
    }

    numberClick(e) {
        window.open(this.$id('order.link').value);
    }

    validateInput(e) {
        let id = e.target.id
        let currentItem = e.target.currentObject ?? this.item
        if (id == "order.number") {
            id = "number"
            if (!currentItem.order) {
                currentItem.order = {}
            }
            currentItem = currentItem.order
        }
        if (id == "order.link") {
            id = "link"
            if (!currentItem.order) {
                currentItem.order = {}
            }
            currentItem = currentItem.order
        }

        if (!this.oldValues.has(e.target)) {
            if (currentItem[id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[id] = e.target.value

        if (e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName' || e.target.id === 'gender') {
            this.parentNode.parentNode.host.requestUpdate()
        }

        if (e.target.id === 'region') {
            this.$id('city').setValue('')
            this.cityDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    async firstUpdated() {
        super.firstUpdated();
        this.refereeCategoryDataSource = new RefereeCategoryDataSource(this, await RefereeCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }
}

customElements.define("my-federation-member-section-2-page-2", MyFederationMemberSection2Page2);