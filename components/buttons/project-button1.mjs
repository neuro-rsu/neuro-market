import { BaseElement, html, css } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('project-button', class ProjectButton extends BaseElement {
    static get properties() {
        return {
            label: { type: String, default: '' },
            name: { type: String, default: '', isIcon: true },
            avatar: { type: String, default: 'images/home/project-avatar.svg' },
            project: {type: Object, default: null},
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
                    gap: 10px;
                }
                .content {
                    display: flex;
                    overflow: hidden;
                    flex-direction: column;

                }
                .avatar {
                    position: relative;
                    height: 100%;
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
                .status {
                    display: flex;
                    align-items: center;
                    gap: 5px
                }
                simple-icon {
                    width: 1rem;
                    height: 1rem;
                    background-color: red;
                    border-radius: 50%;
                }
            `
        ];
    }

    constructor() {
        super()
        this.status = {icon: 'sparkles-regular', text: 'Новый'}
    }

    firstUpdated() {
        super.firstUpdated();
    }

    get #status() {
        return html`
            <div class="status" title=${
                (new Date(+this.status?.timestamp)).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit", second: "2-digit" })
            }>
                <simple-icon icon-name=${this.status?.status.toLowerCase()+'-status'} scale="0.9"></simple-icon>
                <h2>${this.status?.status}</h2>
            </div>
        `
    }

    render() {
        return html`
            <div class="container">
                <div class="avatar">
                    <img src=${this.avatar || 'images/home/project-avatar.svg'} alt="Логотип проекта" />
                </div>
                <div class="content">
                    <h1>${this.label}</h1>
                    ${this.#status}
                </div>
            </div>
        `;
    }
});
