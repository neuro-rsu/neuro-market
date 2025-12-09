import { BaseElement, html, css } from '../../../base-element.mjs'

import lang from '../../neuro-market-dictionary.mjs'
import '../../../../components/inputs/simple-input.mjs'

import '../../../../components/selects/simple-select.mjs'

import RegionDataSource from '../my-regions/my-regions-datasource.mjs'
import RegionDataset from '../my-regions/my-regions-dataset.mjs'

class MyCityTypesSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
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
                #region {
                    --icon-height: 90%;
                    --image-height: 90%
                }
            `
        ]
    }

    render() {
        return html`
            <div class="container">
                <simple-input id="name" icon-name="city-type-solid" label="${lang`City type name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="shortName" icon-name="city-type-short-solid" label="${lang`Short city type name`}:" .value=${this.item?.shortName} @input=${this.validateInput}></simple-input>
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

    showPage(page) {
        location.hash = page;
    }

    async firstUpdated() {
        super.firstUpdated();
        this.regionDataSource = new RegionDataSource(this, await RegionDataset.getDataSet())
    }
}

customElements.define("my-city-types-section-1-page-1", MyCityTypesSection1Page1);