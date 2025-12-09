import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import '../../../../components/inputs/gender-input.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import DataSet from './my-trainers-dataset.mjs'

import TrainerCategoryDataSource from '../my-trainer-categories/my-trainer-categories-datasource.mjs'
import TrainerCategoryDataset from '../my-trainer-categories/my-trainer-categories-dataset.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../my-cities/my-cities-datasource.mjs'
import CityDataset from '../my-cities/my-cities-dataset.mjs'

class MyTrainersSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            trainerCategoryDataSource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
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
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.lastName} @input=${this.validateInput} @icon-click=${this.gotoSportsmanPage}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="category" label="${lang`Category`}:" icon-name="trainer-category-solid" @icon-click=${() => this.showPage('my-trainer-categories')} .dataSource=${this.trainerCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" .showValue=${this.cityShowValue} .listLabel=${this.cityListLabel} .listStatus=${this.cityListStatus} @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <simple-input id="trainerPC" label="${lang`Trainer PC`}:" icon-name="trainer-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createTrainerPC} .value=${this.item?.trainerPC} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .currentObject={this.item?.order} .value=${this.item?.order?.number} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .currentObject={this.item?.order} .value=${this.item?.order?.link} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .value=${this.item?.link} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    gotoSportsmanPage() {
        if (!this.item?._id) {
            return
        }
        location.hash = "#my-trainer";
        location.search = `?trainer=${this.item?._id.split(':')[1]}`
    }

    async createTrainerPC(e) {
        const target = e.target
        const id = await DataSet.createTrainerPC({
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

    linkClick(e) {
        window.open(e.target.value);
    }

    showPage(page) {
        location.hash = page;
    }

    numberClick(e) {
        window.open(this.$id('order.link').value);
    }

    validateInput(e) {
        let id = e.target.id
        let currentItem = e.target.currentObject ?? this.item
        if (id == "order.number") {
            id = "number"
            if (!this.item.order) {
                this.item.order = {}
            }
            currentItem = this.item.order
        }
        if (id == "order.link") {
            id = "link"
            if (!this.item.order) {
                this.item.order = {}
            }
            currentItem = this.item.order
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

        if ( e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName') {
            this.parentNode.parentNode.host.requestUpdate()
        }

        if (e.target.id === 'region') {
            this.$id('city').setValue('')
            this.cityDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.trainerCategoryDataSource = new TrainerCategoryDataSource(this, await TrainerCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }
}

customElements.define("my-trainers-section-1-page-1", MyTrainersSection1Page1);