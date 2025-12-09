import { BaseElement, html, css, cache } from '../../../base-element.mjs'

import './section-1/my-federation-member-section-1.mjs';

import lang from '../../neuro-market-dictionary.mjs'

class MyFederationMember extends BaseElement {
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
            {name: "section1", label: lang`Member`, iconName: item => item?.gender == true ? 'federation-member-woman-solid': 'federation-member-man-solid'},
            {name: "section2", label: lang`Requests`, iconName: 'registration-solid'},
        ]
    }

    get section1() {
        return html`
            <my-federation-member-section-1 .sections=${this.sections} .currentSection=${0}></my-federation-member-section-1>
        `;
    }

    get section2() {
        import('./section-2/my-federation-member-section-2.mjs');
        return html`
            <my-federation-member-section-2 .sections=${this.sections} .currentSection=${1}></my-federation-member-section-2>
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
        if (params.has('federation-member')) {
            sessionStorage.setItem('federationMember', 'federation-member:' + params.get('federation-member'))
            window.history.replaceState(null, '', window.location.pathname + window.location.hash);
        }
    }
}

customElements.define("my-federation-member", MyFederationMember)