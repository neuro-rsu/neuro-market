import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import '../buttons/icon-button.mjs'

import styles from './input-css.mjs'

customElements.define("simple-input", class SimpleInput extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'text'},
            required: { type: Boolean, default: false},
            label: { type: String, default: '' },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            imageName: { type: String, default: '', attribute: 'image-name'},
            errorImage: { type: String, default: 'error-image', attribute: 'error-image'},
            buttonName: { type: String, default: '', attribute: 'button-name' },
            dataSource: {type: Object, default: null},
            placeholder: { type: String, default: '' },
            value: { type: String, default: ''},
            currentObject: { type: Object, default: undefined},
            lang: { type: String, default: ''},
            listLabel: { type: Function, default: null, attribute: 'list-name'},
            showValue: { type: Function, default: null, attribute: 'show-value'},
            isShowList: {type: Boolean, default: false},
            mask: {type: Function, default: undefined},
            textAlign: { type: Boolean, default: false, attribute: 'text-align'},
            listLabel: { type: Function, default: null, attribute: 'list-name'},
            listStatus: { type: Function, default: null, attribute: 'list-status'},
            listIcon: { type: Function, default: null, attribute: 'show-value'},
        }
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
                    padding: 8px;
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
                    position: relative;
                    height: 28px;
                    aspect-ratio: 1 / 1;
                    position: absolute;
                    left: 8px;
                }
                .text-align {
                    text-align: var(--text-align, left)
                }


            `
        ]
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        if (!this.iconName) {
            return ''
        }
        return html`
            <simple-icon class="icon" icon-name=${this.iconName} @click=${() => this.fire("icon-click")}></simple-icon>
        `
    }

    get #image() {
        if (!this.imageName) {
            return this.#icon
        }
        return html`
            <img src=${this.imageName} alt="" title=${this.title || nothing} @error=${this.defaultImage} @click=${() => this.fire("icon-click")}/>
        `
    }

    defaultImage(e) {
        e.target.src = `images/${this.errorImage}.svg`
        e.onerror = null
    }

    buttonClick() {
        this.fire("button-click")
        this.$qs('input').focus()
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName} @click=${this.buttonClick}></simple-icon>
        `
    }

    fio(item) {
        if (!item) {
            return item
        }
        let result = item.lastName
        if (item.firstName) {
            result += ` ${item.firstName}`
        }
        if (item.middleName) {
            result += ` ${item.middleName[0]}.`
        }
        return result
    }

    get #list() {
        return html`
          <div class="options-list" @mouseenter=${this.listInFocus} @mouseleave=${this.listOutFocus}>
              ${this.dataSource?.items?.map((item, index) =>
                  html `
                    <icon-button
                        label=${this.listLabel?.(item) ??  this.fio(item) ?? item.name}
                        title=${ item.sportsmanId || item?._id }
                        icon-name=${this.listIcon?.(item) ?? this.iconName}
                        image-name=${ item.gender == 0 ? "images/sportsman-man-solid.svg" : "images/sportsman-woman-solid.svg" }
                        .status=${ this.listStatus?.(item) }
                        @click=${() => this.selectItem(index, item)}
                    >
                    </icon-button>
              `)}
          </div>
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
                    .value=${this.showValue?.(this.value) || this.value || ''}
                    lang=${this.lang || nothing}
                    @input=${this.changeValue}
                    @focus=${this.changeFocus}
                    @blur=${this.changeBlur}
                    @beforeinput=${this.mask ? this.beforeinput : nothing}
                    class=${this.textAlign ? 'text-align' : nothing}
                    @keydown=${this.keyDown}
                >
                ${this.#image}
                ${this.buttonName ? this.#button : ''}
            </div>
            <slot name="informer"></slot>
            ${this.isShowList ? this.#list : ''}
        `;
    }

    keyDown(e) {
        switch (e.key) {
            case "Enter":
                // this.isFocus = true;
                break;
            case "Escape":
                this.isShowList = false;
                break;
            default:
                return;
        }
    }
    beforeinput(e) {
        this.mask(e)
    }

    focus() {
        this.#input.focus()
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeFocus(e) {
        this.isShowList = false;
    }

    changeBlur(e) {
        if (this.isShowList)
            return
    }

    selectItem(index, item) {
        this.isShowList = false;
        this.fire('select-item', item)
    }

    changeValue(e) {
        this.value = e.target.value;
    }
});