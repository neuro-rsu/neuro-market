import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/checkbox-group-input.mjs'
import '../../../../../components/selects/simple-select.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

import AgeGroupDataset from '../../my-age-groups/my-age-groups-dataset.mjs'
import AgeGroupDataSource from '../../my-age-groups/my-age-groups-datasource.mjs'

class MyCompetitionSection1Page3 extends BaseElement {
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
                <simple-input type="text" id="path" label="${lang`Path kind`}:" icon-name="path-direction-solid" @icon-click=${this.copyToClipboard} .value=${this.item?.path} @input=${this.validateInput}></simple-input>
                <simple-input id="map" label="${lang`Google map`}:" icon-name="link-solid" @icon-click=${this.copyToClipboard} .value=${this.item?.map} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="latitude" label="${lang`Latitude`}:" icon-name="latitude-solid" .value=${this.item?.latitude} @input=${this.validateInput}></simple-input>
                    <simple-input id="longitude" label="${lang`Longitude`}:" icon-name="longitude-solid" .value=${this.item?.longitude} @input=${this.validateInput}></simple-input>
                </div>
                <iframe src=${this.item?.map || "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2309.74093246612!2d39.7485642764163!3d54.626170072688076!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4149e22d671256c5%3A0x147bb54d9f2efd26!2z0J_QsNC80Y_RgtC90LjQuiAi0JPRgNC40LHRiyDRgSDQs9C70LDQt9Cw0LzQuCI!5e0!3m2!1sru!2sru!4v1733243900155!5m2!1sru!2sru"} width="100%" height="450" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>

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

        // if (e.target.id === 'name' || e.target.id === 'startDate' || e.target.id === 'endDate' || e.target.id === 'stage') {
        //     this.parentNode.parentNode.host.requestUpdate()
        // }

        if (e.target.id === 'map') {
            this.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

    async firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("my-competition-section-1-page-3", MyCompetitionSection1Page3);