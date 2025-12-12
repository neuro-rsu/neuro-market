import {HOST, PORT} from "./neuro-market-config.mjs";

export default async function refreshToken(token) {
    const exitToken = getExitToken()
    const response = await fetch(`https://${HOST}:${PORT}/api/refresh-token`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        headers: {
                'Authorization': `Bearer ${exitToken}`,
                'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: "include",
    })

    const result = await response.json()

    if (!response.ok) {
        throw new Error(result.error)
    }

    const newToken = result.accessToken
    saveAccessToken(newToken)
    return newToken
}

export function  getToken() {
    return localStorage.getItem('rememberMe') ? localStorage.getItem('accessUserToken') : sessionStorage.getItem('accessUserToken')
}

function  getExitToken() {
    return localStorage.getItem('rememberMe') ? localStorage.getItem('exitUserToken') : sessionStorage.getItem('exitUserToken')
}

export function saveAccessToken(token) {
    if (localStorage.getItem('rememberMe')) {
        localStorage.setItem('accessUserToken', token)
    }
    else {
        sessionStorage.setItem('accessUserToken', token)
    }
    return token;
}

export function saveExitToken(token) {
    if (localStorage.getItem('rememberMe')) {
        localStorage.setItem('exitUserToken', token)
    }
    else {
        sessionStorage.setItem('exitUserToken', token)
    }
    return token;
}