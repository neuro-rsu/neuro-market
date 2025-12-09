import { BaseElement, html, css } from '../../js/base-element.mjs';

import { formStyles } from './modal-dialog-css.mjs'
import '../buttons/close-button.mjs';

import '../selects/simple-select.mjs'
import '../inputs/simple-input.mjs'

import DataSet from './my-sportsmen-dataset.mjs'

customElements.define('add-sportsman-dialog', class AddSportsmanDialog extends BaseElement {

    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            message: { type: String, default: 'Модальное окно'},
            opened: { type: Boolean, default: false},
            animateClose: { type: Boolean, default: false},
            item: { type: Object, default: {} },
            findItem: { type: Object, default: {} },
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    color: var(--form-color);
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
            <div id="dialog" class="modal-dialog ${this.opened ? 'show': ''} ${this.animateClose ? 'animate-close': ''}">
                <div class="modal-dialog-content animate" id="modal-dialog">
                    <div class="dialog-header">
                        <span id="dialog-title" class="dialog-title no-select">Message</span>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="dialog-body">
                        <simple-select id="name" icon-name="club-solid" @icon-click=${this.find} label="Club name:" .dataSource=${this.clubDataSource} .value=${this.item?.name} @input=${this.validateInput}></simple-select>
                        <simple-input id="hash" icon-name="id-number-solid" button-name="add-solid" @icon-click=${this.copyToClipboard}  @button-click=${this.find} label="Sportsman number:" .value=${this.item?.hash} @input=${this.validateInput}></simple-input>
                    </div>

                    <div class="dialog-footer no-select">
                        <div class="footer-buttons">
                            <button type="button" id="ok-button" class="footer-button btn-ok" @click=${()=>this.ok()}>OK</button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
    }

    async find(e) {
        let item = await DataSet.getItem(e.target.value)
        this.findItem = item
    }

    validateInput(e) {
        if (e.target.value !== "") {
            let id = e.target.id
            this.item[id] = e.target.value
        }
    }

    show(message) {
        this.message = message;
        this.opened = true;
        return new Promise( resolve => {
            this.modalResult = resolve;
        })
    }

    ok() {
        this.modalResult(this.findItem);
        this.opened = false;
    }

    close() {
        this.opened = false;
        this.modalResult('Close');
    }
});