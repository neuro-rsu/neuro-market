import DataSet from "./my-clubs-dataset.mjs";

export default class DataSource {

    constructor(component, dataSet) {
        this.component = component;
        this.dataSet = dataSet;
        this.items = this.dataSet.map(item => {
            return item;
        }).sort( (a, b) => a.name.localeCompare(b.name) )
        this.component.currentItem = this.getCurrentItem();
    }

    getCurrentItem(){
        const item = sessionStorage.getItem('currentClub')
        if (item) {
            return this.items.find(p => p._id === item)
        }
        else {
            sessionStorage.setItem('currentClub', this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentClub', item._id)
        this.component.currentItem = item;
    }

    find(name, value) {
        const index = this.dataSet.findIndex(element =>
            element[name] === value || element[name].toLowerCase() === value || element[name].toLowerCase().include(value.toLowerCase())
        )
        return index === -1 ? null : this.dataSet[index]
    }

    filter(name, value) {
        return this.dataSet.filter(element =>
            element[name] === value || element[name].toLowerCase() === value || element[name].toLowerCase().includes(value.toLowerCase())
        )
    }

    regionFilter(value) {
        this.items = this.dataSet.filter( element => element.city?.region?._id === value )
    }

    async addItem(item) {
        const newItem = await DataSet.addItem(item)
        this.addTo(newItem)
    }

    addTo(item) {
        this.items.unshift(item)
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
