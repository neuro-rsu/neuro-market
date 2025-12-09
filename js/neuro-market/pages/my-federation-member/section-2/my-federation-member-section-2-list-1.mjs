import { BaseElement, html, css } from '../../../../base-element.mjs'

import '../../../../../components/inputs/simple-input.mjs'
import '../../../../../components/inputs/avatar-input.mjs'

class MyFederationMemberSection2List1 extends BaseElement {
    static get properties() {
        return {
            version: { type: String, default: '1.0.0' },
            item: { type: Object, default: null },
            isModified: { type: Boolean, default: false, local: true },
            oldValues: {type: Map, default: null},
            currentItem: { type: Object, default: null },
            currentPage: { type: Object, default: null, local: true },
        }
    }

    static get styles() {
        return [
            BaseElement.styles,
            css`
                :host {
                    display: flex;
                    flex-direction: column;
                    /* justify-content: center; */
                    align-items: center;
                    gap: 10px;
                    width: 100%;
                    overflow-y: auto;
                    overflow-x: hidden;
                    icon-button {
                        width: 100%;
                        height: 40px;
                        flex: 0 0 40px;
                        --icon-height: 100%;
                    }

                    icon-button[selected] {
                        border-radius: 5px;
                        background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                    }

                    icon-button:hover {
                        background: var(--list-icon-button-hover, rgba(255, 255, 255, 0.1));
                        &[selected] {
                        border-radius: 5px;
                            background: var(--list-icon-button-selected, rgba(255, 255, 255, 0.1));
                        }
                    }
                }
            `
        ]
    }

    requestIcon(item) {
        switch (item.type) {
            case 1:
                return item.payload?.gender ? "sportsman-woman-solid" : "sportsman-man-solid"
            case 2:
                return item.payload?.gender ? "referee-woman-solid" : "referee-man-solid"
            case 3:
                return item.payload?.gender ? "trainer-woman-solid" : "trainer-man-solid"
            case 4:
                return item.payload?.gender ? "federation-member-woman-solid" : "federation-member-man-solid"
            default:
                return "sportsman-man-solid"
        }
    }

    render() {
        return html`
            ${this.item?.items?.map((item, index) =>
                html `
                    <icon-button
                        label=${ item?.name }
                        title=${ new Date(item?.date).toLocaleString() }
                        icon-name=${ item?.icon || this.requestIcon(item)}
                        ?selected=${this.currentItem === item}
                        .status=${ { name: item?.status?.name || 'Не определен', icon: 'status1-solid'} }
                        @click=${() => this.showItem(item)}
                    ></icon-button>
                `
            )}
        `
    }

    async showItem(item) {
        if (this.isModified) {
            const modalResult = await this.confirmDialogShow('Запись была изменена. Сохранить изменения?')
            if (modalResult === 'Ok') {
                await this.item.saveItem(this.currentItem);
            }
            else {
                await this.cancelItem()
            }
        }
        else {
            this.item.setCurrentItem(item)
        }
    }

    // async firstUpdated() {
    //     super.firstUpdated();
    //     this.isFirst  = false;
    //     this.avatar = null; // await this.downloadAvatar();
    //     this.isFirst = true;
    // }
}

customElements.define("my-federation-member-section-2-list-1", MyFederationMemberSection2List1);