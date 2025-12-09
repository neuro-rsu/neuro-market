import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import '../../../../components/buttons/icon-button.mjs'

import lang from '../../neuro-market-dictionary.mjs'

import './section-1/my-sports-discipline-components-section-1.mjs';

class MySportsDisciplineComponents extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
            sectionNames: { type: Array, default: 0 },
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
            {name: 'section1', label: lang`Discipline`, iconName: 'competition-solid'},
            {name: 'section1', label: lang`Points Table`, iconName: 'sportsmen-solid'},
        ]
    }

    get section1() {
        return html`
            <my-sports-discipline-components-section-1 .sections=${this.sections}></my-sports-discipline-components-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-sports-discipline-components-section-2.mjs');
        return html`
            <my-sports-discipline-components-section-2 .sections=${this.sections}></my-sports-discipline-components-section-2>
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
        if (params.has('sports-discipline-components')) {
            localStorage.setItem('currentSportsDisciplineComponent', params.get('sports-discipline-components'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-sports-discipline-components", MySportsDisciplineComponents)