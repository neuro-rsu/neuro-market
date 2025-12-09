import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'

class MyTrainerSection1Page2 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    overflow: hidden;
                    gap: 10px;
                }

                header{
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                #item-header{
                    grid-area: header1;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }

                #item-header p {
                    width: 100%;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    font-size: 1rem;
                    margin: 0;
                }

                #property-header{
                    grid-area: header2;
                }

                .left-layout {
                    grid-area: sidebar;
                    display: flex;
                    flex-direction: column;

                    align-items: center;
                    overflow-y: auto;
                    overflow-x: hidden;
                    background: rgba(255, 255, 255, 0.1);
                }

                .left-layout item-button {
                    width: 100%;
                    height: 40px;
                }

                img {
                    width: 100%;
                }

                .right-layout {
                    grid-area: content;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-right: 20px;
                    background: rgba(255, 255, 255, 0.1);
                    overflow: hidden;
                    gap: 10px;
                }

                h1 {
                    font-size: 3.4375rem;
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

                footer {
                    grid-area: footer;
                    display: flex;
                    align-items: center;
                    justify-content: end;
                    margin-right: 20px;
                    gap: 10px;
                }

                footer simple-button {
                    height: 40px;
                }
                #drop_zone {
                    border: 5px solid blue;
                    width: 200px;
                    height: 100px;
                }
                avatar-input {
                    height: 50px;
                    margin: auto;
                    aspect-ratio: 1 / 1;
                    overflow: hidden;
                    border-radius: 50%;
                }
                .left-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
                .right-aside {
                    display: flex;
                    justify-content: center;
                    width: 40px;
                }
            `
        ]
    }

    render() {
        return html`
            <div>
                <simple-input id="name" icon-name="user" label="Country name:" .value=${this.item?.name} @input=${this.validateInput}></simple-input>
                <simple-input id="region" icon-name="flag-solid" label="Region name:" .value=${this.item?.region} @input=${this.validateInput}></simple-input>
                <simple-input id="flag" icon-name="flag-solid" label="Flag name:" .value=${this.item?.flag} @input=${this.validateInput}></simple-input>
            </div>
        `;
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value
        if (e.target.id === 'name') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }

}

customElements.define("my-trainer-section-1-page-2", MyTrainerSection1Page2);