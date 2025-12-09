import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/buttons/fashion-button.mjs'

import lang from '../../neuro-market-dictionary.mjs'

class HomeSection1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    height: 100%;
                    overflow: hidden;
                    gap: 20px;
                }

                .left-layout {
                    display: flex;
                    flex-basis: 50%;
                    align-items: center;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    display: flex;
                    flex-basis: 50%;
                    align-items: center;
                    justify-content: center;
                }

                h1 {
                    font-size: 5rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 20px 0 0;
                }

                h2 {
                    font-weight: 300;
                    line-height: 1.2;
                    font-size: 1.25rem;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                a {
                    display: inline-block;
                    text-transform: uppercase;
                    color: var(--native-color);
                    margin: 20px auto 0 0;
                    background-color: var(--background-green);
                    letter-spacing: 1px;
                    text-decoration: none;
                    white-space: nowrap;
                    padding: 10px 30px;
                    border-radius: 0;
                    font-weight: 600;
                }

                a:hover {
                    background-color: var(--button-hover-color);
                }
                // link-button {
                //     background: red;
                // }
            `
        ]
    }

    constructor() {
        super();
    }

    render() {
        return html`
            <div class="left-layout">
                <img src="images/robot.png" alt="robot">
            </div>
            <div class="right-layout">
                <div>
                    <h2>${lang`Your happiness is already here`}</h2>
                    <h1>Smart<br>Neuro<br>Market</h1>
                    <p>${lang`Find your neural network!`}</p>
                    <fashion-button href="#my-pride">${lang`Learn more`}</fashion-button>
                </div>
            </div>
        `;
    }

    firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("home-section-1", HomeSection1);