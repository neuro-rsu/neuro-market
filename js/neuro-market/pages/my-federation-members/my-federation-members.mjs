import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-federation-members-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MyFederationMembers extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
            sections: { type: Array, default: null },
            version: { type: String, default: '1.0.0' },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    height: 100%
                }
            `
        ]
    }

    constructor() {
        super();
        this.sections = [
            {name: "section1", label: lang`Federation member`, iconName: 'referee-solid'},
        ]
        this.version = "1.0.0";
    }

    render() {
        return html`
            <my-federation-members-section-1 .sections=${this.sections}></my-federation-members-section-1>
        `;
    }
}

customElements.define("my-federation-members", MyFederationMembers);