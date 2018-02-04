const headers = new Headers({
    'Content-Type': 'application/json',
})

export function get(url, data = {}) {
    return req(url + '?' + toStringParams(data), {
        headers,
        method: 'get',
        cache: 'reload'
    })
}

export function post(url, qParams = {}) {
    return req(url, {
        method: 'post',
        headers,
        body: parseParams(qParams)
    })
}

export async function req(url, params) {
    const response = await fetch(url, params)

    return await response.json()
}

export function parseParams(params) {
    return JSON.stringify(params)
}

function toStringParams(params) {
    let arr = []

    for (const key in params) {
        if (params.hasOwnProperty(key) && typeof params[key] !== 'undefined') {
            arr.push(`${key}=${params[key]}`)
        }
    }

    return arr.join('&')
}