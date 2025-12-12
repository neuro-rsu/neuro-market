import { BaseElement, html, css } from '../base-element.mjs'

import {HOST, PORT} from "./neuro-market-config.mjs";

import '../../components/buttons/toggle-button.mjs';

import lang from './neuro-market-dictionary.mjs';

class NeuroMarketHeader extends BaseElement {
    static get properties() {
        return {
            isShow: { type: Boolean, default: false },
            isHorizontal: { type: Boolean, default: true },
            version: { type: String, default: '1.0.0' },
            activePage: { type: String, default: '', attribute: 'active-page', local: true },
            successUserIn: { type: Boolean, default: false, local: true},
            notificationMaxOffset: { type: String, default: '', local: true },
            notificationCurrentOffset: { type: String, default: '', local: true },
            projectStatus: { type: Object, default: null, local: true },
        }
    }


    get title() {
        return 'Smart Neuro Market';
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    padding: 0 10px;
                    background-color: var(--header-background-color);
                }

                header {
                    display: flex;
                    height: 80px;
                    padding: 0px 0px;
                    justify-content: space-between;
                    align-items: center;
                }
                a {
                    text-decoration: none;
                    text-wrap: nowrap;
                    line-height: 0;
                }
                .logo {
                    display: flex;
                    align-items: center;
                    line-height: 1;
                }
                .logo a {
                    text-weight: 700;
                    color: var(--native-color);
                }
                .logo img {
                    margin-right: 1rem;
                    width: 70px;
                    height: 70px;
                }
                h3 {
                    margin: 0;
                }
                nav {
                    display: flex;
                }
                nav.vertical{
                    align-items: flex-start;
                    justify-content: space-between;
                    margin: 0;
                    padding: 0;
                    height: 200px;
                    overflow: hidden;
                    transition: height 0.35s ease;
                }
                nav.vertical:not(.show) {
                    height: 0;
                }
                nav.horizontal{
                    align-items: center;
                    margin: 0;
                    padding: 0;
                }
                nav ul {
                    list-style: none;
                    display: flex;
                    margin: 0;
                    padding: 0;
                    line-height: 1;
                }
                nav.vertical ul {
                    flex-direction: column;
                    width: 100%;
                }
                nav li {
                    display: inline-block;
                    position: relative;
                    horizontal-align: middle;
                    height: 100%;
                    padding: 0;
                    margin: 0;
                }
                nav.vertical li {
                    border-bottom: 1px solid var(--nav-item-hover-background-color);
                }
                nav.horizontal li:not(:last-child) {
                    margin-right: 2px;
                }
                nav.vertical a{
                    display: block;
                }
                nav a {
                    text-decoration: none;
                    text-transform: uppercase;
                    font-size: 1rem;
                    font-weight: 500;
                    line-height: 1rem;
                    letter-spacing: normal;
                    padding: 10px 20px;
                    color: var(--nav-item-color);
                }
                nav a:hover {
                    color: var(--nav-item-hover-color);
                    background-color: var(--nav-item-hover-background-color) !important;
                }
                nav a[active] {
                    color: var(--nav-item-active-color);
                    background-color: var(--nav-item-active-background-color) !important;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
        if (this.getToken()) {
            this.createEventSource();
        }

    }

    logo() {
        // <svg>
        //     <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href='images/favicon.svg"></use>
        // </svg>
        return html`
            <div class="logo" title="Home">
                <a href="#">
                    <img src="images/favicon.svg" alt="">
                </a>
                <a href="#">
                    <h3 class="text">
                        ${this.title}
                    </h3>
                </a>
            </div>
            <sign-in-form></sign-in-form>
            <sign-up-form></sign-up-form>
            <password-recovery-form></password-recovery-form>
        `
    }

    userAccount() {
        return this.successUserIn ?  html`<li><a @click=${this.signOut}>${lang`Log out`}</a></li>` :
            html`<li><a @click=${this.login}>${lang`Log in`}</a></li>`
    }

    horizontalHeader() {
        return html`
            <header class="">
                ${this.logo()}
                <nav class="horizontal">
                    <ul>
                        <li><a @click=${() => this.showPage("my-new")} ?active=${this.activePage==="my-new"}>${lang`New`}</a></li>
                        <li><a @click=${() => this.showPage("my-popular")} ?active=${this.activePage==="my-popular"}>${lang`Popular`}</a></li>
                        ${this.userAccount()}
                    </ul>
                </nav>
            </header>
        `;
    }

    verticalHeader() {
        return html`
            <header>
                ${this.logo()}
                <toggle-button name="bars" .toggled=${this.isShow} toggledname="xmark" border="0" color="var(--header-background-color)" @click=${this.showMenu} size="36"></toggle-button>
            </header>
            <nav class="vertical${this.isShow ? ' show' : ''}">
                <ul>
                    <li><a @click=${() => this.showPage("my-competitions")} ?active=${this.activePage==="my-competitions"}>${lang`Competitions`}</a></li>
                    <li><a @click=${() => this.showPage("my-sportsmen")} ?active=${this.activePage==="my-courses"}>${lang`Sportsmen`}</a></li>
                    <li><a @click=${() => this.showPage("my-trainers")} ?active=${this.activePage==="my-trainers"}>${lang`Trainers`}</a></li>
                    <li><a @click=${() => this.showPage("my-referees")} ?active=${this.activePage==="my-referees"}>${lang`Referees`}</a></li>
                    ${this.userAccount()}
                </ul>
            </nav>
        `;
    }

    render() {
        return this.isHorizontal ? this.horizontalHeader() : this.verticalHeader();
    }

    showPage(page) {
        location.hash = page;
        if (!this.isHorizontal)
            this.showMenu();
    }

    async login() {
        if (!this.isHorizontal)
            this.showMenu();
        await import( '../../components/forms/sign-in-form.mjs')
        this.renderRoot.querySelector("sign-in-form").open().then(() => this.showUserAccount()).catch(() => '');
    }

    clearStorage(){
        if (localStorage.getItem('rememberMe')) {
            localStorage.removeItem('userInfo');
            localStorage.removeItem('profile');
            localStorage.removeItem('rememberMe');
            localStorage.removeItem('accessUserToken');
            localStorage.removeItem('exitUserToken');
        }
        else {
            sessionStorage.removeItem('userInfo');
            sessionStorage.removeItem('profile');
            sessionStorage.removeItem('rememberMe');
            sessionStorage.removeItem('accessUserToken');
            sessionStorage.removeItem('exitUserToken');
        }
    }

    signOut() {
        this.successUserIn = false;
        this.clearStorage();
        this.showMenu();
        window.location.hash = '';
    }

    getToken() {
        if (localStorage.getItem('rememberMe')) {
            return localStorage.getItem('accessUserToken')
        }
        else {
            return sessionStorage.getItem('accessUserToken')
        }
    }

    createEventSource() {
        this.eventSource = new EventSource(`https://${HOST}:${PORT}/api/sse?token=${this.getToken()}`)
        this.eventSource.onmessage = (event) => {
            console.log(event);
        };
        this.eventSource.addEventListener('maxoffset', event => {
            this.notificationMaxOffset = event.data
            console.log(event);
        })
        this.eventSource.addEventListener('project-status', event => {
            console.log(event.data)
            this.projectStatus = JSON.parse(event.data)
            // this.fire('project-status', { notification: '11111' })
            // console.log(this.activePage)
            console.log(this.projectStatus);
        })
    }

    async getNotificationOffset(projectId) {
        let token = await this.getToken();
        return fetch(`https://${HOST}:${PORT}/api/notification-offset`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(json => {
            if (json.error) {
                throw Error(json.error)
            }
            return json;
        })
        .then(project => {
            console.log(project)
            this.notificationMaxOffset = project?.maxOffset;
            this.notificationCurrentOffset = project?.currentOffset;
            return project
        })
        // .then(() =>c.modalDialogShowShow())
        .catch(err => {console.error(err.message)});
    }

    showUserAccount() {
        this.successUserIn = true;
        this.createEventSource();
        this.getNotificationOffset();
        window.location.hash = '';
    }

    matchMediaChange(e) {
        this.isHorizontal = e.matches;
    }

    showMenu() {
        this.isShow = !this.isShow;
    }

    async firstUpdated() {
        super.firstUpdated();
        const md = window.matchMedia( "(min-width: 920px)" );
        this.isHorizontal = md.matches;
        md.addEventListener('change', () => this.matchMediaChange, false);
        if (window.location.search) {
            const params = new URLSearchParams(window.location.search);
            let param1 = params.get('code');
            let param2 = params.get('device_id');
            if (param1 && param2) {
                await import( '../../components/forms/sign-in-form.mjs')
                this.renderRoot.querySelector("sign-in-form").open().then(() => this.showUserAccount()).catch(() => '');
            }
            param1 = params.get('password-recovery');
            if (param1) {
                await import( '../../components/dialogs/password-recovery-dialog.mjs')
                this.renderRoot.querySelector("password-recovery-dialog").show(param1).then(() => this.showUserAccount()).catch(() => '');
            }
            param1 = params.get('verify-email');
            if (param1) {
                await import( '../../components/forms/verify-email-form.mjs')
                this.renderRoot.querySelector("verify-email-form").open().then(() => this.showUserAccount()).catch(() => '');
            }
        }
    }
}

customElements.define("neuro-market-header", NeuroMarketHeader);