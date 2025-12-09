import { BaseElement, html, css, nothing } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/gender-input.mjs'
import '../../../../../components/inputs/birthday-input.mjs'
import '../../../../../components/forms/verify-email-form.mjs'

import lang from '../../../neuro-market-dictionary.mjs'

class MyTrainerSection3Page1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: {type: Object, default: null},
            isModified: {type: Boolean, default: false, local: true},
            oldValues: {type: Map, default: null},
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: space-between;
                    align-items: safe center;
                    height: 100%;
                    gap: 10px;
                }
                .container {
                    min-width: min(600px, 50vw);
                    max-width: 600px;
                }
            `
        ]
    }

    render() {
        return html``;
    }

    async confirmEmail() {

        // const verifyEmail = this.renderRoot.querySelector('verify-email-form') ?? null;
        // verifyEmail.open()

        const verifyEmail = document.createElement('verify-email-form');
        this.renderRoot.append(verifyEmail)
        const modalResult = await verifyEmail.open()
        if (modalResult != 'Error') {
            this.item.emailVerified = true
            this.item._rev = modalResult.rev
            this.requestUpdate()
        }

        // return this.querySelector('verify-email-form') ?? null;
        // this.parentNode.parentNode.host.requestUpdate()
    }

    validateInput(e) {
        let currentItem = e.target.currentObject ?? this.item.personalInfo
        if (!this.oldValues.has(e.target)) {
            if (currentItem[e.target.id] !== e.target.value) {
                this.oldValues.set(e.target, currentItem[e.target.id])
            }
        }
        else if (this.oldValues.get(e.target) === e.target.value) {
                this.oldValues.delete(e.target)
        }

        currentItem[e.target.id] = e.target.value
        if (e.target.id === 'name') {
            this.parentNode.parentNode.host.requestUpdate()
        }
        this.isModified = this.oldValues.size !== 0;
    }
}

customElements.define("my-trainer-section-3-page-1", MyTrainerSection3Page1);