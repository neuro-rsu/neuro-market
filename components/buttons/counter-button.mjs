import { BaseElement, html, css } from '../../js/base-element.mjs';

class CounterButton extends BaseElement {
    static get properties() {
        return {
            href: { type: String, default: '' },
            max: { type: Number, default: 0 },
            duration: {type: Number, default: 0},
            counter: { type: Number, default: 0 }
        }
    }

    static get styles() {
        return css`
            :host {
                display: flex;
                justify-content: center;
                align-items: center;
                aspect-ratio: 1 / 1;
                border-radius: 50%;
                background-color: var(--background-magenta);
                font-size: 4em;
                font-weight: 700;
                font-family: var(--ubuntu-font-family);
                margin-block: auto;
                line-height: 0;
                padding: 5px;
                user-select: none;
                min-width: 83px;
            }
            :host(.native) {
                background-color: var(--native-background-color);
            }
            :host(.gray) {
                background-color: var(--background-gray);
            }
        `;
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
        this.addObserver();
    }

    render() {
        return html`
            ${this.counter}
        `;
    }
};

customElements.define('counter-button', CounterButton);