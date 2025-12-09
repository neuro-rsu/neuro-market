import DataSet from "./my-competition-section-2-dataset.mjs";

import { States } from "../../../../utils.js";

export default class DataSource {
    #lock = false
    #oldItem
    sortDirection = true
    constructor(component, dataSet) {
        this.component = component
        this.items = [...dataSet].sort( (a, b) => {
            let r = a.lastName.localeCompare(b.lastName)
            if (r) {
                return r
            }
            r = a.firstName.localeCompare(b.firstName)
            if (r) {
                return r
            }
            r = a.middleName?.localeCompare(b.firstName)
            if (r) {
                return r
            }
            return 0
        })
        this.init()
        this.state = States.BROWSE
    }

    init() {
        if (this.items.length) {
            let itemId = sessionStorage.getItem('currentCompetitionSportsman')
            let item
            if (itemId) {
                item = this.items.find((item) => item.id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem('currentCompetitionSportsman', item.id)
            this.component.currentItem = item
        } else {
            this.component.currentItem = {}
        }
    }

    sort(sortDirection) {
        this.sortDirection = sortDirection
        this.items.sort( (a, b) => {
            [a, b] = sortDirection ? [a, b] : [b, a]
            let r = a.lastName?.localeCompare(b.lastName)
            if (r) {
                return r
            }
            r = a.firstName?.localeCompare(b.firstName)
            if (r) {
                return r
            }
            r = a.middleName?.localeCompare(b.firstName)
            if (r) {
                return r
            }
            return 0
        })
    }

    getTeamCategories(team) {
        let sum = 0
        let categories = {
            men: new Map([["МСМК", 0], ["МС", 0], ["КМС", 0], ["I", 0], ["II", 0], ["III", 0], ["I юн", 0], ["II юн", 0], ["III юн", 0], ["б/р"]]),
            women: new Map([["МСМК", 0], ["МС", 0], ["КМС", 0], ["I", 0], ["II", 0], ["III", 0], ["I юн", 0], ["II юн", 0], ["III юн", 0], ["б/р"]]),
        }
        // const categoryNames = ["МСМК", "МС", "КМС", "I", "II", "III", "I юн", "II юн", "II юн", "б/р"]
        team.forEach(athlete => {
                if (athlete?.gender == 0) {
                    let category = categories.men.get(athlete.category?.shortName) ?? 0
                    category++
                    categories.men.set(athlete.category?.shortName, category)
                } else {
                    let category = categories.women.get(athlete.category?.shortName) ?? 0
                    category++
                    categories.women.set(athlete.category?.shortName, category)
                }
        })
        return categories;
    }

    sportsCategories() {
        let categories = {
            columns: ['Разряд', 'Мужчины', 'Женщины', 'Итого'],
            indexes: ['МСМК', 'МС', 'КМС', 'I', 'II', 'III', 'I юн', 'II юн', 'III юн', 'б/р'],
            rows: Array(11).fill(0).map(item => Array(4).fill(0)),
            footer: ['Всего:', 0, 0, 0]
        }
        this.items.forEach(athlete => {
            const column = categories.columns.indexOf(athlete.gender == 0 ? 'Мужчины' : 'Женщины')
            const index = categories.indexes.indexOf(athlete.category?.shortName)
            categories.rows[index][column]++
        })
        categories.rows.forEach(element => {
            element[categories.columns.length - 1] = element[1] + element[2]
            categories.footer[1] += element[1]
            categories.footer[2] += element[2]
            categories.footer[3] += element[categories.columns.length - 1]
        });
        categories.rows = categories.rows.filter( (item, index) => {
            if (item.at(-1) == 0) {
                categories.indexes[index] = ''
                return false
            }
            return true
        })
        categories.indexes = categories.indexes.filter(value => value)
        return categories
    }

    async clubTypes() {
        const ClubTypesDataset = await import('../../my-club-types/my-club-types-dataset.mjs');
        const clubTypes = await ClubTypesDataset.default.getDataSet()

        let categories = {
            columns: ['Вид', 'Мужчины', 'Женщины', 'Итого'],
            indexes: clubTypes.map(item => item.name),
            rows: Array(clubTypes.length).fill(0).map(item => Array(4).fill(0)),
            footer: ['Всего:', 0, 0, 0]
        }
        this.items.forEach(athlete => {
            const column = categories.columns.indexOf(athlete.gender == 0 ? 'Мужчины' : 'Женщины')
            const index = categories.indexes.indexOf(athlete?.club?.type?.name)
            if (index != -1) {
                categories.rows[index][column]++
            }
        })
        categories.rows.forEach(element => {
            element[categories.columns.length - 1] = element[1] + element[2]
            categories.footer[1] += element[1]
            categories.footer[2] += element[2]
            categories.footer[3] += element[categories.columns.length - 1]
        });
        categories.rows = categories.rows.filter( (item, index) => {
            if (item.at(-1) == 0) {
                categories.indexes[index] = ''
                return false
            }
            return true
        })
        categories.indexes = categories.indexes.filter(value => value)
        return categories
    }

    getTeamPoints(team) {
        let sum = 0
        let gold = 0
        let silver = 0
        let bronze = 0
        // let categories = new Map()
        const sportDisciplines = ["shooting", "pullUps", "pushUps", "swimming", "throwing", "sprinting", "running", "skiing", "rollerSkiing", "jumping"]
        team.forEach(athlete => {
            sportDisciplines.forEach(discipline => {
                sum += +(athlete[discipline]?.points ?? 0)
                gold += athlete[discipline]?.place == 1 ? 1 : 0
                silver += athlete[discipline]?.place == 2 ? 1 : 0
                bronze += athlete[discipline]?.place == 3 ? 1 : 0
                // let category = categories.get(athlete.category.shortName) ?? 0
                // category++
                // categories.set(athlete.category.shortName, category)
            })
        })
        team.medals = { gold, silver, bronze}
        // team.categories = categories
        return sum;
    }

    getClubPoints(team) {
        let sum = 0
        let gold = 0
        let silver = 0
        let bronze = 0
        // let categories = new Map()
        const sportDisciplines = ["shooting", "pullUps", "pushUps", "swimming", "throwing", "sprinting", "running", "skiing", "rollerSkiing", "jumping"]
        team.forEach(athlete => {
            sportDisciplines.forEach(discipline => {
                sum += +(athlete[discipline]?.points ?? 0)
                gold += athlete[discipline]?.place == 1 ? 1 : 0
                silver += athlete[discipline]?.place == 2 ? 1 : 0
                bronze += athlete[discipline]?.place == 3 ? 1 : 0
                // let category = categories.get(athlete.category.shortName) ?? 0
                // category++
                // categories.set(athlete.category.shortName, category)
            })
        })
        team.medals = { gold, silver, bronze}
        // team.categories = categories
        return sum;
    }

    getTeamResults() {
        const teams = new Map()
        this.items.forEach(item => {
            const team = teams.get(item.region?._id) ?? []
            team.push(item)
            if (team.length === 1) {
                teams.set(item.region?._id, team)
            }
        })
        const result = Array.from(teams.values(), team => ({
            place: 1,
            region: team[0].region,
            points: this.getTeamPoints(team),
            team: team,
            categories: this.getTeamCategories(team),
        }))
        result.sort((a, b) => b.points - a.points).forEach( (value, index) => value.place = index + 1)
        return result
    }

    getClubResults() {
        const teams = new Map()
        this.items.forEach(item => {
            const team = teams.get(item.club?._id) ?? []
            team.push(item)
            if (team.length === 1) {
                teams.set(item.club?._id, team)
            }
        })
        const result = Array.from(teams.values(), team => ({
            place: 1,
            club: team[0].club,
            points: this.getClubPoints(team),
            team: team,
        }))
        result.sort((a, b) => b.points - a.points).forEach( (value, index) => value.place = index + 1)
        return result
    }

    filter(value) {
        this.items = this.dataSet.filter(item => {
            return item?.country?.name === value?.name
        }).sort( (a, b) => a.name.localeCompare(b.name) )
    }

    getCurrentItem(){
        const item = sessionStorage.getItem('currentCompetitionSportsman')
        if (item) {
            return this.items.find(p => p._id === item)
        } else {
            sessionStorage.setItem('currentCompetitionSportsman', this.items[0]?._id)
            return this.items?.[0]
        }
    }

    setCurrentItem(item) {
        sessionStorage.setItem('currentCompetitionSportsman', item._id)
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
