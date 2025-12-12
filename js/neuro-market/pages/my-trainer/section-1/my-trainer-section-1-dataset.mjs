import refreshToken, {getToken} from "../../../refresh-token.mjs";

import {HOST, PORT} from "../../../neuro-market-config.mjs";

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
        const index = DataSet.#dataSet.findIndex(element =>
            element[name] === value || element[name].toLowerCase() === value
        )
        return index === -1 ? null : DataSet.#dataSet[index]
    }

    static #fetchGetItems() {
        return fetch(`https://${HOST}:${PORT}/api/trainer`)
    }

    static async #getItems() {
        let response = await DataSet.#fetchGetItems()
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = [result]
        return items
    }

    static fetchAddItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/trainer`, {
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
        return fetch(`https://${HOST}:${PORT}/api/trainer/${itemId}`)
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
        return fetch(`https://${HOST}:${PORT}/api/trainer`, {
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
        return fetch(`https://${HOST}:${PORT}/api/my-trainer//${item._id}?rev=${item._rev}`, {
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

    static fetchUploadAvatar(token, formData, id) {
        return fetch(`https://${HOST}:${PORT}/api/upload/avatar/${id}`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
    }

    static async uploadAvatar(avatar, id) {
        let token = getToken();
        const formData = new FormData();
        formData.append("file", avatar);
        let response = await DataSet.fetchUploadAvatar(token, formData, id)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchUploadAvatar(token, formData, id)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static fetchDownloadAvatar(token, id) {
        return fetch(`https://${HOST}:${PORT}/api/upload/avatar/${id}`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
    }

    static async downloadAvatar(id) {
        let token = getToken();
        let response = await DataSet.fetchDownloadAvatar(token, id)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchDownloadAvatar(token, id)
        }

        if (!response.ok) {
            return null
        }

        const blob = await response.blob()

        return blob ? window.URL.createObjectURL(blob) : blob;
    }

    static fetchDeleteAvatar(token, id) {
        return fetch(`https://${HOST}:${PORT}/api/upload/avatar/${id}`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
    }

    static async deleteAvatar(id) {
        let token = getToken();
        let response = await DataSet.fetchDeleteAvatar(token, id)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchDeleteAvatar(token, id)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
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
