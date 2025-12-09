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

    static find(name, value) {
        return DataSet.#dataSet.find(element =>
            element[name] === value || element[name].toLowerCase() === value
        )
    }

    static #fetchGetItems() {
        return fetch(`https://${HOST}:${PORT}/api/federation-members`)
    }

    static async #getItems() {
        let response = await DataSet.#fetchGetItems()
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = result.rows.map(item => {
            return item.doc;
        })
        return items
    }

    static fetchAddItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member`, {
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
        // DataSet.addToDataset(newItem)
        return newItem
    }

    static addToDataset(item) {
        DataSet.#dataSet.unshift(item);
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

    static #fetchGetItemByFederationMemberPC(token, itemId) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member-pc/${itemId}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItemByFederationMemberPC(itemId) {
        let token = getToken();

        let response = await DataSet.#fetchGetItemByFederationMemberPC(token, itemId)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetItemByFederationMemberPC(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetItemByLastName(token, itemId) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member/last-name/${itemId}`, {
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
        return fetch(`https://${HOST}:${PORT}/api/federation-member/${item._id}`, {
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

    static fetchCreateFederationMemberPC(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member-pc`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(item)
        })
    }

    static async createFederationMemberPC(item) {
        let token = getToken();
        let response = await DataSet.fetchCreateFederationMemberPC(token, item)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchCreateFederationMemberPC(token, item)
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
