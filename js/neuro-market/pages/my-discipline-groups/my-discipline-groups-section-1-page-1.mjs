import { BaseElement, html, css, nothing } from '../../../base-element.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import '../../../../components/inputs/simple-input.mjs'

class MyDisciplineGroupsSection1Page1 extends BaseElement {
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
                <simple-input id="name" icon-name=${this.item?.icon || nothing} label="${lang`Group name`}:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="icon" icon-name="picture-circle-solid" label="${lang`Icon`}:" .value=${this.item?.icon} @input=${this.validateInput}></simple-input>
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

        if (e.target.id === 'name' || e.target.id === 'icon') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        if (e.target.id === 'icon') {
                this.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

}

customElements.define("my-discipline-groups-section-1-page-1", MyDisciplineGroupsSection1Page1);