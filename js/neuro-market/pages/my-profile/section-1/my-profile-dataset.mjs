import refreshToken, {getToken} from "../../../refresh-token.mjs";

import {HOST} from "../../../neuro-market-config.mjs";

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

    static #fetchGetItems(token) {
        return fetch(`https://${HOST}:${PORT}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async #getItems() {
        let token = getToken()
        let response = await DataSet.#fetchGetItems(token)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetItems(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        const items = [result]
        return items
    }

    static fetchAddItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/country`, {
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
        DataSet.addToDataset(newItem)
        return newItem
    }

    static addToDataset(item) {
        DataSet.#dataSet.unshift(item);
    }

    static #fetchGetItem(token, itemId) {
        return fetch(`https://${HOST}:${PORT}/api/profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getItem(itemId) {
        let token = getToken();

        let response = await DataSet.#fetchGetItem(token, itemId)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetItem(token, itemId)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchSaveItem(token, item) {
        return fetch(`https://${HOST}:${PORT}/api/profile`, {
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
        return fetch(`https://${HOST}:${PORT}/api/profile/?rev=${item._rev}`, {
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

    static fetchUploadAvatar(token, formData) {
        return fetch(`https://${HOST}:${PORT}/api/upload/avatar`, {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData
        })
    }

    static async uploadAvatar(avatar) {
        let token = getToken();
        const formData = new FormData();
        formData.append("file", avatar);
        let response = await DataSet.fetchUploadAvatar(token, formData)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchUploadAvatar(token, formData)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    // static fetchUploadAvatar(token, formData) {
    //     return fetch(`https://${HOST}:${PORT}/api/upload/avatar`, {
    //         method: "POST",
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //         },
    //         body: formData
    //     })
    // }

    // static async uploadAvatar(avatar) {
    //     let token = getToken();
    //     const formData = new FormData();
    //     formData.append("file", avatar);
    //     let response = await DataSet.fetchUploadAvatar(token, formData)
    //     if (response.status === 419) {
    //         token = await refreshToken(token)
    //         response = await DataSet.fetchUploadAvatar(token, formData)
    //     }
    //     const result = await response.json()
    //     if (!response.ok) {
    //         throw new Error(result.error)
    //     }
    //     return result
    // }

    // static fetchDownloadAvatar(token) {
    //     return fetch(`https://${HOST}:${PORT}/api/upload/avatar`, {
    //         method: "GET",
    //         headers: {
    //             'Authorization': `Bearer ${token}`,
    //         },
    //     })
    // }

    // static async downloadAvatar() {
    //     let token = getToken();
    //     let response = await DataSet.fetchDownloadAvatar(token)
    //     if (response.status === 419) {
    //         token = await refreshToken(token)
    //         response = await DataSet.fetchDownloadAvatar(token)
    //     }

    //     if (!response.ok) {
    //         // const result = await response.json()
    //         // throw new Error(result.error)
    //         return null
    //     }

    //     const blob = await response.blob()

    //     return blob ? window.URL.createObjectURL(blob) : blob;
    // }

    static fetchDownloadAvatar(token) {
        return fetch(`https://${HOST}:${PORT}/api/upload/avatar`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
    }

    static async downloadAvatar() {
        let token = getToken();
        let response = await DataSet.fetchDownloadAvatar(token)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchDownloadAvatar(token)
        }

        if (!response.ok) {
            return null
        }

        const blob = await response.blob()

        return blob ? window.URL.createObjectURL(blob) : blob;
    }


    static fetchDeleteAvatar(token) {
        return fetch(`https://${HOST}:${PORT}/api/upload/avatar`, {
            method: "DELETE",
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
    }

    static async deleteAvatar() {
        let token = getToken();
        let response = await DataSet.fetchDeleteAvatar(token)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchDeleteAvatar(token)
        }
        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static fetchTelegramToken(token) {
        return fetch(`https://${HOST}:${PORT}/api/telegram-token`, {
            method: "GET",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        })
    }

    static async telegramToken() {
        let token = getToken();
        let response = await DataSet.fetchTelegramToken(token)
        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.fetchTelegramToken(token)
        }

        const result = await response.json()
        if (!response.ok) {
            throw new Error(result.error)
        }
        return result.token
    }

    static #fetchGetSportsmanProfile(token) {
        return fetch(`https://${HOST}:${PORT}/api/sportsman-profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getSportsmanProfile() {
        let token = getToken();

        let response = await DataSet.#fetchGetSportsmanProfile(token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetSportsmanProfile(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetRefereeProfile(token) {
        return fetch(`https://${HOST}:${PORT}/api/referee-profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getRefereeProfile() {
        let token = getToken();

        let response = await DataSet.#fetchGetRefereeProfile(token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetRefereeProfile(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetTrainerProfile(token) {
        return fetch(`https://${HOST}:${PORT}/api/trainer-profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getTrainerProfile() {
        let token = getToken();

        let response = await DataSet.#fetchGetTrainerProfile(token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetTrainerProfile(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

    static #fetchGetFederationMemberProfile(token) {
        return fetch(`https://${HOST}:${PORT}/api/federation-member-profile`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
    }

    static async getFederationMemberProfile() {
        let token = getToken();

        let response = await DataSet.#fetchGetFederationMemberProfile(token)

        if (response.status === 419) {
            token = await refreshToken(token)
            response = await DataSet.#fetchGetFederationMemberProfile(token)
        }

        const result = await response.json()

        if (!response.ok) {
            throw new Error(result.error)
        }
        return result
    }

}
