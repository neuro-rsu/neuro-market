import DataSet from "./my-competition-section-5-dataset.mjs";

import { States } from "../../../../utils.js";

export default class DataSource {
    #lock = false
    #oldItem

    constructor(component, dataSet) {
        this.component = component
        this.items = [...dataSet]
        this.init()
        this.state = States.BROWSE
    }

    init() {
        if (this.items.length) {
            let itemId = sessionStorage.getItem('currentCompetitionReferee')
            let item
            if (itemId) {
                item = this.items.find((item) => item.id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem('currentCompetitionReferee', item.id)
            this.component.currentItem = item
        } else {
            this.component.currentItem = {}
        }
    }

    filter(value) {
        this.items = this.dataSet.filter(item => {
            return item?.country?.name === value?.name;
        }).sort( (a, b) => a.name.localeCompare(b.name) )
    }

    getCurrentItem(){
        const item = sessionStorage.getItem('currentCompetitionReferee')
        if (item) {
            return this.items.find(p => p._id === item)
        }
        else {
            sessionStorage.setItem('currentCompetitionReferee', this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentCompetitionReferee', item._id)
        this.component.currentItem = item
    }

    async saveFirstItem(item) {
        const newItem = await DataSet.addItem(item)
        const listItem = DataSet.addToDataset(newItem)
        this.addTo(newItem, listItem)
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
        this.setCurrentItem(item)
    }

    async saveNewItem(item) {
        const newItem = await DataSet.addItem(item)
        const listItem = DataSet.addToDataset(newItem)
        this.addToDataSource(newItem, listItem)
        this.state = States.BROWSE
    }

    cancelNewItem() {
        this.component.currentItem = this.#oldItem
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

    async saveItem(item, listItem) {
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
            this.setCurrentItem({})
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
