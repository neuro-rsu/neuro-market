import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import { formStyles } from './form-css.mjs'

import '../dialogs/modal-dialog.mjs';

import '../inputs/simple-input.mjs';
import '../inputs/radio-group-input.mjs';
import '../inputs/simple-informer.mjs';
import '../inputs/groupbox-input.mjs';
import '../buttons/close-button.mjs';
import '../buttons/form-button.mjs';
import '../buttons/link-button.mjs';


import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'

customElements.define("lot-form", class LotForm extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0'},
            opened: { type: Boolean, default: false},
            item: { type: Object, default: null},
        }
    }

    static get styles() {
        return [
            formStyles,
            css`
                :host {
                    user-select: none;
                    --form-label-input-color: black;
                }
                .form-footer {
                    display: flex;
                    justify-content: right;
                    gap: 10px;
                }
                .name-group {
                    display: flex;
                    gap: 10px;
                }
                .form {
                    width: 70%; /* Could be more or less, depending on screen size */
                    max-width: 700px;
                }

            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
        this.oldValues = new Map();
        this.items1 = [
            { name: 'По разрядам', checked: true },
            { name: 'По текущим местам' },
            { name: 'По предварительным результатам' },
            { name: 'Случайно' },
            { name: 'По личным рекордам' },
        ]
        this.items2 = [
            { name: 'Заканчивать первую группу', checked: true },
            { name: 'Не заканчивать группу' },
            { name: 'Заканчивать последнюю группу' },
        ]
        this.items3 = [
            { name: 'Лучшие в начале', checked: true },
            { name: 'Лучшие в конце' },
        ]
        this.items4 = [
            { name: 'В начале', checked: true },
            { name: 'В середине' },
            { name: 'В конце' },
        ]
        this.items5 = [
            { name: 'С учетом возрастных групп', checked: true },
            { name: 'Без учета возрастных групп' },
        ]

        this.item = {

        }
    }

    render() {
        return html`
            <div id="form-background" class="form-background" style=${this.opened ? 'display: block' : ''}>
                <modal-dialog></modal-dialog>
                <form class="form animate" method="post">
                    <div class="form-header">
                        <div class="form-tabs no-select">
                            <div class="form-tab" selected data-label=${lang`Sign in`}>${lang`Lot`}</div>
                        </div>
                        <close-button class="close-button no-select" name="times" @click=${()=>this.close('CANCEL')}></close-button>
                    </div>

                    <div class="form-body">
                        <div id="db-tab-section" class="form-tab-section selected">
                            <div class="name-group">
                                <simple-input id="shift.initial" label="${lang`Shooting initial shift`}:" icon-name="shift-solid" .value=${this.item?.shift?.initial} @input=${this.validateInput}></simple-input>
                                <simple-input id="shield.count" label="${lang`Number of shields`}:" icon-name="shield-solid" .value=${this.item?.shield?.count} @input=${this.validateInput}></simple-input>
                                <simple-input id="shield.initial" label="${lang`Initial shield`}:" icon-name="shield-solid" .value=${this.item?.shield?.initial} @input=${this.validateInput}></simple-input>
                            </div>
                            <div class="name-group">
                                <simple-input id="shift.start" label="${lang`Shift start time`}:" icon-name="clock-solid" .value=${this.item?.shift?.start} @input=${this.validateInput}></simple-input>
                                <simple-input id="shield.duration" label="${lang`Shift duration`}:" icon-name="hourglass-clock-solid" .value=${this.item?.shield?.duration} @input=${this.validateInput}></simple-input>
                            </div>
                            <div class="name-group">
                                <radio-group-input id="param1" label="${lang`Parameters of lot`}:" .items=${this.items1} @input=${this.validateInput}></radio-group-input>
                                <radio-group-input id="param2" label="${lang`End parameters`}:" .items=${this.items2} @input=${this.validateInput}></radio-group-input>
                            </div>
                            <div class="name-group">
                                <radio-group-input id="param3" label="${lang`Order of the lot`}:" .items=${this.items3} @input=${this.validateInput}></radio-group-input>
                                <radio-group-input id="param4" label="${lang`Best shield`}:" .items=${this.items4} @input=${this.validateInput}></radio-group-input>
                            </div>
                            <div class="name-group">
                                <radio-group-input id="param5" label="${lang`Lot age groups`}:" .items=${this.items5} @input=${this.validateInput}></radio-group-input>
                            </div>
                        </div>
                    </div>

                    <div class="form-footer">
                        <form-button @click=${this.startLot}>${lang`Start lot`}</form-button>
                        <form-button @click=${this.sendSimpleUser}>${lang`Cancel`}</form-button>
                    </div>
                </form>
            </div>
            `;
    }

    startLot() {
        console.log(this.item)

    }

    validateInput(e) {
        let id = e.target.id.split('.')

        let currentItem = this.item

        if (id.length === 1) {
            id = id[0]
        }
        else {
            currentItem = this.item[id[0]] ??= {}
            id = id.at(-1)
        }
        if (!this.oldValues.has(e.target)) {
            if (currentItem[id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[id] = e.target.value

        this.isModified = this.oldValues.size !== 0;
    }

    open() {
        this.opened = true;
        return new Promise((res, rej) => {
            this.resolveForm = res
            this.rejectFrom = rej
        })
    }

    close(modalResult) {
        this.opened = false

        if (modalResult == 'Ok')
            this.resolveForm(this.item)
        else
            this.rejectFrom(modalResult)
    }
})