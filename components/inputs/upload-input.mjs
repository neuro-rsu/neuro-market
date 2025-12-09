import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'
import './choose-input.mjs'

customElements.define("upload-input", class UploadInput extends BaseElement {
    static get properties() {
        return {
            value: { type: Object, default: {} },
            label: { type: String, default: '' },
            file: { type: Object, default: {} },
            uploadLabel: { type: String, default: 'Drag and drop file or browse' },
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
                    padding-top: 10px;
                    width: 100%;
                    height: 100%;
                    margin-top: 10px;
                    /* outline: auto; */
                    border: solid white 2px;
                    border-radius: 10px;
                    overflow: hidden;
                    p {
                        text-align: center;
                        margin-top: 0;
                    }
                }
                #fileInput {
                    display: none;
                }
                simple-icon {
                    height: 50px;
                    width: 50px;
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
              const file = item.getAsFile();
              this.file = file;
              this.value ??= {}
              this.value.name = this.file.name;
              this.value.size = this.file.size;
              this.value.type = this.file.type;
              this.value.lastModified = this.file.lastModified;
              this.valueChangeMessage();;
            //   console.log(`… file[${i}].name = ${file.name}`);
            }
          });
        } else {
          [...e.dataTransfer.files].forEach((file, i) => {
            console.log(`… file[${i}].name = ${file.name}`);
          });
        }
      }

    dragOverHandler(e) {
        e.preventDefault();
    }

    changeFileInput(e) {
        this.file = e.target.files[0];
        this.value = e.target.files[0];
        // this.value ??= {}
        // this.value.name = this.file.name;
        // this.value.size = this.file.size;
        // this.value.type = this.file.type;
        // this.value.lastModified = this.file.lastModified;
        this.valueChangeMessage();
    }

    #dragAndDrop() {
        return html`
            <div @drop=${this.dropHandler} @dragover=${this.dragOverHandler} @click=${this.clickButton}>
                <input type="file" id="fileInput" multiple @input=${this.changeFileInput}/>
                <simple-icon icon-name="cloud-arrow-up-solid"></simple-icon>
                <p>${this.uploadLabel}</p>
            </div>
        `
    }

    #chosenFile() {
        return html`
            <choose-input .label=${this.label} .value=${this.value} icon-name="file-regular" button-name="trash-xmark-regular" @file-changed=${this.fileChanged} @input=${this.valueChanged}></choose-input>
        `
    }

    valueChanged(e) {
        this.value = e.target.value;
        this.valueChangeMessage();
    }

    fileChanged() {
        this.file = undefined;
        this.value = undefined;
        this.valueChangeMessage();
    }

    valueChangeMessage() {
        const options = {
            bubbles: true,
            composed: true
          };
        this.dispatchEvent(new CustomEvent('input', options));
    }

    render() {
        return this.value ? this.#chosenFile() : this.#dragAndDrop()
    }
});