import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import RefereeTypeDataSource from '../../my-referee-types/my-referee-types-datasource.mjs'
import RefereeTypeDataset from '../../my-referee-types/my-referee-types-dataset.mjs'
import RefereeStageDataset from '../../my-referee-stages/my-referee-stages-dataset.mjs'
import RefereeStageDataSource from '../../my-referee-stages/my-referee-stages-datasource.mjs'
import SportsDisciplineDataset from '../../my-sports-disciplines/section-1/my-sports-disciplines-dataset.mjs'
import SportsDisciplineDataSource from '../../my-sports-disciplines/section-1/my-sports-disciplines-datasource.mjs'
import CityDataSource from '../../my-cities/my-cities-datasource.mjs'
import CityDataset from '../../my-cities/my-cities-dataset.mjs'

class MyRefereeSection2Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            refereeTypeDataSource: {type: Object, default: null},
            refereeStageDataSource: {type: Object, default: null},
            sportsDisciplineDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
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
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-select id="name" icon-name="referee-solid" @icon-click=${() => this.showPage('my-referee-types')} label="Name:" .dataSource=${this.refereeTypeDataSource} .value=${this.item?.name} @input=${this.validateInput}></simple-select>
                <simple-select id="stage" icon-name="order-number-solid" @icon-click=${() => this.showPage('my-referee-stages')} label="Stage:" .dataSource=${this.refereeStageDataSource} .value=${this.item?.stage} @input=${this.validateInput}></simple-select>
                <simple-select id="sportsDiscipline1" icon-name="category-solid" @icon-click=${() => this.showPage('my-sports-disciplines')} label="Sports discipline 1:" .dataSource=${this.sportsDisciplineDataSource} .value=${this.item?.sportsDiscipline1} @input=${this.validateInput}></simple-select>
                <simple-select id="sportsDiscipline2" icon-name="category-solid" @icon-click=${() => this.showPage('my-sports-disciplines')} label="Sports discipline 2:" .dataSource=${this.sportsDisciplineDataSource} .value=${this.item?.sportsDiscipline2} @input=${this.validateInput}></simple-select>
                <simple-select id="city" icon-name="city-solid" @icon-click=${() => this.showPage('my-cities')} label="City name:" .dataSource=${this.cityDataSource} .value=${this.item?.city} @input=${this.validateInput}></simple-select>
                <div class="name-group">
                    <simple-input type="date" label="Дата начала:" id="startDate" icon-name="calendar-days-solid" .value=${this.item?.startDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                    <simple-input type="date" label="Дата окончания:" id="endDate" icon-name="calendar-days-solid" .value=${this.item?.endDate} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                </div>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
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
        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.refereeTypeDataSource = new RefereeTypeDataSource(this, await RefereeTypeDataset.getDataSet())
        this.sportsDisciplineDataSource = new SportsDisciplineDataSource(this, await SportsDisciplineDataset.getDataSet())
        this.refereeStageDataSource = new RefereeStageDataSource(this, await RefereeStageDataset.getDataSet())
        this.cityDataSource = new CityDataSource(this, await CityDataset.getDataSet())
    }

}

customElements.define("my-referee-section-2-page-1", MyRefereeSection2Page1);