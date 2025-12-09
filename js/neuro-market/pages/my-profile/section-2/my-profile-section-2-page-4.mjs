import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/gender-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

// import DataSet from './my-sportsmen-dataset.mjs'

import TrainerCategoryDataSource from '../../my-trainer-categories/my-trainer-categories-datasource.mjs'
import TrainerCategoryDataset from '../../my-trainer-categories/my-trainer-categories-dataset.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

class MyProfileSection2Page4 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            trainerCategorySource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            cityDataSource: { type: Object, default: null },
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
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.payload?.lastName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.payload?.firstName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.payload?.middleName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.payload?.gender}" .currentObject=${this.item?.payload} @input=${this.validateInput}></gender-input>
                <simple-select id="category" label="${lang`Category`}:" icon-name="trainer-category-solid" @icon-click=${() => this.showPage('my-trainer-categories')} .dataSource=${this.trainerCategoryDataSource} .value=${this.item?.payload?.category} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.payload?.region} @input=${this.validateInput} .currentObject=${this.item?.payload} ></simple-select>
                <simple-select id="city" label="${lang`City name`}:" icon-name="city-solid" .showValue=${this.cityShowValue} .listLabel=${this.cityListLabel} .listStatus=${this.cityListStatus} @icon-click=${() => this.showPage('my-cities')} .dataSource=${this.cityDataSource} .value=${this.item?.payload?.city} @input=${this.validateInput} .currentObject=${this.item?.payload} ></simple-select>
                ${this.item?.payload?.trainerPC ? html`
                    <simple-input id="trainerPC" label="${lang`Referee PC`}:" icon-name="trainer-pc-solid" @icon-click=${this.copyToClipboard} .value=${this.item?.payload?.trainerPC} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                ` : ''}
                ${this.item?.payload?.order?.number ? html`
                    <div class="name-group">
                        <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .value=${this.item?.payload?.order?.number} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                        <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .value=${this.item?.payload?.order?.link} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    </div>
                ` : ''}
                ${this.item?.payload?.link ? html`
                    <simple-input id="link" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .value=${this.item?.payload?.link} .currentObject=${this.item?.payload}></simple-input>
                ` : ''}
            </div>
        `;
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
        this.trainerCategoryDataSource = new TrainerCategoryDataSource(this, await TrainerCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }
}

customElements.define("my-profile-section-2-page-4", MyProfileSection2Page4);