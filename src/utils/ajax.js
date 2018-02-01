const baseUrl = `${location.protocol}//${location.hostname}:3000/`;
const headers = new Headers({
    'Content-Type': 'application/json',
});

export function get(action, data = {}) {
    return req(action + '?' + toStringParams(data), {
        headers,
        method: 'get',
        cache: 'reload'
    });
}

export function post(action, qParams = {}) {
    return req(action, {
        method: 'post',
        headers,
        body: parseParams(qParams)
    });


}

export async function req(action, params) {
    const response = await fetch(makeUrl(action), params);
    const json = await response.json()

    return json;
}

export function makeUrl(action) {
    return baseUrl + action;
}

export function parseParams(params) {
    return JSON.stringify(params);
}

function toStringParams(params) {
    let arr = [];

    for (const key in params) {
        if (params.hasOwnProperty(key) && typeof params[key] !== 'undefined') {
            arr.push(`${key}=${params[key]}`);
        }
    }

    return arr.join('&');
}