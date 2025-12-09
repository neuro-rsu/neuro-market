import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/gender-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

// import DataSet from './my-sportsmen-dataset.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

import ClubDataSource from '../../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../../my-clubs/my-clubs-dataset.mjs'

import ClubTypesDataset from '../../my-club-types/my-club-types-dataset.mjs'
import ClubTypesDataSource from '../../my-club-types/my-club-types-datasource.mjs'

class MyFederationMemberSection2Page6 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            regionDataSource: { type: Object, default: null },
            clubDataSource: { type: Object, default: null },
            clubTypesCategorySource: { type: Object, default: null },
            findDataSource: { type: Object, default: null },
            item: { type: Object, default: null },
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

    clubShowValue(item) {
        if (item?.name)
            return `${item?.name}, ${item?.city?.type?.shortName || ''} ${item?.city?.name}`
        return ''
    }

    clubListLabel(item) {
        // return item?.type?.shortName + ' ' + item?.name
        return item?.city?.name ? `${item?.name}, ${item?.city?.type?.shortName || ''} ${item?.city?.name}` : item?.name
    }

    clubListStatus(item) {
        return { name: item?.city?.region?.name }
    }

    // <simple-input id="name" label="${lang`Club name`}:" icon-name="club-solid" .value=${this.item?.payload?.name} @input=${this.validateInput}></simple-input>
    render() {
        return html`
            <div class="container">
                <simple-input id="name" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .value=${this.item?.payload?.name} .currentObject=${this.item?.payload} @input=${this.validateInput} .listStatus=${this.clubListStatus} .listLabel=${this.clubListLabel} .dataSource=${this.findDataSource} button-name="user-magnifying-glass-solid" @button-click=${this.findSportsman} @select-item=${this.sportsmanChoose} ></simple-input>
                <simple-input id="fullName" label="${lang`Full name`}:" icon-name="club-solid" .value=${this.item?.payload?.fullName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.payload?.city?.region} .currentObject=${this.item?.payload} @input=${this.regionChange}></simple-select>
                <simple-select id="city" .showValue=${this.cityShowValue} .listStatus=${this.cityListStatus} .listLabel=${this.cityListLabel} icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="${lang`City name`}:" .dataSource=${this.cityDataSource} .value=${this.item?.payload?.city} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-select id="type" label="${lang`Club type name`}:" icon-name="club-type-solid" @icon-click=${() => this.showPage('my-club-types')} .dataSource=${this.clubTypesDataSource} .value=${this.item?.payload?.type} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-input id="club" label="${lang`Club`}:" .listStatus=${this.clubListStatus} .listLabel=${this.clubListLabel} .dataSource=${this.findDataSource} icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .showValue=${this.clubShowValue} .value=${this.item?.club}  @select-item=${this.sportsmanChoose} @input=${this.validateInput}></simple-input>
            </div>
            `;
            // <!-- <simple-select id="club" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .listStatus=${this.clubListStatus} .dataSource=${this.clubDataSource} .showValue=${this.clubShowValue} .listLabel=${this.clubListLabel} .value=${this.item?.club} @input=${this.validateInput}></simple-select> -->
    }

    async findSportsman(e) {
        const target = e.target
        let sportsman
        const value = target.value
        if (target.isShowList)
            target.isShowList = false

        const lastName = this.$id('name').value
        if (!lastName) {
            await this.errorDialog('Вы не задали наименование клуба для поиска')
            return
        }
        sportsman = this.clubDataSource.filter('name', lastName)
        if (sportsman.length === 0) {
            this.parentNode.parentNode.host.showDialog('Такой клуб не найден')
            return
        }
        if (sportsman.length >= 1) {
            this.findDataSource = {}
            this.findDataSource.items = sportsman.map(item => item)
            target.isShowList = true
            return
        }
        sportsman = sportsman.rows[0].doc

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
            this.parentNode.parentNode.host.showDialog('Такой клуб не найден')
        }
    }

    sportsmanChoose(e) {
        let club = e.detail
        if (club) {
            this.$id('club').setValue(club)
            const inputs = this.$id()
            inputs.forEach(input => {
                if (input.id in club) {
                    input.setValue(club[input.id])
                }
            })
            //Object.assign(this.item, sportsman)
            this.requestUpdate()
        }
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
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
        this.clubTypesDataSource = new ClubTypesDataSource(this, await ClubTypesDataset.getDataSet())
    }
}

customElements.define("my-federation-member-section-2-page-6", MyFederationMemberSection2Page6);