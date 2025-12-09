import { BaseElement, html, css } from '../../js/base-element.mjs';

class StatisticButton extends BaseElement {
    static get properties() {
        return {
            href: { type: String, default: '' },
            max: { type: Number, default: 0 },
            duration: {type: Number, default: 0},
            counter: { type: Number, default: 0 },
            label: { type: String, default: '' },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    justify-content: center;
                    flex-direction: column;
                    align-items: center;
                    border-radius: 5px;
                    background-color: rgba(255, 255, 255, 0.1);
                    font-size: 0.9rem;
                    font-weight: 700;
                    margin-block: auto;
                    line-height: 0;
                    padding: 5px;
                }
                :host(.native) {
                    background-color: var(--native-background-color);
                }
                :host(.gray) {
                    background-color: var(--background-gray);
                }
                h1 {
                    font-size: 0.9rem;
                    font-weight: 400;
                }
            `
        ];
    }

    addObserver() {
        const callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.observer.unobserve(entry.target);
                    this.timer = setInterval(() => {
                        if (this.max === 0 ) {
                            return
                        }
                        this.counter++;
                        if (this.counter === this.max) {
                            clearInterval(this.timer);
                        }
                    }, this.duration/this.max)
                }
            })
        }

        const options = {
            rootMargin: '0px 0px 75px 0px',
            threshold: 0,
        }

        this.observer = new IntersectionObserver(callback, options)
        this.observer.observe(this);
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        // this.addObserver();
    }

    render() {
        return html`
            <p>${this.max}</p>
            <h1>${this.label}</h1>
        `;
    }
};

customElements.define('statistic-button', StatisticButton);