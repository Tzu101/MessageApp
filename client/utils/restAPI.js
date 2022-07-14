export async function restGET(url, resolve) {

    fetch(url, {
        method: "GET", 
        mode: "cors",
        redirect: 'follow',
        headers: { "Content-Type": "application/json" }})
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
        else {
            resolve(response);
        }
    })
    .catch(err => {throw err});
}

export async function restPOST(url, data, resolve) {

    fetch(url, {
        method: "POST", 
        mode: "cors",
        redirect: 'follow',
        body: JSON.stringify(data), 
        headers: { "Content-Type": "application/json" }})
    .then(response => {
        if (response.redirected) {
            window.location.href = response.url;
        }
        else {
            resolve(response);
        }
    })
    .catch(err => {throw err});
}