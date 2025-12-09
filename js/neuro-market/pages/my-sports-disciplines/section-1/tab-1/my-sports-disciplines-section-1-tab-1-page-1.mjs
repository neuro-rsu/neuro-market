import { BaseElement, html, css, nothing } from '../../../../../base-element.mjs'

import lang from '../../../../neuro-market-dictionary.mjs'

import '../../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/selects/simple-select.mjs'

import DisciplineGroupDataset from '../../../my-discipline-groups/my-discipline-groups-dataset.mjs'
import DisciplineGroupDataSource from '../../../my-discipline-groups/my-discipline-groups-datasource.mjs'

class MySportsDisciplinesSection1Tab1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            disciplineGroupDataSource: {type: Object, default: null},
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
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name=${this.item?.icon || "category-solid"} label="${lang`Discipline name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="sortOrder" icon-name="order-number-solid" label="${lang`Sort order`}" .value=${this.item?.sortOrder} @input=${this.validateInput}></simple-input>
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

        if (e.target.id === 'name' || e.target.id === 'icon') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        if (e.target.id === 'icon') {
                this.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.disciplineGroupDataSource = new DisciplineGroupDataSource(this, await DisciplineGroupDataset.getDataSet())
        await this.disciplineGroupDataSource.init();
    }

}

customElements.define("my-sports-disciplines-section-1-tab-1-page-1", MySportsDisciplinesSection1Tab1Page1);