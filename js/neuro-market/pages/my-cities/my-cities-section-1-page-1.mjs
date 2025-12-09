import { BaseElement, html, css } from '../../../base-element.mjs'

import lang from '../../neuro-market-dictionary.mjs'
import '../../../../components/inputs/simple-input.mjs'

import '../../../../components/selects/simple-select.mjs'

import RegionDataset from '../my-regions/my-regions-dataset.mjs'
import RegionDataSource from '../my-regions/my-regions-datasource.mjs'

import CityTypesDataset from '../my-city-types/my-city-types-dataset.mjs'
import CityTypesDataSource from '../my-city-types/my-city-types-datasource.mjs'

class MyCitiesSection1Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            regionDataSource: {type: Object, default: null},
            cityTypesDataSource: {type: Object, default: null},
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
                <simple-input id="name" icon-name="city-solid" label="${lang`City name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-select id="type" @icon-click=${() => this.showPage('my-city-types')} icon-name="city-type-solid" label="${lang`City type`}:" .dataSource=${this.cityTypesDataSource} .value=${this.item?.type} @input=${this.validateInput}></simple-select>
                <simple-select id="region" @icon-click=${() => this.showPage('my-regions')} icon-name="region-solid" label="${lang`Region`}:" .dataSource=${this.regionDataSource} .value=${this.item?.region} @input=${this.validateInput}></simple-select>
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
        this.cityTypesDataSource = new CityTypesDataSource(this, await CityTypesDataset.getDataSet())
    }
}

customElements.define("my-cities-section-1-page-1", MyCitiesSection1Page1);