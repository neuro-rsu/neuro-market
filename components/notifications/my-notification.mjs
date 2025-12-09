import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

// import '../icon/icon.mjs'
// import '../buttons/simple-button.mjs'

// import styles from './input-css.mjs'

customElements.define("my-notification", class MyNotification extends BaseElement {
    static get properties() {
        return {
            type: { type: String, default: 'date'},
            notification: { type: Object, default: null},
        }
    }

    static get styles() {
        return [
            // styles,
            BaseElement.styles,
            css`
                :host {
                    display: inline-block;
                    width: 100%;
                    color: var(--native-color, white);
                }

                .container {
                    margin: 10px;
                }

                .content {
                    display: inline-block;
                    position: relative;
                    background: rgba(255, 255, 255, 0.4);
                    line-height: 1;
                    padding: 10px;
                    border-radius: 5px;
                }

                .timestamp {
                    text-align: center;
                    p {
                        display: inline-block;
                        background: rgba(255, 255, 255, 0.4);
                        line-height: 1;
                        margin: 10px auto 0;
                        padding: 10px;
                        border-radius: 5px;
                    }
                }
                .time {
                    text-align: right;
                    position: absolute;
                    right: 0px;
                    margin-top: 12px;
                    font-size: 0.8rem;
                }
            `
        ]
    }

    firstUpdated(setPath = false) {
        super.firstUpdated();
        this.addObserver();
    }

    get #label() {
        return html`
            <span class="label">${this.label}</span>
        `
    }

    get #icon() {
        return html`
            <simple-icon class="icon" icon-name="comment-dollar-solid"></simple-icon>
        `
    }

    addObserver() {
        const callback = (entries, observer) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    this.observer.unobserve(entry.target);

                    const notificationOffset = +this.notification._id.split(':')[1];
                    console.log(notificationOffset)
                    console.log(notificationOffset > +this.$root.notificationCurrentOffset)
                    if (notificationOffset > +this.$root.notificationCurrentOffset ) {
                        this.$root.notificationCurrentOffset = notificationOffset;
                    }

                    console.log(this.notification)
                    console.log(this.$root.notificationCurrentOffset)
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

    // get value() {
    //     return this._value;
    // }

    // set value(value) {
    //     const oldValue = this.value;
    //     this._value = value;
    //     this.requestUpdate('value', oldValue);
    // }

    get value() {
        return this.renderRoot?.querySelector('input')?.value ?? null;
    }

    set value(value) {
        const input = this.renderRoot?.querySelector('input');
        if (input) {
            input.value= value;
        }
    }

    get #button() {
        return html`
            <simple-icon class="button" icon-name=${this.buttonName || nothing} @click=${this.updateLoginValue}></simple-icon>
        `
    }

    get #timestamp() {
        return html`
            <div class="timestamp">
                <p>
                    ${this.notification ? (new Date(this.notification.timestamp)).toLocaleDateString() : ''}
                </p>
            </div>
        `
    }

    render() {
        return html`
            ${this.notification?.isFirst ? this.#timestamp: ''}
            <div class="container">
                ${this.#icon}
                <div class="content">
                    ${this.notification?.content || ''}
                    <div class="time">
                        ${(new Date(this.notification.timestamp)).toLocaleTimeString([],{ hour: "2-digit", minute: "2-digit" })}
                    </div>
                </div>
            </div>
        `;
    }

    get #input() {
        return this.renderRoot?.querySelector('input') ?? null;
    }

    changeValue(e) {
        const options = {
            bubbles: true,
            composed: true
          };
        this.dispatchEvent(new CustomEvent('value-changed', options));
    }
});