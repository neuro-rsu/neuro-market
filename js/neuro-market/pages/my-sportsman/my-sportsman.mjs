import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-sportsman-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MySportsman extends BaseElement {
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
        this.version = "1.0.0";
        this.sections = [
            {name: "section1", label: lang`Sportsman`, iconName: item => item?.gender == true ? 'sportsman-woman-solid': 'sportsman-man-solid'},
            {name: "section2", label: lang`Documents`, iconName: 'documents-solid'},
        ]
    }

    get section1() {
        return html`
            <my-sportsman-section-1 .sections=${this.sections} .currentSection=${0}></my-sportsman-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-sportsman-section-2.mjs');
        return html`
            <my-sportsman-section-2 .sections=${this.sections} .currentSection=${1}></my-sportsman-section-2>
        `;
    }

    get section() {
        return cache(this[this.sections[this.currentSection].name])
    }

    render() {
        return html`
            ${this.section}
        `;
    }

    async firstUpdated() {
        super.firstUpdated();
        let params = new URLSearchParams(window.location.search)
        if (params.has('sportsman')) {
            sessionStorage.setItem('sportsman', 'sportsman:' + params.get('sportsman'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-sportsman", MySportsman)