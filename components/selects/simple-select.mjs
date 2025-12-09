import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/icon-button.mjs'

import styles from '../inputs/input-css.mjs'

customElements.define("simple-select", class SimpleInput extends BaseElement {
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
            listStatus: { type: Function, default: null, attribute: 'list-status'},
            showValue: { type: Function, default: null, attribute: 'show-value'},
            listIcon: { type: Function, default: null, attribute: 'show-value'},
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
                .hidden {
                    display: none;
                }
            `
        ]
    }

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
            ${this.label ? this.#label : ''}
            <div class="input-group">
                <input autocomplete="off"
                    type=${this.type}
                    placeholder=${this.placeholder || nothing}
                    ${this.required ? 'required' : ''}
                    .value=${this.showValue?.(this.value) || this.value?.name || ''}
                    @input=${this.changeValue}
                    @focus=${this.changeFocus}
                    @blur=${this.changeBlur}
                    @keydown=${this.keyDown}
                >
                ${this.imageName ? this.#image : this.#icon }
                ${this.buttonName ? this.#button : ''}
            </div>
            ${this.isFocus ? this.#list : ''}
        `;
    }

    get #list() {
      return html`
        <div class="options-list" @mouseenter=${this.listInFocus} @mouseleave=${this.listOutFocus}>
            ${this.dataSource?.items?.map((item, index) =>
                html `
                    <icon-button
                        id=${'o'+index}
                        label=${this.listLabel ? this.listLabel(item) : item.name}
                        title=${item._id}
                        icon-name=${this.listIcon?.(item) ?? this.iconName}
                        image-name=${item.flag ? 'https://hatscripts.github.io/circle-flags/flags/' + item.flag + '.svg' : ''}
                        .status=${this.listStatus?.(item) || this.statusDataSet?.get(item._id)}
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
        if (!this.isFocus) {
            this.isFocus = true
        }
        const value = e.target.value.toLowerCase()
        this.filterList(value)
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
        if (!(typeof this.value === 'object')){
            this.value = item;
            this.fire('input')
            return
        }
        if (this.value._id === item._id) {
            if (this.#input.value != this.showValue?.(item) ?? item.name) {
                this.#input.value = this.showValue?.(item) ?? item.name
            }
            if (this.value._rev !== item._rev) {
                this.value = item;
                this.fire('input')
            }
        }
        else {
            this.value = item;
            this.fire('input')
        }
    }

    keyDown(e) {
        switch (e.key) {
            case "Enter":
                this.isFocus = true;
                break;
            case "Escape":
                if (typeof this.value === 'object')  {
                    if (this.#input.value != this.showValue?.(this.value) ?? this.value.name)
                        this.#input.value = this.showValue?.(this.value) ?? this.value.name
                }
                this.isFocus = false
                this.isListFocus = false;
                break;
            default:
                return;
        }
    }

    filterList(value) {
        this.dataSource?.items?.forEach((item, index) => {
            const option = this.$id('o'+index)
            if (value&&!item.name.toLowerCase().includes(value)) {
                option?.classList.add('hidden');
            }
            else {
                option?.classList.remove('hidden');
            }

        });
        this.isFocus = true
        this.isListFocus = true;
    }

    listInFocus() {
        this.isListFocus = true;
    }

    listOutFocus(){
        this.isListFocus = false;
    }

});
