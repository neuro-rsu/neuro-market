import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'
import '../../../../components/inputs/gender-input.mjs'
import '../../../../components/inputs/birthday-input.mjs'

import DataSet from './my-sportsman-registrations-dataset.mjs'

import SportsCategoryDataSource from '../my-sports-categories/my-sports-categories-datasource.mjs'
import SportsCategoryDataset from '../my-sports-categories/my-sports-categories-dataset.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

import ClubDataSource from '../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../my-clubs/my-clubs-dataset.mjs'

class MySportsmanRegistrationsSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
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
            <div class="container">
                <div class="name-group">
                    <simple-input id="lastName" icon-name="user" label="Last name:" .value=${this.item?.lastName} @input=${this.validateInput}></simple-input>
                    <simple-input id="firstName" icon-name="user-group-solid" label="First name:" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="middleName" icon-name="users-solid" label="Middle name:" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                <birthday-input id="birthday" label="Data of birth:" .value="${this.item?.birthday}" @input=${this.validateInput}></birthday-input>
                <gender-input id="gender" icon-name="gender" label="Gender:" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-select id="region" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} label="Region name:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} label="Club name:" .dataSource=${this.clubDataSource} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <simple-input id="profileUlid" icon-name="hash-number-solid" @icon-click=${this.copyToClipboard} label="Sportsman Ulid:" .value=${this.item?.profileUlid} @input=${this.validateInput}></simple-input>
                <simple-input id="hashNumber" icon-name="id-number-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.createHashNumber} label="Sportsman number:" .value=${this.item?.hashNumber} @input=${this.validateInput}></simple-input>
                <simple-select id="category" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} label="Sports category:" .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="order.number" icon-name="order-number-solid" @icon-click=${this.numberClick} label="Order number:" .currentObject={this.item?.order} .value=${this.item?.order?.number} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" icon-name="link-solid" @icon-click=${this.linkClick} label="Order link:" .currentObject={this.item?.order} .value=${this.item?.order?.link} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" icon-name="user-link" @icon-click=${this.linkClick} label="Person link:" .value=${this.item?.link} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    async createHashNumber() {
        const hashNumber = await DataSet.createHashNumber({
            countryCode: this.item?.region?.country?.flag.toUpperCase(),
            regionCode: host.item?.region?.code,
            ulid: host.item?.profileUlid,
        })
        this.value = hashNumber;
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

        if ( e.target.id === 'lastName' || e.target.id === 'firstName' || e.target.id === 'middleName' || e.target.id === 'gender' ) {
            this.parentNode.parentNode.host.requestUpdate()
        }

        if (e.target.id === 'region') {
            this.$id('club').setValue('')
            this.clubDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.sportsCategoryDataSource = new SportsCategoryDataSource(this, await SportsCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
    }
}

customElements.define("my-sportsman-registrations-section-1-page-1", MySportsmanRegistrationsSection1Page1);