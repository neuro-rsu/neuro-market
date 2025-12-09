import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('icon-button', class IconButton extends BaseElement {
    static get properties() {
        return {
            label: { type: String, default: '' },
            name: { type: String, default: '', isIcon: true },
            imageName: { type: String, default: '', attribute: 'image-name'},
            iconName: { type: String, default: '', attribute: 'icon-name'},
            errorImage: { type: String, default: 'error-image', attribute: 'error-image'},
            title: { type: String, default: '' },
            status: {type: Object, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    vertical-align: middle;
                    height: 60px;
                    max-width: 100%;
                }
                .container {
                    display: flex;
                    width: 100%;
                    height: 100%;
                    align-items: center;
                    gap: 5px;
                }
                .content {
                    display: flex;
                    overflow: hidden;
                    flex-direction: column;

                }
                .picture {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: var(--icon-height, 80%);
                    aspect-ratio: 1 / 1;
                    margin-left: 2px;
                }
                .status-icon {
                    position: absolute;
                    right: 0;
                    bottom: 0;
                    width: 20px;
                    height: 20px;
                    background-color: red;
                }
                h1 {
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    font-weight: inherit;
                    &::before {
                        display: block;
                        content: attr(data-label);
                        font-weight: bold;
                        height: 0;
                        overflow: hidden;
                        visibility: hidden;
                    }
                }
                h2 {
                    margin: 0;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    font-size: 0.8rem;
                    color: lightgray;
                }
                img {
                    display: block;
                    line-height: 0;
                    border-radius: var(--border-radius, 0);
                    position: relative;
                    height: var(--image-height, 80%);
                    aspect-ratio: 1 / 1;
                }
                simple-icon {
                    display: block;
                    line-height: 0;
                    border-radius: 50%;
                    position: relative;
                    height: var(--simple-icon-height, 70%);
                    aspect-ratio: 1 / 1;
                }
                .status {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    simple-icon {
                        display: block;
                        line-height: 0;
                        border-radius: 50%;
                        position: relative;
                        height: 13px;
                        aspect-ratio: 1 / 1;
                    }
                }
            `
        ];
    }
    // /* simple-icon {
    //     width: 1rem;
    //     height: 1rem;
    //     background-color: red;
    //     border-radius: 50%;
    // } */

    // constructor() {
    //     super()
    //     this.status = {icon: 'sparkles-regular', text: 'Новый'}
    // }

    // firstUpdated() {
    //     super.firstUpdated();
    // }

    // get #status() {
    //     return html`
    //         <div class="status">
    //             <h2>${this.status?.name}</h2>
    //         </div>
    //     `
    // }

    get #icon() {
        return html`
            <div class="picture">
                <simple-icon class="icon" icon-name=${this.iconName}></simple-icon>
            </div>
        `
    }

    get #image() {
        return html`
            <div class="picture">
                <img src=${this.imageName} alt="" title=${this.title || nothing} @error=${this.defaultImage} />
            </div>
        `
    }

    defaultImage(e) {
        e.target.src = `images/${this.errorImage}.svg`
        e.onerror = null
    }

    get #statusIcon() {
        return html`
            <simple-icon icon-name=${this.status.icon}></simple-icon>
        `
    }

    get #status() {
        return html`
            <div class="status">
                ${this.status.icon ? this.#statusIcon : ''}
                <h2>${this.status?.name}</h2>
            </div>
        `
    }

    get #picture() {
        if (this.iconName) {
            return  this.#icon
        }
        if (this.imageName) {
            return this.#image
        }
        return ''
    }

    render() {
        return html`
            <div class="container">
                ${this.#picture}
                <div class="content">
                    <h1 data-label="${this.label}">${this.label}</h1>
                    ${this.status ? this.#status : ''}
                </div>
            </div>
        `;
    }
});
