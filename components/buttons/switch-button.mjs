import { BaseElement, html, css } from '../../js/base-element.mjs';

customElements.define('switch-button', class SwitchButton extends BaseElement {
  static get properties() {
    return {
      isActive: { type: Boolean, default: false }
    };
  }

  static get styles() {
      return css`
        :host {
          display: inline-block;
          cursor: pointer;
        }

      .toggle-switch {
        width: 60px;
        height: 30px;
        background: rgba(255, 255, 255, 0.2);
        border-radius: 15px;
        position: relative;
      }

      .toggle-slider {
        width: 30px;
        height: 30px;
        background-color: #f00;
        border-radius: 50%;
        position: absolute;
        top: 0;
        left: 0;
        transition: transform 0.3s ease-in-out;
      }

      .active .toggle-slider {
        transform: translateX(30px);
      }
    `;
  }

  render() {
    return html`
      <div class="toggle-switch ${this.isActive ? 'active' : ''}" @click="${this.toggleSwitch}">
        <div class="toggle-slider"></div>
      </div>
    `;
  }

  toggleSwitch() {
    this.isActive = !this.isActive;
  }
});