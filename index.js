var _ = require("lodash");
var jwt = require("jsonwebtoken");
var axios = require("axios");
var cors = require("cors");
var express = require("express");
var cookieParser = require("cookie-parser");
var VoteSessionFactory = require("./src/voteSessionFactory");
var VoteManager = require("./src/voteManager");
var VoteCounter = require("./src/voteCounter");
var AcceptedUsersManager = require("./src/acceptedUsersManager");
var path = require("path");

const { getGammaUri, postGammaToken } = require("./src/authentication");

var app = express();

require("./src/utils.js");

const production = process.env.NODE_ENV !== "dev";

app.set("port", process.env.PORT || 5000);
app.set("adminCid", process.env.ADMIN_CID || "dbarnevi"); //Default is cid:dbarnevi
app.set("clientId", process.env.CLIENT_ID || "id");
app.set("clientSecret", process.env.CLIENT_SECRET || "secret");
app.set(
    "redirectUri",
    process.env.REDIRECT_URI || "http://localhost:3001/auth/account/callback"
);
app.set("apiKey", process.env.API_KEY || "key");
app.set(
    "gammaBaseUrl",
    process.env.GAMMA_BASE_URL ||
        (production
            ? "https://gamma.chalmers.it/api"
            : "http://localhost:8081/api")
);

if (!app.get("adminCid")) {
    throw "Admin uid not set";
}

if (!app.get("clientId")) {
    throw "Client id not set";
}

if (!app.get("clientSecret")) {
    throw "Client secret not set";
}

if (!app.get("redirectUri")) {
    throw "Redirect uri not set";
}

if (!app.get("apiKey")) {
    throw "Api key not set";
}

const AUTH_COOKIE_NAME = "auth";

var that = this;
var gammaUsers = {};

var acceptedUsersManager = new AcceptedUsersManager();
var vote = {};
var voteManager = null;
var latestResult = {
    votesCount: [],
    winners: [],
    rawVotes: [],
};

var conf = {
    users: app.get("users"),
    nbrOfCodesPerUser: app.get("codesPerUser"),
};

// Tell user to use HTTPS if production
app.use(function (req, res, next) {
    if (production && req.headers["x-forwarded-proto"] !== "https") {
        return res.end("Please visit the site with HTTPS");
    } else {
        next();
    }
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.enable("trust proxy");

//TODO Validate jwt on every request.
//extracts user from cookie
app.use((req, res, next) => {
    const auth = req.cookies[AUTH_COOKIE_NAME];
    if (auth == null) {
        next();
        return;
    }

    const data = jwt.decode(auth);
    req.user = _.find(that.gammaUsers, ["cid", data.user_name]);
    next();
});

var POSSIBLE_STATES = {
    noVote: "noVote",
    vote: "vote",
    result: "result",
};

const updateGammaCache = () =>
    new Promise((resolve, reject) => {
        axios
            .get(app.get("gammaBaseUrl") + "/users/minified", {
                headers: { Authorization: "pre-shared " + app.get("apiKey") },
            })
            .then(response => {
                that.gammaUsers = response.data;
                resolve();
            })
            .catch(() => reject());
    });

updateGammaCache();

const isSignedIn = (req, res, next) => {
    if (req.user) {
        next();
    } else {
        res.status(401).send(getGammaUri(app));
    }
};

const canVote = (req, res, next) => {
    if (acceptedUsersManager.usersApproved.includes(req.user.id)) {
        next();
    } else if (req.user.cid === app.get("adminCid")) {
        acceptedUsersManager.addToNotApprovedList(req.user.id);
        acceptedUsersManager.approveUser(req.user.id);
        next();
    } else {
        const userId = req.user.id;

        if (!acceptedUsersManager.usersNotApproved.includes(userId)) {
            acceptedUsersManager.addToNotApprovedList(userId);
        }

        res.status(401).send("You cannot vote yet");
    }
};

const isAdmin = (req, res, next) => {
    if (req.user.cid === app.get("adminCid")) {
        next();
    } else {
        res.status(401).send("Not an admin");
    }
};

app.locals.POSSIBLE_STATES = POSSIBLE_STATES;
app.locals.CURRENT_STATE = POSSIBLE_STATES.noVote;

app.get("/api/me", isSignedIn, (req, res) => {
    const user = req.user;

    res.send({ ...user, voteIT: { admin: user.cid === app.get("adminCid") } });
});

app.post("/api/code", async (req, res) => {
    const { code } = req.body;

    postGammaToken(app, code)
        .then(response => {
            const { access_token } = response.data;

            const data = jwt.decode(access_token);
            const user = _.find(that.gammaUsers, ["cid", data.user_name]);

            if (user == null) {
                res.status(401).send(
                    "Please ask the counter to update the Gamma cache."
                );
                return;
            }

            res.cookie(AUTH_COOKIE_NAME, access_token, {
                path: "/",
                expires: new Date(Date.now() + 24 * 3600000), //24h
                httpOnly: true,
                secure: production,
                sameSite: "strict",
            });

            const userId = user.id;

            if (!acceptedUsersManager.usersNotApproved.includes(userId)) {
                acceptedUsersManager.addToNotApprovedList(userId);
            }

            res.status(200).send();
        })
        .catch(err => {
            if (err.response && err.response.status === 401) {
                res.status(401).send(getGammaUri(app));
            } else {
                res.status(500).send("ERROR");
                console.log(err);
            }
        });
});

app.post("/api/sign-out", isSignedIn, (req, res) => {
    res.clearCookie(AUTH_COOKIE_NAME);
    res.status(200).send();
});

app.get("/api/health-check", (req, res) => {
    res.status(200).send("" + acceptedUsersManager.usersApproved.length);
});

app.get("/api/status", isSignedIn, canVote, (req, res) => {
    switch (app.locals.CURRENT_STATE) {
        case POSSIBLE_STATES.noVote:
            res.status(200).send({
                state: app.locals.CURRENT_STATE,
            });
            break;
        case POSSIBLE_STATES.vote:
            res.status(200).send({
                state: app.locals.CURRENT_STATE,
                maximumNbrOfVotes: vote.maximumNbrOfVotes,
                candidates: vote.options.shuffle(),
                vacants: vote.vacantOptions,
                votesReceived: voteManager.getTotalVoteCount(),
                userVoted: voteManager.hasUserVoted(req.user.id),
                electionName: voteManager.electionName,
                eligibleVoters: acceptedUsersManager.usersApproved.length,
            });
            break;
        case POSSIBLE_STATES.result:
            res.status(200).send({
                state: app.locals.CURRENT_STATE,
                winners: vote.winners.shuffle(),
            });
    }
});

app.post("/api/vote", isSignedIn, canVote, (req, res) => {
    var voteData = req.body.vote;

    try {
        if (app.locals.CURRENT_STATE !== POSSIBLE_STATES.vote) {
            throw "Voting is closed";
        }

        voteManager.castVote(voteData, req.user.id);
    } catch (e) {
        res.status(400).send("FAIL: " + e);
    }

    res.end();
});

app.get("/api/not-approved", isSignedIn, isAdmin, (req, res) => {
    const usersNotApproved = acceptedUsersManager.usersNotApproved.map(id =>
        _.find(that.gammaUsers, ["id", id])
    );
    res.status(200).send(usersNotApproved);
});

app.post("/api/approve-user", isSignedIn, isAdmin, (req, res) => {
    acceptedUsersManager.approveUser(req.body.id);
    res.status(200).send();
});

app.post("/api/create-vote-session", isSignedIn, isAdmin, (req, res) => {
    try {
        var candidates = req.body.candidates
            .map(c => c.trim())
            .filter(c => c !== "");

        var vacantEnabled = req.body.vacant;
        var maxCandidates = parseInt(req.body.max_candidates, 10);
        var electionName = req.body.electionName;

        latestResult.votesCount = [];
        latestResult.winners = [];
        latestResult.rawVotes = [];

        vote = VoteSessionFactory.createVoteSession(
            candidates,
            vacantEnabled,
            maxCandidates
        );

        voteManager = new VoteManager(
            vote.options,
            vote.vacantOptions,
            vote.maximumNbrOfVotes,
            electionName
        );

        app.locals.CURRENT_STATE = POSSIBLE_STATES.vote;
    } catch (e) {
        res.status(400).send("FAIL: " + e);
    }
    res.end();
});

app.post("/api/complete", isSignedIn, isAdmin, (req, res) => {
    var votesCount = voteManager.closeVotingSession();
    vote.winners = VoteCounter.countVotes(votesCount, vote.maximumNbrOfVotes);

    latestResult.votesCount = votesCount;
    latestResult.winners = vote.winners;
    latestResult.rawVotes = voteManager.getRawVotes();

    app.locals.CURRENT_STATE = POSSIBLE_STATES.result;

    res.end();
});

app.get("/api/result", isSignedIn, isAdmin, (req, res) => {
    res.status(200).send(latestResult);
});

app.post("/api/update-gamma-cache", isSignedIn, isAdmin, (req, res) => {
    updateGammaCache()
        .then(() => {
            res.status(200).send();
        })
        .catch(() =>
            res
                .status(500)
                .send("Something went wrong when updating the gamma cache")
        );
});

if (production) {
    console.log("PRODUCTION");

    app.use(express.static(path.join(__dirname, "client", "build")));
    app.use(express.static("public"));

    app.use((req, res, next) => {
        res.sendFile(path.join(__dirname, "client", "build", "index.html"));
    });
}

var server = app.listen(app.get("port"), function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log("VoteIT listening at http://%s:%s", host, port);
});
