import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import './choose-input.mjs'

customElements.define("avatar-input", class AvatarInput extends BaseElement {
    static get properties() {
        return {
            value: { type: Object, default: {}},
            file: { type: Object, default: {}},
            avatar: { type: String, default: ''},
            isFirstUpdated: { type: Boolean, default: false},
            currentObject: { type: Object, default: undefined},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: block;
                }
                div {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    height: 100%;
                    overflow: hidden;
                }

                img {
                    height: 100%;
                    width: 100%;
                }
                #fileInput {
                    display: none;
                }
                simple-icon {
                    height: 100%;
                    width: 100%;
                }
                span {
                    font-weight: bold;
                    text-decoration: underline;
                    text-underline-offset: 2px;
                }
                span:hover {
                    filter: brightness(0.8);
                }

            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.isFirstUpdated = true;
    }

    clickButton() {
        this.$id("fileInput").click();
    }

    dropHandler(e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.items) {
          [...e.dataTransfer.items].forEach((item, i) => {
            if (item.kind === "file") {
              this.value = item.getAsFile();
              this.valueChange();
            }
          });
        } else {
          [...e.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
          });
        }
      }

    valueChange() {
       const event = new Event('input', {
            bubbles: true,
       });
       this.dispatchEvent(event);
    }

    dragOverHandler(e) {
        e.preventDefault();
    }

    changeFileInput(e) {
        this.value = e.target.files[0];
    }

    #showImage() {
        // if (this.src) {
        //      window.URL.revokeObjectURL(this.src)
        // }
        // this.src = window.URL.createObjectURL(this.value);
        //let reader = new FileReader();
        // reader.readAsDataURL(this.value);
        return html`
            <img src=${this.avatar} @click=${this.clickButton}>
        `
    }

    #showDefaultImage() {
        return html`<simple-icon icon-name="no-avatar" @click=${this.clickButton}></simple-icon>`
    }

    render() {
        return html`
            <div title="Drag & Drop or Click Me" @drop=${this.dropHandler} @dragover=${this.dragOverHandler}>
                <input type="file" id="fileInput" accept="image/*" @input=${this.changeFileInput}/>
                ${this.avatar ? this.#showImage() : this.isFirstUpdated ? this.#showDefaultImage(): ''}
            </div>
        `
    }
});