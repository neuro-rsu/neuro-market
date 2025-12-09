import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/country-button.mjs'

import styles from '../inputs/input-css.mjs'

customElements.define("simple-table-header", class SimpleTableHeader extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            _useInfo: { type: Boolean, default: false },
            buttonName: { type: String, default: '', attribute: 'button-name' },
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            oldValue: { type: String, default: ''},
            isFocus: {type: Boolean, default: false},
            dataSource: {type: Object, default: null},
            currentItem: {type: Object, default: null},
            iconName: { type: String, default: 'project-avatar-solid', attribute: 'icon-name'},
            imageName: { type: String, default: '', attribute: 'image-name'},
            listLabel: { type: Function, default: null, attribute: 'list-name'},
            columns: {type: Object, default: null},
            rows: {type: Object, default: null},
        }
    }

    constructor(){
        super()
        this.isListFocus = false;
    }

    static get styles() {
        return [
            styles,
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    position: relative;
                    width: 100%;
                    color: var(--form-input-color, gray);
                    color: var(--form-label-input-color, white);
                }
                .options-list {
                    padding: 0 8px;
                    position: absolute;
                    bottom: -12px;
                    box-sizing: border-box;
                    width: calc(100% + 2px);
                    border-radius: 12px;
                    z-index: 999;
                    background: var(--control-overlay-bg, white);
                    color: var(--text-primary, black);
                    overflow: hidden;
                    transition: opacity .2s ease-in-out,border .2s ease-in-out;
                    transform: translateY(100%);
                    /* box-shadow: var(--shadow-overlay, 10px 5px 5px black); */
                    display: flex;
                    flex-direction: column;
                    icon-button {
                        height: 40px;
                        border-radius: 10px;
                        color: red;
                    }
                    icon-button:hover {
                        background-color: red;
                        color: white;
                    }
                }
                img {
                    display: block;
                    line-height: 0;
                    border-radius: 50%;
                    position: absolute;
                    height: 24px;
                    margin: 8px;
                    aspect-ratio: 1 / 1;
                }
                thead,
                tfoot {
                    background-color: var(--layout-background-color);
                }

                th,
                td {
                    text-align: center;
                    vertical-align: middle;
                    height: 2em;
                }
                tbody tr {
                    height: 2em;
                    &:nth-of-type(even) {
                        background-color: var(--layout-background-color);
                    }
                    &:hover{
                        background-color: rgba(255, 255, 255, 0.2);
                    }
                }
            `
        ]
    }
    // /* country-button {
    //     height: 40px;
    //     border-radius: 10px;
    // }
    // country-button:hover {
    //     background-color: red;
    // } */

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.oldValue ??= this.value;
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name=${this.iconName} @click=${() => this.fire("icon-click")}></simple-icon>
        `
    }

    get #image() {
        return html`
            <img src=${this.imageName} alt="" @click=${() => this.fire("icon-click")}/>
        `
    }
    // get value() {
    //     return this._value;
    // }

    // set value(value) {
    //     const oldValue = this.value;
    //     this._value = value;
    //     this.requestUpdate('value', oldValue);
    // }

    // get value() {
    //     return this.renderRoot?.querySelector('input')?.value ?? null;
    // }

    // set value(value) {
    //     const input = this.renderRoot?.querySelector('input');
    //     if (input) {
    //         input.value= value;
    //     }
    // }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName} @click=${() => this.fire("button-click")}></simple-icon>
        `
    }

    setValue(value) {
        this.value = value;
        this.fire('input')
    }

    render() {
        return html`
            <table id="example" class="display nowrap dataTable dtr-inline collapsed" style="width: 100%;" aria-describedby="example_info">
                <colgroup>
                    ${this.columns?.map((column, index) =>
                        html`
                            <col data-dt-column=${index}>
                        `
                    )}
                </colgroup>
                <thead>
                    <tr>
                        ${this.columns?.map((column, index) =>
                            html`
                                <th data-dt-column=${index} rowspan="1" colspan="1" class="dt-orderable-asc dt-orderable-desc    dt-ordering-asc" aria-sort="ascending" aria-label="Name: Activate to invert sorting" tabindex=${index}>
                                    ${column.label}
                                </th>
                            `
                        )}
                    </tr>
                </thead>
                <!-- <tbody>
                    ${this.rows?.map((row, index) =>
                        html`
                            <tr @click=${(e) => e.details = index}>
                                <td>${typeof row[this.columns[0].name] === 'object' ? row[this.columns[0].name].name : row[this.columns[0].name]}</td>
                                <td>${row[this.columns[1].name]}</td>
                            </tr>
                        `
                    )}
                </tbody> -->
                <!-- <tfoot>
                    <tr>
                        ${this.columns?.map((column, index) =>
                            html`
                                <th data-dt-column=${index} rowspan="1" colspan="1"><span class="dt-column-title">${column.name}</span></th>
                            `
                        )}
                    </tr>
                </tfoot> -->
            </table>
        `;
    }

    get #list() {
      return html`
        <div class="options-list" @mouseenter=${this.listInFocus} @mouseleave=${this.listOutFocus}>
            ${this.dataSource?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${this.listLabel ? this.listLabel(item) : item.name}
                        title=${item._id}
                        icon-name=${this.iconName}
                        image-name=${item.flag ? 'https://hatscripts.github.io/circle-flags/flags/' + item.flag + '.svg' : ''}
                        .status=${this.statusDataSet?.get(item._id)}
                        ?selected=${this.currentItem === item}
                        @click=${() => this.selectItem(index, item)}
                    >
                    </icon-button>
            `)}
        </div>
      `
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        this.dataSource?.items?.map((item, index) =>{})
    }

    changeFocus(e) {
        this.isFocus = true;
    }

    changeBlur(e) {
        if (this.isListFocus)
            return
        this.isFocus = false;
    }

    selectItem(index, item) {
        this.isFocus = false;
        this.isListFocus = false;
        this.value = item;
        this.fire('input')
    }

    keyDown(e) {
        switch (e.key) {
            case "Enter":
                this.isFocus = true;
                break;
            case "Escape":
                this.isFocus = false
                this.isListFocus = false;
                break;
            default:
                return;
        }
    }

    listInFocus() {
        this.isListFocus = true;
    }

    listOutFocus(){
        this.isListFocus = false;
    }

});