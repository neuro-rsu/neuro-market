import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('country-button', class CountryButton extends BaseElement {
    static get properties() {
        return {
            label: { type: String, default: '' },
            name: { type: String, default: '', isIcon: true },
            imageName: { type: String, default: '', attribute: 'image-name'},
            iconName: { type: String, default: '', attribute: 'icon-name'},
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
                    margin: 1px;
                    height: 60px;
                    user-select: none;
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
                .icon {
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    height: 80%;
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
                    border-radius: 50%;
                    position: relative;
                    height: 100%;
                    aspect-ratio: 1 / 1;
                }
                simple-icon {
                    display: block;
                    line-height: 0;
                    border-radius: 50%;
                    position: relative;
                    height: 70%;
                    aspect-ratio: 1 / 1;
                }
                .status {
                    display: flex;
                    align-items: center;
                    gap: 5px
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
            <simple-icon class="icon" icon-name=${this.iconName}></simple-icon>
        `
    }

    get #image() {
        return html`
            <img src=${this.imageName} alt="Логотип проекта" />
        `
    }

    get #status() {
        return html`
            <div class="status">
                <h2>${this.status?.name}</h2>
            </div>
        `
    }

    render() {
        return html`
            <div class="container">
                <div class="icon">
                    ${this.imageName ? this.#image : this.#icon}
                </div>
                <div class="content">
                    <h1>${this.label}</h1>
                    ${this.status ? this.#status : ''}
                </div>
            </div>
        `;
    }
});
