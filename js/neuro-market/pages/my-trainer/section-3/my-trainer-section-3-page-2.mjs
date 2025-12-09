import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'


import lang from '../../../neuro-market-dictionary.mjs'

// import DataSet from './my-sportsmen-dataset.mjs'

import SportsCategoryDataSource from '../../my-sports-categories/my-sports-categories-datasource.mjs'
import SportsCategoryDataset from '../../my-sports-categories/my-sports-categories-dataset.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import ClubDataset from '../../my-clubs/my-clubs-dataset.mjs'
import ClubDataSource from '../../my-clubs/my-clubs-datasource.mjs'

import TrainerDataset from '../../my-trainers/my-trainers-dataset.mjs'
import TrainerDataSource from '../../my-trainers/my-trainers-datasource.mjs'

class MyTrainerSection3Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            trainerDataSource: {type: Object, default: null},
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

    trainerListLabel(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName[0]}.`
        }
        result += (item.category ? ' (' + item.category.shortName + ')' : '')
        return result
    }

    trainerShowValue(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName[0]}.`
        }
        result += (item.category ? ' (' + item.category.shortName + ')' : '')
        return result
    }

    trainerListStatus(item) {
        return { name: item?.region?.name }
    }

    trainerListIcon(item) {
        return item?.gender == true ? "trainer-woman-solid" : "trainer-man-solid"
    }

    trainerIcon(item) {
        return item?.gender == true ? "trainer-woman-solid" : "trainer-man-solid"
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" .currentObject=${this.item?.payload} .value=${this.item?.payload?.lastName} @input=${this.validateInput} @icon-click=${this.gotoSportsmanPage}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .currentObject=${this.item?.payload} .value=${this.item?.payload?.firstName} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .currentObject=${this.item?.payload} .value=${this.item?.payload?.middleName} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .currentObject=${this.item?.payload} .value="${this.item?.payload?.gender}" @input=${this.validateInput}></gender-input>
                <simple-input id="birthday" label="${lang`Data of birth`}:" icon-name="cake-candles-solid" .currentObject=${this.item?.payload} .value=${this.item?.payload?.birthday} @input=${this.validateInput} lang="ru-Ru" type="date" ></simple-input>
                <simple-select id="category" label="${lang`Sports category`}:" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} .dataSource=${this.sportsCategoryDataSource} .currentObject=${this.item?.payload} .value=${this.item?.payload?.category} @input=${this.validateInput}></simple-select>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .currentObject=${this.item?.payload} .value=${this.item?.payload?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .listStatus=${this.clubListStatus} .dataSource=${this.clubDataSource} .showValue=${this.clubShowValue} .listLabel=${this.clubListLabel} .currentObject=${this.item?.payload} .value=${this.item?.payload?.club} @input=${this.validateInput}></simple-select>
                <simple-select id="trainer" label="${lang`Trainer`}:" icon-name=${this.trainerIcon(this.item?.payload?.trainer)} @icon-click=${() => this.showPage('my-trainer')} .listStatus=${this.trainerListStatus} .dataSource=${this.trainerDataSource} .showValue=${this.trainerShowValue} .listLabel=${this.trainerListLabel} .listIcon=${this.trainerListIcon} .currentObject=${this.item?.payload} .value=${this.item?.payload?.trainer} @input=${this.validateInput}></simple-select>
                ${this.item?.payload?.sportsmanPC ?
                    html`<simple-input id="sportsmanPC" label="${lang`Sportsman PC`}:" icon-name="sportsman-pc-solid" @icon-click=${this.copyToClipboard} .currentObject=${this.item?.payload} .value=${this.item?.payload?.sportsmanPC}></simple-input>`
                    : ''}
                ${this.item?.payload?.order?.number ? html`
                    <div class="name-group">
                        <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .currentObject={this.item?.payload?.order} .currentObject=${this.item?.payload} .value=${this.item?.payload?.order?.number}></simple-input>
                        <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .currentObject={this.item?.payload?.order} .currentObject=${this.item?.payload} .value=${this.item?.payload?.order?.link}></simple-input>
                    </div>
                `: ''}
                ${this.item?.payload?.link ? html`
                    <simple-input id="link" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .currentObject=${this.item?.payload} .value=${this.item?.payload?.link}></simple-input>
                `: ''}
            </div>
        `;
    }

    gotoSportsmanPage() {
        if (!this.item?.sportsman) {
            return
        }
        location.hash = "#my-sportsman";
        location.search = `?sportsman=${this.item?.sportsman?._id.split(':')[1]}`
    }

    async createSportsmanPC(e) {
        const target = e.target
        // const spc = await DataSet.createSportsmanPC({
        //     countryCode: this.item?.region?.country?.flag.toUpperCase(),
        //     regionCode: this.item?.region?.code,
        //     ulid: this.item?.profileUlid,
        // })
        target.setValue(spc);
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
        this.trainerDataSource = new TrainerDataSource(this, await TrainerDataset.getDataSet())
    }
}

customElements.define("my-trainer-section-3-page-2", MyTrainerSection3Page2);