import { BaseElement, html, css } from '../base-element.mjs'

import '../../components/buttons/social-button.mjs';
import lang from '../../js/neuro-market/neuro-market-dictionary.mjs'


class NeuroMarketFooter extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
        }
    }

    get title() {
        return 'Vladislav Antoshkin';
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    padding: 10px 0;
                    height: var(--neuro-market-footer-height, 80px);
                    background-color: var(--footer-background-color);
                }

                .copyright {
                    display: flex;
                }

                p {
                    text-align: center;
                    margin: 0;
                    padding-bottom: 4px;
                }

                a {
                    text-decoration: none;
                    text-wrap: nowrap;
                }

                footer {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    gap: 10px;
                }

                div {
                    display: flex;
                    flex-wrap: wrap;
                    justify-content: center;
                    gap: 10px;
                }

                div a {
                    display: flex;
                    align-items: center;
                }

                .logo {
                    border-radius: 50%;
                    color: var(--nav-item-active-color);
                    background-color: var(--native-background-color) !important;
                    line-height: 0;
                    cursor: pointer;
                }

                .logo > img {
                    object-fit: contain;
                    margin: 20px;
                    width: 80px;
                    height: 80px;
                }

                h3 {
                    margin: 0;
                    font-family: var(--ubuntu-font-family);
                    font-size: 18px;
                    line-height: 24px;
                }

                @media (max-width: 300px) {
                    .logo {
                        display: none;
                    }
                }
                .hidden {
                    display: none;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    logo() {
        return html`
            <div class="logo" @click="${() => scroll(0,0)}">
                <img src="images/favicon.svg" alt="" />
            </div>
        `
    }

    social() {
        return html`
            <div class="hidden">
                <a href="https://t.me/v_a_antoshkin"><img src="images/telegram.svg" alt=""/></a>
                <a href="https://vk.com/id63554332"><img src="images/vk.svg" alt=""/></a>
                <a href="mailto:v.a.antoshkin@mail.ru"><img src="images/mail.svg" alt=""/></a>
            </div>
        `;
    }

    render() {
        return html`
            <footer>
                <p>${lang`© Ryazan State University named after S.A. Yesenin`}</p>
                ${this.social()}
            </footer>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
    }

}

customElements.define("neuro-market-footer", NeuroMarketFooter);