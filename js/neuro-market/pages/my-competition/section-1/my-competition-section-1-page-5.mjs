import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

class MyCompetitionSection1Page4 extends BaseElement {
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
                <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d15539.474224670596!2d39.75727491917126!3d54.62237057131561!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sru!2sru!4v1701552244449!5m2!1sru!2sru" width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
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
    }
}

customElements.define("my-competition-section-1-page-4", MyCompetitionSection1Page4);