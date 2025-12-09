import { BaseElement, html, css} from '../../../base-element.mjs'

import './my-settings-section-1.mjs';
import '../../../../components/buttons/switch-button.mjs';

class MySettings extends BaseElement {

    static get styles() {
        return [
            css`
                :host {
                    display: flex;
                    box-sizing: border-box;
                    height: 100%
                }
                aside {
                    display: flex;
                    flex-direction: column;
                }
            `
        ]
    }

    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
        }
    }

    constructor() {
        super();
        this.version = "1.0.0";
        this.asideMap = [
            {name: "user", title: "profile"},
            {name: "right-from-bracket-solid", title: "Sign Out"},
        ]
    }


    render() {
        return html`
            <my-settings-section-1></my-settings-section-1>
        `;
    }

    #nextSection(section) {
        const sectionName = section.tagName.toLowerCase().split('-');
        ++sectionName[sectionName.length - 1];
        return this.shadowRoot.querySelector(sectionName.join('-'));
    }

    firstUpdated() {
        super.firstUpdated();
        // const section = this.shadowRoot.querySelector('home-section-2');
        // const callback = (entries, observer) => {
        //     entries.forEach((entry) => {
        //       if (entry.isIntersecting) {
        //         this.observer.unobserve(entry.target)
        //         const nextSection = this.#nextSection(entry.target);
        //         if (nextSection) {
        //             import(`./${nextSection.tagName.toLowerCase()}.mjs`);
        //             this.observer.observe(nextSection);
        //         }
        //       }
        //     })
        // }

        // const options = {
        //     // root: по умолчанию window, но можно задать любой элемент-контейнер
        //     rootMargin: '0px 0px 75px 0px',
        //     threshold: 0,
        // }
        // this.observer = new IntersectionObserver(callback, options)
        // this.observer.observe(section)
    }
}

customElements.define("my-settings", MySettings);