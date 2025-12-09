import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('simple-select', class SimpleSelect extends BaseElement {
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
            .options_list-ccd {
                padding: 0 8px;
                position: absolute;
                bottom: -12px;
                box-sizing: border-box;
                width: calc(100% + 2px);
                border-radius: 12px;
                z-index: 999;
                background: var(--control-overlay-bg);
                color: var(--text-primary);
                overflow: hidden;
                transition: opacity .2s ease-in-out,border .2s ease-in-out;
                transform: translateY(100%);
                box-shadow: var(--shadow-overlay);
            }
            .options_list-ccd .options_list_scrollbars-content-ccd {
                height: 100%;
                max-height: 192px;
            }
            .options_list-ccd .options_list_scrollbars-content-ccd {
                display: block!important;
            }
            .scrollbar-992 {
                position: relative;
                height: 100%;
                flex: 1 1 auto;
                max-height: 100%;
            }

            .scrollbar-992:after, .scrollbar-992:before {
                content: "";
                position: absolute;
                height: 0;
                box-shadow: none;
                z-index: 10;
                background: linear-gradient(180deg,var(--background-modal) 0,transparent 100%);
                opacity: 0;
                transition: opacity .4s ease-in-out,height .4s ease-in-out;
                pointer-events: none;
            }
            .scrollbar-992:before {
                top: -1px;
            }
            .options_list-ccd .options_list_scrollbars-content-ccd {
                height: 100%;
                max-height: 192px;
            }
            .options_list-ccd .options_list_scrollbars-content-ccd {
                display: block!important;
            }
            .scrollbar_scrollbars-992 {
                width: 100%;
                height: 100%;
            }
            .scrollbar_scrollbars__content-992 {
               display: block!important;
            }
            .options_list__options_wrapper-ccd {
                padding: 8px 0;
            }
            .options_list_unit-e62 {
                font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
                font-size: 16px;
                line-height: 20px;
                font-weight: 400;
                display: flex;
                flex-direction: row;
                justify-content: unset;
                min-height: 48px;
                padding: 16px;
                word-spacing: .1px;
                cursor: pointer;
                transition: color .2s ease-in-out,background .2s ease-in-out;
                border-radius: 8px;
            }
            .options_list_unit__main-e62:has(:only-child) {
                justify-content: center;
            }
            .options_list_unit__main-e62 {
                display: flex;
                flex-direction: column;
            }
            .options_list_unit-e62 .options_list_unit__label-e62 {
                pointer-events: none;
            }

            .typography-b1b.typography_p1-b1b {
                font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
                font-size: 16px;
                line-height: 20px;
                font-weight: 400;
            }
            .typography-b1b.typography_css_vars-b1b {
                color: var(--text-primary);
            }
            .typography-b1b {
                text-align: var(--text-align);
                color: var(--color);
            }
            p {
                margin: 0;
            }
            .options_list__not_found-ccd {
                font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
                font-size: 16px;
                line-height: 20px;
                font-weight: 400;
                color: var(--text-secondary);
                display: none;
                justify-content: center;
                min-height: 48px;
                padding: 16px;
                word-spacing: .1px;
            }
            .scrollbar-992:after {
                bottom: -1px;
                transform: matrix(1,0,0,-1,0,0);
            }
            .scrollbar-992:after, .scrollbar-992:before {
                content: "";
                position: absolute;
                height: 0;
                box-shadow: none;
                z-index: 10;
                background: linear-gradient(180deg,var(--background-modal) 0,transparent 100%);
                opacity: 0;
                transition: opacity .4s ease-in-out,height .4s ease-in-out;
                pointer-events: none;
            }

.form_dadata__informer_wrapper-8e6>* {
    font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
}
.field_informer-501>div:first-child {
    padding-top: 8px;
}
.field_informer__tooltip-501 svg {
    width: 16px;
    height: 16px;
    align-self: flex-start;
    flex-shrink: 0;
    margin-right: 4px;
}
.form_dadata__informer_wrapper-8e6>* {
    font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
}

.select_dadata_container-556 {
    position: relative;
}

.select_dadata-556.select_dadata_focus-556 {
    border-radius: 8px;
}
.select_dadata_focus-556.select_dadata-556, .select_dadata_nr-form-field-556.select_dadata_focus-556 {
    border-color: var(--elements-accent, #476bf0);
}

.select_dadata-556, .select_dadata_nr-form-field-556 {
    position: relative;
    border-radius: 8px;
    border: 1px solid var(--elements-control-border);
    background-color: var(--background-primary);
    transition: border .2s ease-in-out;
    height: 56px;
}
.select_dadata-556.select_dadata_active-556 .select_dadata__label-556, .select_dadata-556.select_dadata_focus-556 .select_dadata__label-556 {
    font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
}
.select_dadata-556.select_dadata_focus-556 .select_dadata__label-556 {
    color: var(--text-accent)!important;
}
.select_dadata_active-556.select_dadata-556 .select_dadata__label-556, .select_dadata_active-556.select_dadata-556 .select_dadata_nr-form-field__label-556, .select_dadata_nr-form-field-556.select_dadata_active-556 .select_dadata__label-556, .select_dadata_nr-form-field-556.select_dadata_active-556 .select_dadata_nr-form-field__label-556 {
    font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
    font-size: 14px;
    line-height: 16px;
    font-weight: 400;
    transform: translateY(-10px);
}
.select_dadata__label-556, .select_dadata_nr-form-field__label-556 {
    font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
    position: absolute;
    top: 18px;
    right: 16px;
    left: 16px;
    color: var(--text-secondary,#696e82);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    pointer-events: none;
    transition: .2s ease-in-out;
}
.select_dadata__input_wrapper-556 {
    transition: background-color .2s ease-in-out;
    flex: 1 1;
    border-radius: 4px;
    margin: 4px;
    height: calc(100% - 8px);
}
.select_dadata__input-556, .select_dadata_nr-form-field__input-556 {
    width: 100%;
    height: 100%;
    padding: 28px 16px 7px;
    border-radius: 8px;
    color: var(--text-primary);
    border: none;
    background: transparent;
}
.select_dadata__input-556 {
    font-family: Gazprombank Sans Base,Helvetica,Arial,sans-serif;
    font-size: 16px;
    line-height: 20px;
    font-weight: 400;
    color: var(--text-primary);
    padding: 24px 16px 4px 12px;
    border-radius: 4px;
}
.select_dadata-556.select_dadata_active-556.select_dadata_success-556 .select_dadata__input-556 {
    padding-right: 76px;
}
.select_dadata_nr-form-field-556.select_dadata_success-556 .select_dadata__success-556, .select_dadata_nr-form-field-556.select_dadata_success-556 .select_dadata_nr-form-field__success-556, .select_dadata_nr-form-field-556.select_dadata_success_disabled-556 .select_dadata__success-556, .select_dadata_nr-form-field-556.select_dadata_success_disabled-556 .select_dadata_nr-form-field__success-556, .select_dadata_success-556.select_dadata-556 .select_dadata__success-556, .select_dadata_success-556.select_dadata-556 .select_dadata_nr-form-field__success-556, .select_dadata_success_disabled-556.select_dadata-556 .select_dadata__success-556, .select_dadata_success_disabled-556.select_dadata-556 .select_dadata_nr-form-field__success-556 {
    opacity: 1;
}
.select_dadata__icons-556>div:last-of-type {
    right: 16px;
}
.select_dadata__success-556, .select_dadata_nr-form-field__success-556 {
    width: 24px;
    height: 24px;
    font-size: 0;
    line-height: 0;
    position: absolute;
    top: 50%;
    right: 16px;
    transform: translateY(-50%);
    border-radius: 50%;
    pointer-events: none;
    opacity: 0;
    transition: opacity .1s ease-in-out;
}
.scrollbar-992:after, .scrollbar-992:before {
    content: "";
    position: absolute;
    height: 0;
    box-shadow: none;
    z-index: 10;
    background: linear-gradient(180deg,var(--background-modal) 0,transparent 100%);
    opacity: 0;
    transition: opacity .4s ease-in-out,height .4s ease-in-out;
    pointer-events: none;
}
        `;
    }
    // firstUpdated(setPath = false) {
    // }

    render() {
        return html`
<div class="step_form_fields__dadata-006">
    <div class="select_dadata_container-556">
      <div class="select_dadata-556 select_dadata_active-556 select_dadata_focus-556 select_dadata_success-556 undefined">
        <span class="select_dadata__label-556">Фамилия</span>
        <div class="select_dadata__input_wrapper-556"><input class="select_dadata__input-556 form_dadata__input-8e6"
            autocomplete="off" name="surname" maxlength="40" type="text" placeholder="" value="Антошкин"></div>
        <div class="select_dadata__icons-556">
          <div class="select_dadata__success-556"><svg xmlns="http://www.w3.org/2000/svg" fill="none">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12" class="progressive_icon progressive_icon12">
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M10.117 1.803c.289.19.369.577.18.865l-4.28 6.68c-.417.652-.626.979-.931 1.03a.7.7 0 0 1-.159.01c-.308-.018-.552-.32-1.04-.922L1.823 6.917a.625.625 0 0 1 .97-.788l2.168 2.668s3.155-5.089 4.29-6.815a.625.625 0 0 1 .866-.18Z"
                  fill="#1C1C1E"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" class="progressive_icon progressive_icon16">
                <path
                  d="M10.986 5.105a.64.64 0 0 1 .183.887L8.22 10.596c-.401.627-.602.941-.897.983a.656.656 0 0 1-.11.006c-.299-.009-.533-.298-1.003-.877L4.843 9.02a.64.64 0 0 1 .994-.807l1.401 1.722s2.292-3.78 2.861-4.647a.64.64 0 0 1 .887-.183Z"
                  fill="#1C1C1E"></path>
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M15 8A7 7 0 1 1 1 8a7 7 0 0 1 14 0Zm-1.25 0a5.75 5.75 0 1 1-11.5 0 5.75 5.75 0 0 1 11.5 0Z"
                  fill="#1C1C1E"></path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" class="progressive_icon progressive_icon20">
                <path
                  d="M13.62 6.623a.75.75 0 0 1 .215 1.04l-3.407 5.307c-.469.73-.703 1.094-1.047 1.14a.749.749 0 0 1-.113.006c-.348-.007-.622-.343-1.169-1.015l-1.581-1.943a.75.75 0 0 1 1.164-.946l1.61 1.979s2.34-3.91 3.29-5.353a.75.75 0 0 1 1.039-.215Z"
                  fill="#1C1C1E"></path>
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-1.5 0a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0Z" fill="#1C1C1E">
                </path>
              </svg>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="progressive_icon progressive_icon24">
                <path
                  d="M16.492 8.764a.75.75 0 0 0-.214-1.039.757.757 0 0 0-1.039.215c-.773 1.108-4.175 6.693-4.175 6.693l-2.082-2.556a.75.75 0 1 0-1.164.946l1.9 2.347c.628.776.943 1.164 1.343 1.168a.845.845 0 0 0 .112-.007c.398-.049.666-.47 1.203-1.312l4.117-6.455Z"
                  fill="#1C1C1E"></path>
                <path fill-rule="evenodd" clip-rule="evenodd"
                  d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10Zm8.5-10a8.5 8.5 0 1 1-17 0 8.5 8.5 0 0 1 17 0Z"
                  fill="#1C1C1E"></path>
              </svg>
            </svg>
          </div>
        </div>
      </div>
      <div class="options_list-ccd select_dadata__list-556">
        <div class="options_list_scrollbars-content-ccd scrollbar-992 ">
          <div class="ScrollbarsCustom" style="position: relative; height: 120px; max-height: 100%;">
            <div class="ScrollbarsCustom-Wrapper options_list_scrollbars-content-ccd scrollbar_scrollbars-992"
              style="position: absolute; overflow: hidden;">
              <div data-ios-scroll="true" class="" style="position: absolute; inset: 0px; overflow: hidden;">
                <div class="ScrollbarsCustom-Content scrollbar_scrollbars__content-992" style="display: table-cell;">
                  <div class="options_list__options_wrapper-ccd">
                    <div data-index="0" class="options_list_unit-e62">
                      <div class="options_list_unit__main-e62" data-index="0">
                        <p class="typography-b1b typography_p1-b1b options_list_unit__label-e62 typography_css_vars-b1b"
                          style="--color: #1e222e; --text-align: initial;">Антошкина</p>
                      </div>
                    </div>
                    <div data-index="1"
                      class="options_list_unit-e62 options_list_unit_chosen-e62 options_list_unit_selected-e62">
                      <div class="options_list_unit__main-e62" data-index="1">
                        <p class="typography-b1b typography_p1-b1b options_list_unit__label-e62 typography_css_vars-b1b"
                          style="--color: #1e222e; --text-align: initial;">Антошкин</p>
                      </div>
                    </div>
                    <div class="options_list__not_found-ccd">Ничего не нашлось. Попробуйте написать по-другому</div>
                  </div>
                </div>
              </div>
            </div>
            <div
              class="ScrollbarsCustom-Track ScrollbarsCustom-TrackY options_list_scrollbars-trackY-ccd scrollbar_scrollbars__trackY-992"
              style="display: none;">
              <div class="ScrollbarsCustom-Thumb ScrollbarsCustom-ThumbY scrollbar_scrollbars__thumbY-992"
                style="height: 0px; display: none;"></div>
            </div>
            <div class="ScrollbarsCustom-Track ScrollbarsCustom-TrackX scrollbar_scrollbars__trackX-992"
              style="display: none;">
              <div class="ScrollbarsCustom-Thumb ScrollbarsCustom-ThumbX scrollbar_scrollbars__thumbX-992"
                style="width: 0px; display: none;"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="field_informer__wrapper-501 form_dadata__informer_wrapper-8e6" data-test-id="form-info-surname">
      <div class="field_informer-501"></div>
    </div>
  </div>
    `
    }
});
