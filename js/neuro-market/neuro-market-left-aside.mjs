import { BaseElement, html, css, nothing } from '../base-element.mjs'

import '../../components/buttons/aside-button.mjs';

import lang from './neuro-market-dictionary.mjs';

class NeuroMarketLeftAside extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            successUserIn: { type: Boolean, default: false, local: true},
            activePage: { type: String, default: '', local: true },
            notificationMaxOffset: { type: String, default: '', local: true },
            notificationCurrentOffset: { type: String, default: '', local: true },
        }
    }

    get title() {
        return 'Vladislav Antoshkin';
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 0;
                    height: calc(100vh - 80px - var(--neuro-market-footer-height, 80px));
                    overflow: hidden;
                    background: linear-gradient(180deg, var(--header-background-color) 0%, var(--gradient-background-color) 100%);
                }
                nav {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }
            `
        ]
    }

    constructor() {
        super();
        this.version = "1.0.0";
        this.buttons = [
            {iconName: 'house-sharp-solid', title: 'Home', page: 'home-page', click: () => this.showPage('')},
            {iconName: 'user', title: 'Profile', page: 'my-profile', click: () => this.showPage('my-profile')},
            {iconName: 'referee-man-solid', page: 'my-referees', title: lang`Referees`, click: () => this.showPage('my-referees')},
            {iconName: 'trainer-man-solid', page: 'my-trainers', title: lang`Trainers`, click: () => this.showPage('my-trainers')},
            {iconName: 'sportsman-man-solid', page: 'my-sportsmen', title: lang`Sportsmen`, click: () => this.showPage('my-sportsmen')},
            {iconName: 'competition-solid', page: 'my-competitions', title: lang`Competitions`, click: () => this.showPage('my-competitions')},

            // {name: 'square-list-sharp-solid', title: 'Project', click: () => this.showPage('my-projects')},
            // {name: 'chart-pie-simple-circle-dollar-solid', title: 'tariff plan', click: () => this.showPage('traffic-plan')},
            // {name: 'download-file', title: 'Download File', click: () => this.showPage('my-projects')},
            // {name: 'credit-card', title: 'Tariff Plans', click: () => this.showPage('tariff-plans')},
            // {iconName: 'club-solid', page: 'my-clubs', title: 'Clubs', click: () => this.showPage('my-clubs')},
            // {iconName: 'chart-pie-simple-circle-dollar-solid', page: 'tariff-plans', title: 'Tariff Plans', click: () => this.showPage('tariff-plans')},
            {iconName: 'federation-member-solid', page: 'my-federation-members', title: lang`Federation members`, blink: 1, click: () => this.showPage('my-federation-members')},
            {iconName: 'category-solid', page: 'my-sports-disciplines', title: lang`Sports disciplines`, click: () => this.showPage('my-sports-disciplines')},
            {iconName: 'table-list-solid', page: 'my-sports-discipline-components', title: lang`Sports components`, click: () => this.showPage('my-sports-discipline-components')},
            {iconName: 'bell-sharp-solid', page: 'my-notifications', title: lang`Notifications`, blink: 1, click: () => this.showPage('my-notifications')},
            {iconName: 'settings-solid', page: 'my-settings', title: lang`Settings`, click: () => this.showPage('my-settings')},


        ]
    }

    showPage(page) {
        location.hash = page;
    }

    render() {
        return html`
            <nav>${this.buttons.map((button, index) =>
                html`<aside-button blink=${button.blink && this.notificationMaxOffset && +this.notificationMaxOffset > +this.notificationCurrentOffset || nothing} icon-name=${button.iconName} title=${button.title} @click=${button.click} ?active=${this.activePage === button.page}></aside-button>`)}
            </nav>
            <aside-button icon-name="right-from-bracket-solid" title="Sign Out" @click=${this.signOut}></aside-button>
        `;
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
        window.location.hash = '';
    }

    firstUpdated() {
        super.firstUpdated();
    }
}

customElements.define("neuro-market-left-aside", NeuroMarketLeftAside);