import { BaseElement, html, css, nothing } from '../../js/base-element.mjs';

customElements.define('vk-auth', class VKAuth extends BaseElement {
    static get properties() {
        return {
            _useInfo: { type: Boolean, default: true },
            iconName: { type: String, default: '', attribute: 'icon-name'},
            size: { type: Number, default: 24 },
            blink: {type: Boolean, default: false},
            my: { type: String, default: '', local: true},
            myGlobal: { type: String, default: '', global: true},
        }
    }

    static get styles() {
        return css`
            :host {
                display: block;
                vertical-align: middle;
                margin: 1px;
                user-select: none;
            }

            .reset {
              border: none;
              margin: 0;
              padding: 0;
              width: auto;
              overflow: visible;
              background: transparent;
              color: inherit;
              font: inherit;
              line-height: normal;
              -webkit-font-smoothing: inherit;
              -moz-osx-font-smoothing: inherit;
              -webkit-appearance: none;
            }

            .button {
              border-radius: 8px;
              width: 100%;
              min-height: 44px;
              background: #0077ff;
              cursor: pointer;
              transition: all .1s ease-out;
              &:hover{
                opacity: 0.8;
              }
              &:active {
                opacity: 0.7;
                transform: scale(.97);
              }

              .container {
                display: flex;
                align-items: center;
                padding: 6px 10px;
              }
              .icon + .text {
               margin-left: -28px;
              }
              .text {
                display: flex;
                font-family: -apple-system, system-ui, "Helvetica Neue", Roboto, sans-serif;
                flex: 1;
                justify-content: center;
                color: #ffffff;
              }
            }
        `;
    }

    get #icon() {
        return html`<simple-icon icon-name=${this.iconName} size="${this.size}"></simple-icon>`;
    }

    // VKID.Config.init({
    //   app: 52051268, // Идентификатор приложения.
    //   redirectUrl: "https://polyathlon.github.io/neuro-market", // Адрес для перехода после авторизации.
    //   state: 'dj29fnsadjsd82', // Произвольная строка состояния приложения.
    //   codeVerifier: 'FGH767Gd65', // Верификатор в виде случайной строки. Обеспечивает защиту передаваемых данных.
    //   scope: 'email phone', // Список прав доступа, которые нужны приложению.
    //   mode: VKID.ConfigAuthMode.Redirect // По умолчанию авторизация открывается в новой вкладке.
    // });

    render() {
      return html`
        <button class="button reset" @click=${this.authorization}>
          <div class="container">
            <div class="icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M4.54648 4.54648C3 6.09295 3 8.58197 3 13.56V14.44C3 19.418 3 21.907 4.54648 23.4535C6.09295 25 8.58197 25 13.56 25H14.44C19.418 25 21.907 25 23.4535 23.4535C25 21.907 25
                19.418 25 14.44V13.56C25 8.58197 25 6.09295 23.4535 4.54648C21.907 3 19.418 3 14.44 3H13.56C8.58197 3 6.09295 3 4.54648 4.54648ZM6.79999 10.15C6.91798 15.8728 9.92951 19.31 14.8932 19.31H15.1812V16.05C16.989 16.2332 18.3371
                17.5682 18.8875 19.31H21.4939C20.7869 16.7044 18.9535 15.2604 17.8141 14.71C18.9526 14.0293 20.5641 12.3893 20.9436 10.15H18.5722C18.0747 11.971 16.5945 13.6233 15.1803 13.78V10.15H12.7711V16.5C11.305 16.1337 9.39237 14.3538 9.314 10.15H6.79999Z" fill="white"/>
              </svg>
            </div>
            <div class="text">
                Войти с VK ID
            </div>
          </div>
        </button>
      `;
    }

    authorization() {
      const VKID = window.VKIDSDK;
      VKID.Auth.login()
    }
});
