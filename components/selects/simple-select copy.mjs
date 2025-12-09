import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('simple-button', class SimpleButton extends BaseElement {
    static get properties() {
        return {
            _useInfo: { type: Boolean, default: true },
            label: { type: String, default: '' },
            textAlign: { type: String, default: 'center' },
            name: { type: String, default: '', isIcon: true },
            fill: { type: String, default: '' },
            color: { type: String, default: 'gray' },
            borderColor: { type: String, default: '' },
            back: { type: String, default: '#fdfdfd' },
            size: { type: Number, default: 24 },
            width: { type: String, default: '' },
            height: { type: String, default: '' },
            swh: { type: String, default: '' },
            border: { type: String, default: '1px' },
            radius: { type: String, default: '2px' },
            br: { type: String, default: '' },
            scale: { type: String, default: '0.9' },
            rotate: { type: Number, default: 0 },
            speed: { type: Number, default: 0 },
            blink: { type: Number, default: 0 },
            blval: { type: String, default: '1;0;0;1' },
            padding: { type: String, default: '' },
            toggledClass: { type: String, default: 'none' },
            notoggledClass: { type: String, default: 'notoggled' },
            toggled: { type: Boolean, default: false, reflect: true },
            path: { type: String, default: '' },
            icon: { type: Object, default: undefined }
        }
    }

    static get styles() {
        return css`
            :host {
                display: inline-block;
                vertical-align: middle;
                margin: 1px;
                user-select: none;
            }
            .simple-btn {
                display: flex;
                align-items: center;
                padding: 0 5px;
                cursor: pointer;
                height: 100%;
            }
            .simple-btn:hover {
                transition: .3s;
                filter: brightness(85%);
            }
            .simple-btn:active {
                transition: .1s;
                filter: brightness(70%);
            }
            .simple-btn:focus {
                outline:none;
            }
            .left90 {
                transition: .3s;
                transform: rotate(-90deg);
            }
            .right90 {
                transition: .3s;
                transform: rotate(90deg);
            }
            .left360 {
                transition: .3s;
                transform: rotate(-360deg);
            }
            .right360 {
                transition: .3s;
                transform: rotate(360deg);
            }
            .notoggled {
                transition: .3s;
                transform: rotate(0deg);
            }
            .ontoggled {
                transition: .3s;
                background-color: lightgray;
            }
            ._white {
                transition: .3s;
                background-color: white;
            }
        `;
    }
    firstUpdated(setPath = false) {
        super.firstUpdated();
        if (this.br) {
            let arr = this.br.split(':');
            this.border = arr[0] || this.border;
            this.radius = arr[1] || this.radius;
        }
        if (this.swh) {
            let arr = this.swh.split(':');
            this.size = arr[0] || this.size;
            this.width = arr[1] || this.width;
            this.height = arr[2] || this.height;
        }
    }
    get _icon() {
        let _icon = '{}';
        this.fill = this.fill || this.color;
        this.size = this.size || this.height || this.width;
        if (this.icon) _icon = JSON.stringify(this.icon);
        return html`<simple-icon class="${this.toggled ? this.toggledClass : this.notoggledClass}" icon=${_icon} icon-name="${this.name}" fill="${this.fill}" size="${this.size}" scale="${this.scale}"
            rotate="${this.rotate}" speed="${this.speed}" blink="${this.blink}" blval="${this.blval}" path="${this.path}"></simple-icon>`;
    }
    render() {
        return html`
<div class="redux_form_field_select-ea1 redux_form_field__field-ea1">
      <div class="select-c90 select_active-c90 select_success-c90">
        <span class="select__label-c90">Регион</span>
        <div class="select__input_wrapper-c90">
          <input class="select__input-c90" autocomplete="off" name="address_region" type="text" value="Рязанская область" />
          <div class="select__icons-c90">
            <div class="select__search-c90">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" class="progressive_icon progressive_icon12">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M7.892 8.702a4.374 4.374 0 1 1 1.06-1.06L11.03 9.72a.75.75 0 1 1-1.06 1.06L7.892 8.702Zm.607-3.578a3.124 3.124 0 1 1-6.249 0 3.124 3.124 0 0 1 6.249 0Z"
                    fill="#1C1C1E"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="progressive_icon progressive_icon16">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.75 7a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                    fill="#1C1C1E"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="progressive_icon progressive_icon20">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M12.477 13.89a6 6 0 1 1 1.414-1.414l2.816 2.817a1 1 0 0 1-1.414 1.414l-2.816-2.816ZM13.5 9a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0Z"
                    fill="#1C1C1E"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="progressive_icon progressive_icon24">
                  <path fill-rule="evenodd" clip-rule="evenodd"
                    d="M14.555 15.969a7.211 7.211 0 1 1 1.414-1.414l4.736 4.736a1 1 0 0 1-1.414 1.415l-4.736-4.737Zm1.368-5.758a5.711 5.711 0 1 1-11.423 0 5.711 5.711 0 0 1 11.423 0Z"
                    fill="#1C1C1E"></path>
                </svg>
              </svg>
            </div>
          </div>
        </div>
      </div>
      <div class="field_informer__wrapper-501" data-test-id="form-info-address_region">
        <div class="field_informer-501"></div>
      </div>
    </div>
    `
    }
});
