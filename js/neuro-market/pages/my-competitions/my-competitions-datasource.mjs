import DataSet from "./my-competitions-dataset.mjs";

export default class DataSource {

    constructor(component, dataSet) {
        this.component = component;
        this.dataSet = dataSet;
        const currentDate = new Date(Date.now())
        this.items = this.dataSet.map(item => {
            return item;
        }).sort( (a, b) => this.compareCompetitions(a , b, currentDate) )
        this.component.currentItem = this.getCurrentItem();
    }

    dateCompare(startDate) {
        if (startTime === null) {
            const list = listASC || sortASC();
            list.forEach((item) => {
                if (item.hidden) {
                    item.hidden = false;
                }
            })
        }
        else if (startTime.toISOString().split('T')[0] === (new Date()).toISOString().split('T')[0]) {
            const list = listNative || sortNative();
            list.forEach((item) => {
                if (item.hidden) {
                    item.hidden = false;
                }
            })
        }
        else {
            const list = listASC || sortASC();
            list.forEach((item) => {
                const competitionDate = item.querySelector('.poly-dates span');
                // const competitionStartTime = competitionDate?.dataset.start;
                let competitionEndTime = competitionDate?.dataset.end;
                item.hidden = startTime > new Date(competitionEndTime);
            })
        }
    }

    competitionTypeFilter(value) {
        return (value === '--Наименование--') ?
            () => true :
            item => item.name.name === value
    }

    competitionStatusFilter(value, currentDate) {
        if (value === '--Статус--') {
            return () => true
        }

        if (value === 'Текущее') {
            return item => {
                const startDate = new Date(item.startDate)
                const endDate = new Date(item.endDate)
                return currentDate >= startDate && currentDate <= endDate
            }
        }

        if (value === 'Ближайшее') {
            let nextDate = new Date(currentDate)
            nextDate.setMonth(nextDate.getMonth() + 1)
            return item => {
                const startDate = new Date(item.startDate)
                return currentDate < startDate && startDate <= nextDate
            }
        }

        if (value === 'Прошедшее') {
            return item => {
                const endDate = new Date(item.endDate)
                return currentDate > endDate
            }
        }
        return () => true
    }

    startDateFilter(value, currentDate) {
        if (value === '')
            return () => true
    }

    compareCompetitions(a, b, currentDate) {
        const startDateA = new Date(a.startDate)
        const startDateB = new Date(b.startDate)
        const endDateA = new Date(a.endDate)
        const endDateB = new Date(b.endDate)
        if (endDateA < currentDate && endDateB >= currentDate) {
            return 1
        }
        if (endDateB < currentDate && endDateA >= currentDate) {
            return -1
        }
        const result = startDateA - startDateB
        return result ? result: endDateA - endDateB
    }

    filter(date, status, type) {
        const currentDate = new Date(date)
        const competitionTypeFilter = this.competitionTypeFilter(type?.name ?? '--Наименование--')
        const competitionStatusFilter = this.competitionStatusFilter(status?.name ?? '--Статус--', currentDate)
        this.items = this.dataSet.filter ( item =>
            competitionTypeFilter(item) && competitionStatusFilter(item)
        )
        .sort((a, b) => this.compareCompetitions(a, b, currentDate))
        this.component.currentItem = this.getCurrentItem();
    }

    dateFilter(date) {

        this.dataSet.map(item => {
            return item;
        }).sort( (a, b) => b._id.localeCompare(a._id) )
    }

    getCurrentItem(){
        const item = sessionStorage.getItem('currentCompetition')
        if (item) {
            return this.items.find(p => p._id === item)
        }
        else {
            sessionStorage.setItem('currentCompetition', this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentCompetition', item._id)
        this.component.currentItem = item;
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
