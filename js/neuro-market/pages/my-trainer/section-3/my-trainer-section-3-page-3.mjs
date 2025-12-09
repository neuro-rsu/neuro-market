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

import ClubTypesDataset from '../../my-club-types/my-club-types-dataset.mjs'
import ClubTypesDataSource from '../../my-club-types/my-club-types-datasource.mjs'

class MyTrainerSection3Page3 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
            clubTypesDataSource: { type: Object, default: null },
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

    // <simple-input id="profileUlid" label="${lang`Sportsman Ulid`}:" icon-name="hash-number-solid" @icon-click=${this.copyToClipboard} .value=${this.item?._id} @input=${this.validateInput}></simple-input>
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

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="club-solid" label="${lang`Club name`}:" .value=${this.item?.payload?.name} @input=${this.validateInput} @icon-click=${this.gotoSportsmanPage}></simple-input>
                <simple-input id="fullName" icon-name="club-solid" label="${lang`Full name`}:" .value=${this.item?.payload?.fullName} @input=${this.validateInput}></simple-input>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="${lang`Region name`}:" .dataSource=${this.regionDataSource} .value=${this.item?.payload?.city?.region} @input=${this.regionChange}></simple-select>
                <simple-select id="city" .showValue=${this.cityShowValue} .listStatus=${this.cityListStatus} .listLabel=${this.cityListLabel} icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="${lang`City name`}:" .dataSource=${this.cityDataSource} .value=${this.item?.payload?.city} @input=${this.validateInput}></simple-select>
                <simple-select id="type" icon-name="club-type-solid" @icon-click=${() => this.showPage('my-club-types')} label="${lang`Club type name`}:" .dataSource=${this.clubTypesDataSource} .value=${this.item?.payload?.type} @input=${this.validateInput}></simple-select>
            </div>
        `
    }

    gotoSportsmanPage() {
        if (!this.item?.club) {
            return
        }
        location.hash = "#my-club";
        location.search = `?club=${this.item?.club?._id.split(':')[1]}`
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

    regionChange(e) {
        let region = e.target.value
        this.cityDataSource.regionFilter(region._id)
        this.$id('city').setValue(null)
    }

    validateInput(e) {
        let id = e.target.id
        let currentItem = this.item.payload
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
        this.clubTypesDataSource = new ClubTypesDataSource(this, await ClubTypesDataset.getDataSet())
    }
}

customElements.define("my-trainer-section-3-page-3", MyTrainerSection3Page3);