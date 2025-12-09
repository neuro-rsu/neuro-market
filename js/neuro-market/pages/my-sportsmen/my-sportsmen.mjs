import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-sportsmen-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MySportsmen extends BaseElement {
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
            {name: "section1", label: lang`Sportsman`, iconName: 'sportsman-solid'},
        ]
        this.version = "1.0.0";
    }

    render() {
        return html`
            <my-sportsmen-section-1 .sections=${this.sections}></my-sportsmen-section-1>
        `;
    }
}

customElements.define("my-sportsmen", MySportsmen);