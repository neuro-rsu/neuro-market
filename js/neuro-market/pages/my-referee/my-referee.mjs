import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-referee-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MyReferee extends BaseElement {
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
        super()
        this.version = "1.0.0"
        this.sections = [
            {name: "section1", label: lang`Referee`, iconName: item => item?.gender == true ? 'referee-woman-solid': 'referee-man-solid'},
        ]
    }

    get section1() {
        return html`
            <my-referee-section-1 .sections=${this.sections} .currentSection=${0}></my-referee-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-referee-section-2.mjs');
        return html`
            <my-referee-section-2 .sections=${this.sections} .currentSection=${1}></my-referee-section-2>
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
        if (params.has('referee')) {
            sessionStorage.setItem('referee', 'referee:' + params.get('referee'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-referee", MyReferee)