import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

import '../icon/icon.mjs'

customElements.define('link-button', class LinkButton extends BaseElement {
    static get properties() {
        return {
            name: { type: String, default: ''},
            href: { type: String, default: '' },
            target: { type: String, default: '' },
            title: { type: String, default: '' },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    position: relative;
                    cursor: pointer;
                    background-color: var(--button-background-color, #ff0000);
                }
                :host(:hover) {
                    // background-color: var(--button-hover-background-color, #ed0016);
                    box-shadow: 0px 0px 2px 2px rgba(255,255,255,0.5);
                }
                :host(:active) {
                    background-color: var(--button-active-background-color, #ca0013);
                    box-shadow: 0px 0px 2px 2px rgba(255,255,255,0.5);
                }
                a {
                    display: block;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-size: 1rem;
                    text-decoration: none;
                    white-space: nowrap;
                    padding: 10px 30px;
                    font-weight: 600;
                    color: var(--native-color, white);
                }

                // :host(:hover) a::after,
                // :host(:hover) a::before,
                // {
                //     filter: brightness(2);
                // }
                // :host(::before) {
                //     content: '';
                //     position: absolute; /* Фиксируем на одном месте */
                //     left: 0; right: 0; /* Вся ширин */
                //     top: 0; bottom: 0; /* Вся высота */
                //     z-index: -1; /* Фон ниже текста */
                //     /* Параметры фона */
                //     background-color: var(--background-green);
                // })
                // host(:hover) {
                //     background-color: blue;
                //     background: linear-gradient(rgba(255,255,255,0.5), rgba(255,255,255,0.5)),
                //     filter: brightness(2);
                // }
                // a::before {
                //     content: '';
                //     position: absolute; /* Фиксируем на одном месте */
                //     left: 0; right: 0; /* Вся ширин */
                //     top: 0; bottom: 0; /* Вся высота */
                //     z-index: -1; /* Фон ниже текста */
                //     /* Параметры фона */
                //     background-color: var(--background-green);
                // }
                // a {
                //     color: white;
                //     &::after {
                //         display: inline-block;
                //         content: '';
                //         background-color: red;
                //         position: absolute;
                //         z-index: -1;
                //         left: 0; right: 0; /* Вся ширин */
                //         top: 0; bottom: 0; /* Вся высота */
                //     }
                //     &:hover {
                //         &::after {
                //             filter: brightness(200%);
                //         }
                //     }

                // }
                // a::after {
                //     display: inline-block;
                //     content: '';
                //     background-color: red;
                //     position: absolute;
                //     z-index: -1;
                //     left: 0; right: 0; /* Вся ширин */
                //     top: 0; bottom: 0; /* Вся высота */
                // }
                // a:hover::after {
                //     filter: brightness(200%);
                // }
                // a:hover {
                //     &::after {
                //         filter: brightness(200%);
                //     }
                // }


            `
        ];
    }

    firstUpdated() {
        super.firstUpdated();
    }

    render() {
        return html`
            <a href=${this.href || nothing} target=${this.target || nothing} title=${this.title || nothing}>
                 <slot></slot>
            </a>
        `;
    }
});
