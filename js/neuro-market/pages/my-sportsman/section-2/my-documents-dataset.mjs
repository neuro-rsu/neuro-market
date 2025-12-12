import refreshToken, {getToken} from "../../../refresh-token.mjs";

import {HOST, PORT} from "../../../neuro-market-config.mjs";

export default class DataSet {
    static #dataSet;
    static #parentId;

    static async getDataSet(id) {
        if (!DataSet.#dataSet || DataSet.#parentId != id) {
            DataSet.#dataSet = await DataSet.#getItems(id)
            DataSet.#parentId = id
        }
        return DataSet.#dataSet
    }

    static find(name, value) {
        const index = DataSet.#dataSet.findIndex(element =>
            element[name] === value || element[name].toLowerCase() === value
        )
        return index === -1 ? null : DataSet.#dataSet[index]
    }

    static #fetchGetItems(token, id) {
        return fetch(`https://${HOST}:${PORT}/api/federation-members/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async #getItems(id) {
        let token = getToken()
        let response = await DataSet.#fetchGetItems(token, id)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetItems(token, id)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = result.rows.map(item => {
            return item.doc;
        })
        return items
    }

    static fetchAddItem(token, item, id) {
        return fetch(`https://${HOST}:${PORT}/api/competition-sportsman/${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async addItem(item) {
        let token = getToken()
        let response = await DataSet.fetchAddItem(token, item, DataSet.#parentId)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchAddItem(token, item, DataSet.#parentId)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }

        const newItem = await DataSet.getItem(result.id)
        DataSet.addToDataset(newItem)
        return newItem
    }

    static addToDataset(item) {
        DataSet.#dataSet.push(item);
    }

    static #fetchGetItem(itemId) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member/${itemId}`)
    }

    static async getItem(itemId) {
        let response = await DataSet.#fetchGetItem(itemId)

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchSaveItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member`, {
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
        return fetch(`https://${HOST}:${PORT}/api/federation-member/${item._id}?rev=${item._rev}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async deleteItem(item) {
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

        DataSet.#deleteFromDS(item)
    }

    static #deleteFromDS(item) {
        const itemIndex = DataSet.#dataSet.indexOf(item)
        if (itemIndex === -1) {
            return
        }
        DataSet.#dataSet.splice(itemIndex, 1)
    }

    static fetchGetQRCode(token, data) {
        return fetch(`https://${HOST}:${PORT}/api/qr-code?${data}`, {
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
