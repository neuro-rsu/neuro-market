import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import SportsCategoryDataset from '../../my-sports-categories/my-sports-categories-dataset.mjs'
import SportsCategoryDataSource from '../../my-sports-categories/my-sports-categories-datasource.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import ClubDataSource from '../../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../../my-clubs/my-clubs-dataset.mjs'

class MySportsmanSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            sportsmanCategoryDataSource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            clubDataSource: {type: Object, default: null},
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

                #birthday {
                    --text-align: center;
                }
            `
        ]
    }

    // <simple-input id="profileUlid" label="${lang`Sportsman Ulid`}:" icon-name="hash-number-solid" @icon-click=${this.copyToClipboard} .value=${this.item?._id} @input=${this.validateInput}></simple-input>

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

    render() {
        return html`
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-input id="birthday" label="${lang`Data of birth`}:" icon-name="cake-candles-solid" .value=${this.item?.birthday} @input=${this.validateInput} lang="ru-Ru" type="date" ></simple-input>
                <simple-select id="category" label="${lang`Sports category`}:" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-input id="sportsmanPC" label="${lang`Sportsman PC`}:" icon-name="sportsman-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard} @button-click=${this.createSportsmanPC} .value=${this.item?.sportsmanPC} @input=${this.validateInput}></simple-input>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .listStatus=${this.clubListStatus} .dataSource=${this.clubDataSource} .showValue=${this.clubShowValue} .listLabel=${this.clubListLabel} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .currentObject={this.item?.order} .value=${this.item?.order?.number} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .currentObject={this.item?.order} .value=${this.item?.order?.link} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .value=${this.item?.link} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    async createSportsmanPC(e) {
        const target = e.target
        const spc = await DataSet.createSportsmanPC({
            countryCode: this.item?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.region?.code,
            ulid: this.item?.profileUlid,
        })
        target.setValue(spc);
    }

    async getQRCode() {
        const hashNumber = await DataSet.getQRCode({
            countryCode: this.item?.region?.country?.flag.toUpperCase(),
            regionCode: this.item?.region?.code,
            ulid: this.item?.profileUlid,
        })
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
        let currentItem = this.item
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

        if (e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName' || e.target.id === 'gender') {
            this.parentNode.parentNode.host.requestUpdate()
        }

        if (e.target.id === 'region') {
            this.$id('club').setValue('')
            this.clubDataSource.regionFilter(currentItem.region?._id)
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
        this.sportsCategoryDataSource = new SportsCategoryDataSource(this, await SportsCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
    }

}

customElements.define("my-sportsman-section-1-page-1", MySportsmanSection1Page1);