import refreshToken, {getToken} from "../../refresh-token.mjs";

import {HOST} from "../../neuro-market-config.mjs";

export default class DataSet {
    static #dataSet;

    static async getDataSet() {
        if (DataSet.#dataSet) {
            return DataSet.#dataSet
        }
        DataSet.#dataSet = await DataSet.#getItems()
        return DataSet.#dataSet
    }

    static getLast() {
        if (DataSet.#dataSet || DataSet.#dataSet.length) {
            return DataSet.#dataSet[0]
        }
    }

    static find(name, value) {
        const index = DataSet.#dataSet.findIndex(element =>
            element[name] === value || element[name].toLowerCase() === value
        )
        return index === -1 ? null : DataSet.#dataSet[index]
    }

    static #fetchGetItems() {
        return fetch(`https://${HOST}:${PORT}/api/sportsmen`)
    }

    static async #getItems() {
        let response = await DataSet.#fetchGetItems()
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        // const items = result.rows.map(item => {
        //     return item.doc;
        // })
        // const items = result.rows.map(item => {
        //     return {_id: item.id, ...item.value};
        // })
        return result.rows
    }

    static #fetchGetAllItems(token) {
        return fetch(`https://${HOST}:${PORT}/api/sportsmen/all`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getAllItems() {
        let token = getToken()
        let response = await DataSet.#fetchGetAllItems(token)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetAllItems(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        // const items = result.rows.map(item => {
        //     return item.doc;
        // })
        // const items = result.rows.map(item => {
        //     return {_id: item.id, ...item.value};
        // })
        return result.rows
    }

    static fetchAddItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async addItem(item) {
        let token = getToken();
        let response = await DataSet.fetchAddItem(token, item)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchAddItem(token, item)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const newItem = await DataSet.getItem(result.id)
        return newItem
    }

    static createListItem(newItem) {
        let key = newItem.lastName
        if (newItem.firstName) {
            key += ' ' + newItem.firstName
        }
        if (newItem.middleName) {
            key += ' ' + newItem.middleName[0] + '.'
        }
        return {
            id: newItem._id,
            key,
            value: {
                sportsmanPC: newItem.sportsmanPC,
                gender: newItem.gender,
            }
        }
    }

    static addToDataset(newItem) {
        const listItem = DataSet.createListItem(newItem)
        DataSet.#dataSet.push(listItem)
        return listItem;
    }

    static #fetchGetItem(itemId) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman/${itemId}`)
    }

    static async getItem(itemId) {
        let response = await DataSet.#fetchGetItem(itemId)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetItemBySportsmanPC(token, itemId) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman-pc/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItemBySportsmanPC(itemId) {
        let token = getToken();

        let response = await DataSet.#fetchGetItemBySportsmanPC(token, itemId)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetItemBySportsmanPC(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetItemByLastName(token, itemId) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman/last-name/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItemByLastName(itemId) {
        let token = getToken();

        let response = await DataSet.#fetchGetItemByLastName(token, itemId)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetItemByLastName(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchSaveItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman/${item._id}`, {
            method: "PUT",
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async saveItem(item) {
        let token = getToken();

        let response = await DataSet.#fetchSaveItem(token, item)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchSaveItem(token, item)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        DataSet.#afterSave(item, result)
    }

    static #afterSave(item, itemHeader) {
        item._rev = itemHeader.rev;
    }

    static #fetchDeleteItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman/${item._id}?rev=${item._rev}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async deleteItem(item, listItem) {
        let token = getToken();

        let response = await DataSet.#fetchDeleteItem(token, item)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchDeleteItem(token, item)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }

        DataSet.#deleteFromDS(listItem)
    }

    static #deleteFromDS(listItem) {
        const itemIndex = DataSet.#dataSet.indexOf(listItem)
        if (itemIndex === -1) {
            return
        }
        DataSet.#dataSet.splice(itemIndex, 1)
    }

    static fetchCreateSportsmanPC(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman-pc`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async createSportsmanPC(item) {
        let token = getToken();
        let response = await DataSet.fetchCreateSportsmanPC(token, item)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchCreateSportsmanPC(token, item)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result.number
    }

    static fetchGetQRCode(token, data) {
        return fetch(`https://${HOST}:${PORT}/api/qr-code?data=${data}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
        })
    }

    static async getQRCode(data) {
        let token = getToken();
        let response = await DataSet.fetchGetQRCode(token, btoa(data))

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchGetQRCode(token, btoa(data))
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result.qr
    }
}
