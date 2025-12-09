import DataSet from "./my-federation-members-dataset.mjs";

import { States } from "../../../utils.js";

export default class DataSource {

    #lock = false

    #oldItem
    sortDirection = true

    constructor(component, dataSet) {
        this.component = component;
        this.dataSet = dataSet;
        this.items = this.dataSet.map(item => {
            return item;
        }).sort( (a, b) => (a.lastName || a.name || '')?.localeCompare(b.lastName || b.name || '') )
        this.state = States.BROWSE
    }

    async init() {
        if (this.items.length) {
            let itemId = sessionStorage.getItem('currentFederationMember')
            let item
            if (itemId) {
                item = this.items.find((item) => item._id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem('currentFederationMember', item._id)
            this.component.currentItem = item
        } else {
            this.component.currentItem = {}
        }
    }

    async filter(value) {
        this.items = (await DataSet.getDataSet()).filter(item => {
            return value?.lastName && item?.key.includes(value.lastName)
                || value?.gender && item?.value?.gender == value?.gender
                || value?.category && item?.value?.category.shortName == value?.category
        }).sort( (a, b) => this.sortDirection ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key))
        return this.items?.[0]
    }

    async clearFilter() {
        this.items = (await DataSet.getDataSet()).sort( (a, b) => this.sortDirection ? a.key.localeCompare(b.key) : b.key.localeCompare(a.key))
        return this.items?.[0]
    }

    // filter(value) {
    //     this.items = this.dataSet.filter(item => {
    //         return item?.country?.name === value?.name;
    //     }).sort( (a, b) => a.name.localeCompare(b.name) )
    // }

    find(value) {
        return this.items.find(item =>
            item?.key?.includes(value?.lastName)
        )
    }

    findIndex(value) {
        return this.items.findIndex(item =>
            item?.key?.includes(value?.lastName)
        )
    }

    sort(sortDirection) {
        this.sortDirection = sortDirection
        this.items.sort( (a, b) =>
            sortDirection ? a.lastName?.localeCompare(b.lastName) : b.lastName?.localeCompare(a.lastName)
        )
    }

    async getCurrentItem(item_id){
        return await this.setCurrentItem(item_id)
    }

    async setCurrentItem(item) {
        sessionStorage.setItem('currentFederationMember', item._id)
        this.component.currentItem = item
    }

    async saveFirstItem(item) {
        const newItem = await DataSet.addItem(item)
        this.addTo(newItem)
    }

    async addNewItem(item) {
        this.#oldItem = this.component.currentItem
        this.state = States.NEW
        this.component.currentItem = {}
    }

    async addItem(item) {
        const newItem = await DataSet.addItem(item)
        if (!this.#lock) {
            this.addToDataSource(newItem)
        }
    }

    addToDataSource(item) {
        this.items.push(item)
        this.items.sort( (a, b) => a._id.localeCompare(b._id))
        sessionStorage.setItem('currentFederationMember', item._id)
        this.component.currentItem = item
    }

    async saveNewItem(item) {
        const newItem = await DataSet.addItem(item)
        DataSet.addToDataset(newItem)
        this.addToDataSource(newItem)
        this.state = States.BROWSE
    }

    cancelNewItem() {
        this.component.currentItem = this.#oldItem || {}
        this.#oldItem = null
        this.state = States.BROWSE
    }

    lock() {
        this.#lock = true;
    }

    async unlock() {
        if (this.#lock) {
            this.items = this.dataSet.map(item => {
                return item;
            }).sort( (a, b) => a.key.localeCompare(b.key) )
            await this.init()
            this.#lock = false;
        }
    }

    async saveItem(item) {
        await DataSet.saveItem(item)
        this.state = States.BROWSE
    }

    async deleteItem(item) {
        await DataSet.deleteItem(item)
        this.deleteFrom(item)
    }

    deleteFrom(item) {
        const currentIndex = this.items.indexOf(item)
        if (this.items.length === 1) {
            sessionStorage.removeItem('currentFederationMember')
            this.component.currentItem = {}
        }
        else if (currentIndex === 0) {
            this.setCurrentItem(this.items[currentIndex + 1])
        }
        else {
            this.setCurrentItem(this.items[currentIndex - 1])
        }
        this.items.splice(currentIndex, 1)
        this.state = States.BROWSE
    }
}
