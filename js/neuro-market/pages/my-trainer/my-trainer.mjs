import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-trainer-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MyTrainer extends BaseElement {
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
            {name: "section1", label: lang`Trainer`, iconName: item => item?.gender == true ? 'trainer-woman-solid': 'trainer-man-solid'},
            {name: "section2", label: lang`Sportsmen`, activeLabel: lang`Sportsman`, iconName: 'sportsmen-solid'},
            {name: "section3", label: lang`Requests`, activeLabel: lang`Request`, iconName: 'registration-solid'},
        ]
    }

    get section1() {
        return html`
            <my-trainer-section-1 .sections=${this.sections} .currentSection=${0}></my-trainer-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-trainer-section-2.mjs');
        return html`
            <my-trainer-section-2 .sections=${this.sections} .currentSection=${1}></my-trainer-section-2>
        `;
    }

    get section3() {
        import('./section-3/my-trainer-section-3.mjs');
        return html`
            <my-trainer-section-3 .sections=${this.sections} .currentSection=${2}></my-trainer-section-3>
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
        if (params.has('trainer')) {
            sessionStorage.setItem('trainer', 'trainer:' + params.get('trainer'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-trainer", MyTrainer)