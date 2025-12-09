import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-competitions-section-1.mjs';
import '../../../../components/buttons/aside-button.mjs';

class MyCompetitions extends BaseElement {
    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    box-sizing: border-box;
                    height: 100%
                }
                aside {
                    display: flex;
                    flex-direction: column;
                }
            `
        ]
    }

    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
        }
    }

    constructor() {
        super();
        this.version = "1.0.0";
    }

    render() {
        return html`
            <my-competitions-section-1></my-competitions-section-1>
        `;
    }
}

customElements.define("my-competitions", MyCompetitions);