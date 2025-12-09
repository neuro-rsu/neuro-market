import { BaseElement, html, css, nothing } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/upload-input.mjs'

import DataSet from './my-profile-section-3-dataset.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

class MyProfileSection3Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
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
                <simple-input label="${lang`Insurance number`}:" id="number" icon-name="number-circle-solid" .value=${this.item?.payload?.number} .currentObject=${this.item?.payload} @input=${this.validateInput}></simple-input>
                <simple-input type="date" label="${lang`Insurance date`}:" id="date" icon-name="calendar-solid" .value=${this.item?.payload?.date} .currentObject=${this.item?.payload} @input=${this.validateInput} lang="ru-Ru"></simple-input>
                <upload-input label="${lang`File`}:" uploadLabel="${lang`Drag and drop file or browse`}" id="filename" .value=${this.item?.filename} @input=${this.validateInput} @icon-click=${this.downloadFile}></upload-input>
            </div>
        `;
    }

    async downloadFile(){
        this.avatar = await DataSet.downloadAvatar("insurance");
        // await this.saveToFile(blob, this.fio(this.currentItem).slice(0,-1))
        window.open(this.avatar)
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
}

customElements.define("my-profile-section-3-page-2", MyProfileSection3Page2);