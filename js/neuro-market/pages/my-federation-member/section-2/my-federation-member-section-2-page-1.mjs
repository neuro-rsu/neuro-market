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

import ClubDataSource from '../../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../../my-clubs/my-clubs-dataset.mjs'

import SportsmenDataset from '../../my-sportsmen/my-sportsmen-dataset.mjs'

class MyFederationMemberSection2Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            sportsCategorySource: { type: Object, default: null },
            regionDataSource: { type: Object, default: null },
            clubDataSource: { type: Object, default: null },
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

    sportsmanShowValue(item) {
        if (!item) {
            return item
        }
        if (typeof item === 'string') {
            return item
        }
        let result = item.lastName ?? ''
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName[0]}.`
        }
        result += (item?.category?.shortName ? ' (' + item.category.shortName + ')' : '')
        return result
    }

    sportsmanListLabel(item) {
        if (!item) {
            return item
        }
        let result = item.lastName ?? ''
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName[0]}.`
        }
        result += (item.category?.shortName ? ' (' + item.category.shortName + ')' : '')
        return result
    }

    sportsmanListStatus(item) {
        return { name: item?.region?.name }
    }

    sportsmanListIcon(item) {
        return item?.gender == true ? "sportsman-woman-solid" : "sportsman-man-solid"
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user" @icon-click=${this.gotoSportsmanPage} .value=${this.item?.payload?.lastName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.payload?.firstName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.payload?.middleName} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.payload?.gender}" .currentObject=${this.item?.payload} @input=${this.validateInput}></gender-input>
                <simple-input id="birthday" label="${lang`Data of birth`}:" icon-name="cake-candles-solid" .value=${this.item?.payload?.birthday} .currentObject=${this.item?.payload} @input=${this.validateInput} lang="ru-Ru" type="date" ></simple-input>
                <simple-select id="category" label="${lang`Sports category`}:" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.payload?.category} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-input id="sportsmanPC" label="${lang`Sportsman PC`}:" icon-name="sportsman-pc-solid" button-name="add-solid" @icon-click=${this.copyToClipboard} @button-click=${this.createSportsmanPC} .value=${this.item?.payload?.sportsmanPC} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <simple-input id="sportsman" label="${lang`Sportsman`}:" icon-name=${this.item?.payload?.gender == true ? "sportsman-woman-solid" : "sportsman-man-solid"} @icon-click=${this.gotoSportsmanPage} .dataSource=${this.findDataSource} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .listLabel=${this.sportsmanListLabel} .listIcon=${this.sportsmanListIcon} .listStatus=${this.sportsmanListStatus} .showValue=${this.sportsmanShowValue} .value=${this.item?.sportsman} @input=${this.validateInput} @select-item=${this.sportsmanChoose}></simple-input>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.payload?.region} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <simple-select id="club" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .listStatus=${this.clubListStatus} .dataSource=${this.clubDataSource} .showValue=${this.clubShowValue} .listLabel=${this.clubListLabel} .value=${this.item?.payload?.club} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input id="order.number" label="${lang`Order number`}:" icon-name="order-number-solid" @icon-click=${this.numberClick} .value=${this.item?.payload?.order?.number} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                    <simple-input id="order.link" label="${lang`Order link`}:" icon-name="link-solid" @icon-click=${this.linkClick} .value=${this.item?.payload?.order?.link} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                </div>
                <simple-input id="personLink" label="${lang`Person link`}:" icon-name="user-link" @icon-click=${this.linkClick} .value=${this.item?.payload?.link} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
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
            sportsman = await SportsmenDataset.getItemByLastName(lastName)
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
            sportsman = await SportsmenDataset.getItem(value)
        } else if (target.value.includes("-")) {
            sportsman = await SportsmenDataset.getItemBySportsmanPC(value)
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
            sportsman = await SportsmenDataset.getItemByLastName(value)
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
            this.item.sportsman = sportsman
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
    }
}

customElements.define("my-federation-member-section-2-page-1", MyFederationMemberSection2Page1);