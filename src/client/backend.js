const getAuthorizationField = () => {
    let token = window.sessionStorage.getItem('token');

    if (token !== null) {
        return 'token ' + token;
    } else {
        return null;
    }
};


const getJSON = (path) => fetch(path, {
    headers: new Headers({
        'Authorization': getAuthorizationField()
    })
}).then(res => res.json())
  .catch((err) => {
    console.error(err);
    throw err;
});

const postJSON = (path, data) => fetch(path, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: new Headers({
        'Content-Type': 'application/json',
        'Authorization': getAuthorizationField()
    })
}).catch((err) => {
    console.error(err);
    throw err;
});


module.exports = {
    getJSON,
    postJSON
};