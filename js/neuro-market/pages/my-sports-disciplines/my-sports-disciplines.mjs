import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import './section-1/my-sports-disciplines-section-1.mjs';

class MySportsDisciplines extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
            currentTab: { type: BigInt, default: 0 },
            sections: { type: Array, default: 0 },
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
            {name: "section1", label: lang`Sports discipline`, iconName: 'category-solid'},
            {name: "section2", label: lang`Component`, iconName: 'puzzle-solid'},
            {name: "section3", label: lang`Categories table`, iconName: 'sportsman-man-solid'},
            {name: "section4", label: lang`Categories table`, iconName: 'sportsman-woman-solid'},
        ]
    }

    get section1() {
        return html`
            <my-sports-disciplines-section-1 .sections=${this.sections} .currentSection=${0} .currentTab=${this.currentTab}></my-sports-disciplines-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-sports-disciplines-section-2.mjs');
        return html`
            <my-sports-disciplines-section-2 .sections=${this.sections} .currentSection=${1}></my-sports-disciplines-section-2>
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
        if (params.has('sports-disciplines')) {
            localStorage.setItem('currentSportsDisciplineComponent', params.get('sports-disciplines'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-sports-disciplines", MySportsDisciplines)