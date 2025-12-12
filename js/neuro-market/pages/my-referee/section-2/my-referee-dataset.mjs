import refreshToken, {getToken} from "../../../refresh-token.mjs";

import {HOST, PORT} from "../../neuro-market-config.mjs";

export default class DataSet {
    static #dataSet;

    // static async getDataSet() {
    //     if (DataSet.#dataSet) {
    //         return DataSet.#dataSet
    //     }
    //     DataSet.#dataSet = await DataSet.#getItems()
    //     return DataSet.#dataSet
    // }

    static find(name, value) {
        const index = DataSet.#dataSet.findIndex(element =>
            element[name] === value || element[name].toLowerCase() === value
        )
        return index === -1 ? null : DataSet.#dataSet[index]
    }

    static fetchAddItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/referee`, {
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
        return fetch(`https://${HOST}:${PORT}/api/referee/${itemId}`)
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
        return fetch(`https://${HOST}:${PORT}/api/referee`, {
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
        return fetch(`https://${HOST}:${PORT}/api/my-referee//${item._id}?rev=${item._rev}`, {
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

    static fetchUploadAvatar(token, formData, refereeId) {
        return fetch(`https://${HOST}:${PORT}/api/upload/referee/avatar/${refereeId}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
    }

    static async uploadAvatar(avatar, refereeId) {
        let token = getToken();
        const formData = new FormData();
        formData.append("file", avatar);
        let response = await DataSet.fetchUploadAvatar(token, formData, refereeId)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchUploadAvatar(token, formData, refereeId)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static fetchDownloadAvatar(token, refereeId) {
        return fetch(`https://${HOST}:${PORT}/api/upload/referee/avatar/${refereeId}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
    }

    static async downloadAvatar(refereeId) {
        let token = getToken();
        let response = await DataSet.fetchDownloadAvatar(token, refereeId)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchDownloadAvatar(token, refereeId)
        }

        if (!response.ok) {
            return null
        }

        const blob = await response.blob()

        return blob ? window.URL.createObjectURL(blob) : blob;
    }
}
