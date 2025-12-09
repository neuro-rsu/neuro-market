import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/selects/simple-select.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/inputs/groupbox-input.mjs'
import '../../../../../components/inputs/checkbox-input.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import {shootingMask, sprintMask, skiingMask,  swimmingMask, pushUpMask, pullUpMask, throwingMask, runningMask, rollerSkiingMask, jumpingMask}  from '../section-6/masks.mjs'

import SportsCategoryDataSource from '../../my-sports-categories/my-sports-categories-datasource.mjs'
import SportsCategoryDataset from '../../my-sports-categories/my-sports-categories-dataset.mjs'

import RegionDataSource from '../../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../../my-regions/my-regions-dataset.mjs'

import ClubDataSource from '../../my-clubs/my-clubs-datasource.mjs'
import ClubDataset from '../../my-clubs/my-clubs-dataset.mjs'

import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'
import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'

import SportsmanDataset from '../../my-sportsmen/my-sportsmen-dataset.mjs'

import TrainerDataset from '../../my-trainers/my-trainers-dataset.mjs'
import TrainerDataSource from '../../my-trainers/my-trainers-datasource.mjs'

class MyCompetitionSection2Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            sportsCategorySource: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            clubDataSource: {type: Object, default: null},
            trainerDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
            findDataSource: {type: Object, default: null},
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            parent: { type: Object, default: null },
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
                simple-input[hidden] {
                    display: none;
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

    trainerShowValue(item) {
        if (!item) {
            return item
        }
        if (typeof item === 'string') {
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
            <modal-dialog></modal-dialog>
            <div class="container">
                <simple-input id="lastName" label="${lang`Last name`}:" icon-name="user"  @icon-click=${this.gotoSportsmanPage} .dataSource=${this.findDataSource} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsmanByName} .listLabel=${this.sportsmanListLabel} .listIcon=${this.sportsmanListIcon} .listStatus=${this.sportsmanListStatus} .value=${this.item?.lastName} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <div class="name-group">
                    <simple-input id="firstName" label="${lang`First name`}:" icon-name="user-group-solid" .value=${this.item?.firstName} @input=${this.validateInput}></simple-input>
                    <simple-input id="middleName" label="${lang`Middle name`}:" icon-name="users-solid" .value=${this.item?.middleName} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" label="${lang`Gender`}:" icon-name="gender" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-input id="birthday" label="${lang`Data of birth`}:" icon-name="cake-candles-solid" .value=${this.item?.birthday} @input=${this.validateInput} lang="ru-Ru" type="date" ></simple-input>
                <simple-select id="ageGroup" label="${lang`Age group`}:" icon-name=${this.item?.gender == true ? "age-group-women-solid" : "age-group-solid"} .listIcon=${(item) => item?.gender == true ? "age-group-women-solid" : "age-group-solid"} @icon-click=${() => this.showPage('my-age-groups')} .dataSource=${this.ageGroupDataSource} .value=${this.item?.ageGroup} @input=${this.validateInput}></simple-select>
                <simple-select id="category" label="${lang`Sports category`}:" icon-name="sportsman-category-solid" @icon-click=${() => this.showPage('my-sports-categories')} .dataSource=${this.sportsCategoryDataSource} .value=${this.item?.category} @input=${this.validateInput}></simple-select>
                <simple-input id="sportsmanPC" label="${lang`Sportsman PC`}:" .dataSource=${this.findDataSource} icon-name="sportsman-pc-solid" @icon-click=${this.copyToClipboard} button-name="user-magnifying-glass-solid"  @button-click=${this.findSportsman} .value=${this.item?.sportsmanPC} @input=${this.validateInput} @select-item=${this.sportsmanChoose} ></simple-input>
                <simple-select id="region" label="${lang`Region name`}:" icon-name="region-solid" @icon-click=${() => this.showPage('my-regions')} .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
                <simple-select id="club" label="${lang`Club name`}:" icon-name="club-solid" @icon-click=${() => this.showPage('my-clubs')} .listStatus=${this.clubListStatus} .dataSource=${this.clubDataSource} .showValue=${this.clubShowValue} .listLabel=${this.clubListLabel} .value=${this.item?.club} @input=${this.validateInput}></simple-select>
                <simple-select id="trainer" label="${lang`Trainer`}:" icon-name=${this.trainerIcon(this.item?.trainer)} @icon-click=${this.gotoTrainerPage} .listStatus=${this.trainerListStatus} .dataSource=${this.trainerDataSource} .showValue=${this.trainerShowValue} .listLabel=${this.trainerListLabel} .listIcon=${this.trainerListIcon} .value=${this.item?.trainer} @input=${this.validateInput}></simple-select>
                <simple-input id="sportsNumber" label="${lang`Sports number`}:" icon-name="sports-number-solid" .value=${this.item?.sportsNumber} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                <groupbox-input label="${lang`National team member`}:">
                    <checkbox-input id="clubMember" label="${lang`Club member`}" .value=${this.item?.clubMember} .checked=${this.item?.clubMember} @input=${this.validateInput}></checkbox-input>
                    <checkbox-input id="teamMember" label="${lang`Team member`}" .value=${this.item?.teamMember} .checked=${this.item?.teamMember} @input=${this.validateInput}></checkbox-input>
                </groupbox-input>
                <groupbox-input label="${lang`Expected results`}:">
                    <simple-input id="shooting.preResult" label="${lang`Shooting`}:" icon-name="shooting-solid" ?hidden=${!this.preResultVisible?.has('shooting-solid')} .mask=${shootingMask} .value=${this.item?.shooting?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="swimming.preResult" label="${lang`Swimming`}:" icon-name="swimming-solid" ?hidden=${!this.preResultVisible?.has('swimming-solid')} .mask=${swimmingMask} .value=${this.item?.swimming?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="sprinting.preResult" label="${lang`Sprinting`}:" icon-name="sprinting-solid" ?hidden=${!this.preResultVisible?.has('sprinting-solid')} .mask=${sprintMask} .value=${this.item?.sprinting?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="throwing.preResult" label="${lang`Throwing`}:" icon-name="throwing-solid" ?hidden=${!this.preResultVisible?.has('throwing-solid')} .mask=${throwingMask} .value=${this.item?.throwing?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="running.preResult" label="${lang`Running`}:" icon-name="running-solid" ?hidden=${!this.preResultVisible?.has('running-solid')} .mask=${runningMask} .value=${this.item?.running?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="strengthTraining.preResult" label="${lang`Strength training`}:" icon-name=${this.item?.gender == true ? "push-ups-solid" : "pull-ups-solid"} ?hidden=${!this.preResultVisible?.has('pull-ups-solid')} .mask=${pushUpMask} .value=${this.item?.strengthTraining?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="skiing.preResult" label="${lang`Skiing`}:" icon-name="skiing-solid" ?hidden=${!this.preResultVisible?.has('skiing-solid')} .mask=${skiingMask} .value=${this.item?.skiing?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="rollerSkiing.preResult" label="${lang`Roller skiing`}:" icon-name="roller-skiing-solid" ?hidden=${!this.preResultVisible?.has('roller-skiing-solid')} .mask=${rollerSkiingMask} .value=${this.item?.rollerSkiing?.preResult} @input=${this.validateInput}></simple-input>
                    <simple-input id="jumping.preResult" label="${lang`Jumping`}:" icon-name="jumping-solid" ?hidden=${!this.preResultVisible?.has('jumping-solid')} .mask=${jumpingMask} .value=${this.item?.jumping?.preResult} @input=${this.validateInput}></simple-input>
                </groupbox-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    gotoSportsmanPage() {
        if (!this.item?.sportsmanUlid) {
            return
        }
        location.hash = "#my-sportsman";
        location.search = `?sportsman=${this.item?.sportsmanId.split(':')[1]}`
    }

    validateInput(e) {
        let id = e.target.id.split('.')

        let currentItem = this.item

        if (id.length === 1) {
            id = id[0]
        }
        else {
            currentItem = this.item[id[0]] ??= {}
            id = id.at(-1)
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

        if (id === 'birthday' || id === 'gender') {
            try {
                this.changeAgeGroup()
                this.requestUpdate()
            }
            catch {

            }
        }

        if (id === 'region') {
            this.$id('club').setValue('')
            this.clubDataSource.regionFilter(currentItem.region?._id)
        }

        this.isModified = this.oldValues.size !== 0;
    }

    async findSportsmanByName(e) {
        const target = e.target
        let sportsman
        const lastName = target.value
        if (target.isShowList)
            target.isShowList = false
        if (!lastName) {
            await this.errorDialog('Вы не задали фамилию для поиска')
            return
        }
        sportsman = await SportsmanDataset.getItemByLastName(lastName)
        if (sportsman.rows.length === 0) {
            this.showDialog('Такой спортсмен не найден')
            return
        }

        if (sportsman.rows.length >= 1) {
            this.findDataSource = {}
            this.findDataSource.items = sportsman.rows.map(item => item.doc)
            target.isShowList = true
            return
        }
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
                this.showDialog('Такой спортсмен не найден')
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
            sportsman = await SportsmanDataset.getItemBySportsmanPC(value)
            if (sportsman.rows.length === 0) {
                this.showDialog('Такой спортсмен не найден')
                return
            }
            if (sportsman.rows.length > 1) {
                this.showDialog('Найдено несколько спортсменов с таким ID')
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
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            this.item.sportsmanId = sportsman._id
            // Object.assign(this.item, sportsman)
            this.requestUpdate()
        } else {
            this.showDialog('Такой спортсмен не найден')
        }
    }

    sportsmanChoose(e) {
        let sportsman = e.detail
        if (sportsman) {
            const inputs = this.$id()
            inputs.forEach(input => {
                if (input.id in sportsman) {
                    input.setValue(sportsman[input.id])
                }
            })
            this.item.sportsmanId = sportsman._id
            //Object.assign(this.item, sportsman)
            this.requestUpdate()
        }
    }

    async showDialog(message, type='message', title='') {
        const modalDialog = this.renderRoot.querySelector('modal-dialog')
        modalDialog.type = type
        if (title) {
            modalDialog.title = title
        }
        return modalDialog.show(message);
    }

    async confirmDialog(message) {
        return this.showDialog(message, 'confirm')
    }

    async errorDialog(message) {
        return this.showDialog(message, 'error', 'Ошибка')
    }

    changeAgeGroup() {
        const gender = this.$id('gender').value
        const year = new Date(this.$id('birthday').value).getFullYear()
        if ((gender || gender === 0) && year) {
            const ageGroupComponent = this.$id('ageGroup')
            const nowYear = new Date(this.parent.startDate).getFullYear()
            const age = nowYear - year
            const item = this.parent.ageGroups.find( item => item.gender == gender && age >= item.minAge && age <= item.maxAge)
            if (item) {
                ageGroupComponent.setValue(item)
            } else {
                // this.errorDialog("Такая возрастная группа в соревновании не найдена")
                delete this.item.ageGroup
                ageGroupComponent.setValue('')
            }
        }
    }

    startEdit() {
        let input = this.$id("lastName")
        input.focus()
        this.isModified = true
    }

    setVisibility() {
        if (!this.parent?.sportsDiscipline1)
            return
        this.preResultVisible = new Set()
        this.parent?.sportsDiscipline1?.ageGroups?.forEach(ageGroup => {
            ageGroup.sportsDisciplineComponents?.forEach(discipline => {
                this.preResultVisible.add(discipline.group?.icon)
            });
        });
    }

    update(changedProps) {
        super.update(changedProps);
        if (!changedProps) return;
        if (changedProps.has('parent')) {
            this.setVisibility()
        }
    }

    async firstUpdated() {
        super.firstUpdated();
        this.sportsCategoryDataSource = new SportsCategoryDataSource(this, await SportsCategoryDataset.getDataSet())
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
        this.clubDataSource = new ClubDataSource(this, await ClubDataset.getDataSet())
        this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
        this.trainerDataSource = new TrainerDataSource(this, await TrainerDataset.getDataSet())
        this.teamMemberDataSource = {items: [
            {name: 'region'},
            {name: 'club'},
        ]}
    }

}

customElements.define("my-competition-section-2-page-1", MyCompetitionSection2Page1);