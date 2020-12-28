import url from '../hsintian_url'

export function getData(endpoint) {
    return new Promise((resolve, reject) => {
        fetch(`${url}${endpoint}`, {
            method: "GET"
        })
        .then(resp => resp.json())
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
}

export function postData(endpoint, body) {
    return new Promise((resolve, reject) => {
        fetch(`${url}${endpoint}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(body)
        })
        .then(resp => resp.json())
        .then(data => resolve(data))
        .catch(error => reject(error))
    })
}