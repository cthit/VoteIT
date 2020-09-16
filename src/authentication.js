const axios = require("axios");

const getGammaUri = app => {
    const gammaBaseUrl = app.get("gammaBaseUrl");

    const responseType = "response_type=code";
    const clientId = "client_id=" + app.get("clientId");
    const redirectUri = "redirect_uri=" + app.get("redirectUri");
    return (
        gammaBaseUrl +
        "/oauth/authorize" +
        "?" +
        responseType +
        "&" +
        clientId +
        "&" +
        redirectUri
    );
};

const getMe = async (app, token) => {
    return axios.get(app.get("gammaBaseUrl") + "/users/me", {
        headers: {
            Authorization: "Bearer " + token,
        },
    });
};

const postGammaToken = async (app, code) => {
    const params = new URLSearchParams();
    params.append("grant_type", "authorization_code");
    params.append("client_id", app.get("clientId"));
    params.append("redirect_uri", app.get("redirectUri"));
    params.append("code", code);

    const c = Buffer.from(
        app.get("clientId") + ":" + app.get("clientSecret")
    ).toString("base64");

    return axios.post(
        app.get("gammaBaseUrl") + "/oauth/token" + "?" + params.toString(),
        null,
        {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                Authorization: "Basic " + c,
            },
        }
    );
};

module.exports = {
    getGammaUri,
    postGammaToken,
};
