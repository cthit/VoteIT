if (!window.fetch) {
    require('whatwg-fetch');
    window.fetch = fetch;
}

const getAuthorizationField = () => {
    let token = window.sessionStorage.getItem('token');

    if (token !== null) {
        return 'token ' + token;
    } else {
        return null;
    }
};

const fetcher = (path, opts) => fetch(path, opts)
    .then(resp => {
        if (resp.ok) {
            return resp;
        } else {
            if (resp.status === 401) {
                // Unauthorized, remove token
                window.sessionStorage.removeItem('token')
            }
            throw resp;
        }
    });


const getJSON = (path) => fetcher(path, {
    headers: new Headers({
        'Authorization': getAuthorizationField()
    })
}).then(res => res.json());

const postJSON = (path, data) => fetcher(path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': getAuthorizationField()
    })
});


module.exports = {
    getJSON,
    postJSON
};
