import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/inputs/simple-input.mjs'
import '../../../../components/inputs/gender-input.mjs'

class MyAgeGroupsSection1Page1 extends BaseElement {
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
                <simple-input id="category" icon-name=${this.item?.gender=="1" ? "age-group-women-solid" : "age-group-solid"} label="Age group:" .value=${this.item?.category} @input=${this.validateInput}></simple-input>
                <div class="name-group">
                    <simple-input id="minAge" icon-name=${this.item?.gender=="1"  ? "age-min-group-women-solid" : "age-min-group-solid"} label="Min Age:" .value=${this.item?.minAge} @input=${this.validateInput}></simple-input>
                    <simple-input id="maxAge" icon-name=${this.item?.gender=="1" ? "age-max-group-women-solid" : "age-max-group-solid"} label="Max Age:" .value=${this.item?.maxAge} @input=${this.validateInput}></simple-input>
                </div>
                <gender-input id="gender" icon-name="gender" label="Gender:" .value="${this.item?.gender}" @input=${this.validateInput}></gender-input>
                <simple-input id="sortOrder" icon-name="order-number-solid" label="Sort order:" .value=${this.item?.sortOrder} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    showPage(page) {
        location.hash = page;
    }

    linkClick(e) {
        window.open(e.target.value);
    }

    ageGroupName() {
        return `${this.item.category} (${this.item.minAge}-${this.item.maxAge} лет)`
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
        if (e.target.id === "category" || e.target.id === "minAge" || e.target.id === "maxAge") {
            currentItem['name'] = this.ageGroupName()
            this.parentNode.parentNode.host.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

}

customElements.define("my-age-groups-section-1-page-1", MyAgeGroupsSection1Page1);