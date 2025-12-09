import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-profile-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MyProfile extends BaseElement {
    static get properties() {
        return {
            currentSection: { type: BigInt, default: 0 },
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
            {name: "section1", label: lang`User`, iconName: 'user'},
            {name: "section3", label: lang`Documents`, activeLabel: lang`Document`, iconName: 'documents-solid'},
            {name: "section2", label: lang`Requests`, activeLabel: lang`Request`, iconName: 'registration-solid'},
        ]
    }

    get section1() {
        return html`
            <my-profile-section-1 .sections=${this.sections} .currentSection=${0}></my-profile-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-profile-section-2.mjs')
        return html`
            <my-profile-section-2 .sections=${this.sections} .currentSection=${2}></my-profile-section-2>
        `;
    }

    get section3() {
        import('./section-3/my-profile-section-3.mjs')
        return html`
            <my-profile-section-3 .sections=${this.sections} .currentSection=${1}></my-profile-section-3>
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
}

customElements.define("my-profile", MyProfile);