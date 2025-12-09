import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

class MyCompetitionSection1Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            competitionTypeDataSource: {type: Object, default: null},
            competitionStageDataSource: {type: Object, default: null},
            sportsDisciplineDataSource: {type: Object, default: null},
            cityDataSource: {type: Object, default: null},
            ageGroupDataSource: {type: Object, default: null},
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
                <checkbox-group-input id="ageGroups" label="${lang`Age groups`}:" .value=${this.item?.ageGroups || []} .dataSet=${this.ageGroupDataSource} @input=${this.validateInput}></checkbox-group-input>
            </div>
        `;
    }

    copyToClipboard(e) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(e.target.value)
        }
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (Array.isArray(e.target.value)) {
                this.oldValues.set(e.target, e.target.oldValue)
            } else {
                this.oldValues.set(e.target, e.target.value)
            }
        }
        else {
            const oldValue = this.oldValues.get(e.target)
            if (Array.isArray(oldValue) && oldValue.length === e.target.value.length) {
                if (e.target.value.every(item1 => oldValue.some( item2 =>
                    item1.name ===  item2.name &&
                    item1.gender ===  item2.gender
                ))) {
                    this.oldValues.delete(e.target)
                }
            } else if (oldValue === e.target.value) {
                this.oldValues.delete(e.target)
            }
        }

        currentItem[e.target.id] = e.target.value

        if (e.target.id === 'name' || e.target.id === 'startDate' || e.target.id === 'endDate' || e.target.id === 'stage') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.ageGroupDataSource = new AgeGroupDataSource(this, await AgeGroupDataset.getDataSet())
    }
}

customElements.define("my-competition-section-1-page-2", MyCompetitionSection1Page2);