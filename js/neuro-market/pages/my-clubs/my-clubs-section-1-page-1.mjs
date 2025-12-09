import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import lang from '../../neuro-market-dictionary.mjs'

import CountryDataSource from '../my-countries/my-countries-datasource.mjs'
import CountryDataset from '../my-countries/my-countries-dataset.mjs'
import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'
import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

import ClubTypesDataset from '../my-club-types/my-club-types-dataset.mjs'
import ClubTypesDataSource from '../my-club-types/my-club-types-datasource.mjs'

class MyClubsSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            countryDataSource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
            cityTypeDataSource: {type: Object, default: null},
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

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="club-solid" label="${lang`Club name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="fullName" icon-name="club-solid" label="${lang`Full name`}:" .value=${this.item?.fullName} @input=${this.validateInput}></simple-input>
                <simple-select id="country" icon-name="country-solid" @icon-click=${() => this.showPage('my-countries')} image-name=${this.item?.city?.region?.country?.flag && 'https://hatscripts.github.io/circle-flags/flags/' + this.item?.city?.region?.country?.flag + '.svg'} label="${lang`Country name`}:" .dataSource=${this.countryDataSource} .value=${this.item?.city?.region?.country} @input=${this.countryChange}></simple-select>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="${lang`Region name`}:" .dataSource=${this.regionDataSource} .value=${this.item?.city?.region} @input=${this.regionChange}></simple-select>
                <simple-select id="city" .showValue=${this.cityShowValue} .listStatus=${this.cityListStatus} .listLabel=${this.cityListLabel} icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="${lang`City name`}:" .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-select id="type" icon-name="club-type-solid" @icon-click=${() => this.showPage('my-club-types')} label="${lang`Club type name`}:" .dataSource=${this.clubTypesDataSource} .value=${this.item?.type} @input=${this.validateInput}></simple-select>
            </div>
        `;
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

        if (e.target.id === 'region') {
            this.$id('city').setValue('')
            this.cityDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    showPage(page) {
        location.hash = page;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.countryDataSource = new CountryDataSource(this, await CountryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
        this.clubTypesDataSource = new ClubTypesDataSource(this, await ClubTypesDataset.getDataSet())
    }
}

customElements.define("my-clubs-section-1-page-1", MyClubsSection1Page1);