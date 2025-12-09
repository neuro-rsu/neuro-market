import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/selects/simple-select.mjs'

import CountryDataSource from '../my-countries/my-countries-datasource.mjs'
import CountryDataset from '../my-countries/my-countries-dataset.mjs'

class MyCompetitionsSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            countryDataSource: {type: Object, default: null},
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
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="user" label="Competition name:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="region" icon-name="flag-solid" label="Region name:" .value=${this.item?.region} @input=${this.validateInput}></simple-input>
                <simple-input id="flag" icon-name="flag-solid" label="Flag name:" .value=${this.item?.flag} @input=${this.validateInput}></simple-input>
            </div>
        `;
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
        this.countryDataSource = new CountryDataSource(this, await CountryDataset.getDataSet())
    }

}

customElements.define("my-competitions-section-1-page-1", MyCompetitionsSection1Page1);