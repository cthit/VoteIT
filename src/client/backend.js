const postJSON = (path, data) => fetch(path, {
    method: 'post',
    body: JSON.stringify(data),
    headers: new Headers({
        'Content-Type': 'application/json'
    })
}).catch((err) => {
    console.error(err);
});


module.exports = {
    postJSON
};