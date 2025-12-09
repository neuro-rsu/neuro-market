
import { BaseElement, html, css } from '../../../base-element.mjs'

import '../../../../components/buttons/switch-button.mjs'
import '../../../../components/dialogs/confirm-dialog.mjs'

class MySettingsSection1 extends BaseElement {
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
                    display: grid;
                    width: 100%;
                    grid-template-columns: 3fr 9fr;
                    grid-template-rows: 50px 1fr 50px;
                    grid-template-areas:
                        "header1 header2"
                        "sidebar content"
                        "footer  footer";
                    gap: 0 20px;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                }

                h1 {
                    font-size: 3.4375rem;
                    font-weight: 700;
                    text-transform: uppercase;
                    margin: 20px 0 0;
                }

                p {
                    font-size: 1.25rem;
                    margin: 20px 207px 20px 0;
                    overflow-wrap: break-word;
                }

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

            `
        ]
    }

    render() {
        return html`
            <confirm-dialog></confirm-dialog>
            <div>
                <h1>Select</h1>
                <switch-button></switch-button>
            </div>
        `;
    }
}

customElements.define("my-settings-section-1", MySettingsSection1);