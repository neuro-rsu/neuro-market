import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import './section-1/my-competition-section-1.mjs';

class MyCompetition extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
            sections: { type: Array, default: null },
            version: { type: String, default: '1.0.0' },
        }
    }

    static get styles() {
        return [
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
            {name: "section1", label: lang`Competition`, iconName: 'competition-solid'},
            {name: "section2", label: lang`Sportsmen`, iconName: 'sportsmen-solid'},
            // {name: "section6", label: lang`Results`, iconName: 'hundred-points-solid'},
            {name: "section6", label: lang`Results`, iconName: 'timer-solid'},
            {name: "section3", label: lang`Referees`, iconName: 'referee-man-solid'},
            {name: "section4", label: lang`Statistic`, iconName: 'chart-pie-solid'},
            {name: "section5", label: lang`Registration requests`, iconName: 'registration-solid'},
        ]
    }

    get section1() {
        return html`
            <my-competition-section-1 .sections=${this.sections} .currentSection=${0}></my-competition-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-competition-section-2.mjs');
        return html`
            <my-competition-section-2 .sections=${this.sections} .currentSection=${1}></my-competition-section-2>
        `;
    }

    get section3() {
        import('./section-3/my-competition-section-3.mjs');
        return html`
            <my-competition-section-3 .sections=${this.sections} .currentSection=${3}></my-competition-section-3>
        `;
    }

    get section4() {
        import('./section-4/my-competition-section-4.mjs');
        return html`
            <my-competition-section-4 .sections=${this.sections} .currentSection=${4}></my-competition-section-4>
        `;
    }

    get section5() {
        import('./section-5/my-competition-section-5.mjs');
        return html`
            <my-competition-section-5 .sections=${this.sections} .currentSection=${5}></my-competition-section-5>
        `;
    }

    get section6() {
        import('./section-6/my-competition-section-6.mjs');
        return html`
            <my-competition-section-6 .sections=${this.sections} .currentSection=${2}></my-competition-section-6>
        `;
    }

    get #section() {
        return cache(this[this.sections[this.currentSection].name])
    }

    render() {
        return html`
            ${this.#section}
        `;
    }

    async firstUpdated() {
        super.firstUpdated();
        let params = new URLSearchParams(window.location.search)
        if (params.has('competition')) {
            sessionStorage.setItem('competition', 'competition:' + params.get('competition'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-competition", MyCompetition)