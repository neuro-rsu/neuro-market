import { BaseElement, html, css, nothing } from '../../../../../base-element.mjs'

import lang from '../../../../neuro-market-dictionary.mjs'

import '../../../../../../components/inputs/simple-input.mjs'
import '../../../../../../components/tables/simple-table.mjs'

class MySportsDisciplinesSection1Tab3Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
            currentPage: { type: BigInt, default: 0, local: true },
            currentRow: { type: BigInt, default: 0, local: true },
            women: {type: Object, default: null},
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
                    color: white;
                }
            `
        ]
    }

    constructor () {
        super()
        this.columns = [[
            {
                name: "category",
                label: lang`Sports category`
            },
            {
                name: "points",
                label: lang`Points`
            }
        ]]
    }

    render() {
        return html`
            <div class="container">
                <simple-table @click=${this.tableClick} .columns=${this.columns} .rows=${this.item.women}></simple-table>
            </div>
        `;
    }

    validateInput(e) {
        if (!this.item.women) {
            this.item.women = []
        }
        let currentItem
        if (this.currentRow === -1 && this.isNew) {
            this.item.women.push({})
            this.isNew = false
        }

        currentItem = e.target.currentObject ?? this.item?.women.at(this.currentRow)

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

    tableClick(e) {
        if (typeof e.details === "number") {
            this.fire("table-click", e.details)
        }
        // this.currentPage = 1
        //this.currentRow = e.details
    }

}

customElements.define("my-sports-disciplines-section-1-tab-3-page-1", MySportsDisciplinesSection1Tab3Page1);