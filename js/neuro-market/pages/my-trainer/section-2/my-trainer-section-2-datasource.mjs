import DataSet from "./my-trainer-section-2-dataset.mjs";

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
            let itemId = sessionStorage.getItem('currentTrainerSportsman')
            let item
            if (itemId) {
                item = this.items.find((item) => item.id == itemId)
            }
            item ??= this.items[0]
            sessionStorage.setItem('currentTrainerSportsman', item.id)
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
}
