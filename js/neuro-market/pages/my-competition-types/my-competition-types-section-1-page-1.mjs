import { BaseElement, html, css } from '../../../base-element.mjs'

import lang from '../../neuro-market-dictionary.mjs'
import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/checkbox-input.mjs'

class MyCompetitionTypesSection1Page1 extends BaseElement {
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
                <simple-input id="name" icon-name="competition-solid" label="${lang`Competition name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <checkbox-input id="championship" label="${lang`Championship`}" .value=${this.item?.championship} .checked=${this.item?.championship} @input=${this.validateInput}></checkbox-input>
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

}

customElements.define("my-competition-types-section-1-page-1", MyCompetitionTypesSection1Page1);