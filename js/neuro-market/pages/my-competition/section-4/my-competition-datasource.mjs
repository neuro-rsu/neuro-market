import DataSet from "./my-competition-dataset.mjs";

export default class DataSource {

    constructor(component) {
        this.component = component;
        this.item = {};
        this.component.currentItem = this.item;
    }

    async getItem() {
        const id = sessionStorage.getItem('competition')
        if (id === 'new') {
            this.item = {};
            this.component.currentItem = this.item;
        } else {
            this.item = await DataSet.getItem(id)
            this.setCurrentItem(this.item)
        }
        return this.item;
    }

    async getTeams() {
        const id = sessionStorage.getItem('competition')
        if (id === 'new') {
            this.item = {};
            this.component.currentItem = this.item;
        } else {
            this.item = await DataSet.getItem(id)
            this.setCurrentItem(this.item)
        }
        return this.item;
    }

    setCurrentItem(item) {
        sessionStorage.setItem('competition', item._id)
        this.component.currentItem = item;
    }

    async addItem(item) {
        const newItem = await DataSet.addItem(item)
        this.addTo(newItem)
    }

    addTo(item) {
        this.item = item
        this.setCurrentItem(item)
    }

    async saveItem(item) {
        await DataSet.saveItem(item)
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
    }
}
