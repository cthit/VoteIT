var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var utils = require('./src/utils.js');
var VoteSessionFactory = require('./src/voteSessionFactory');
var VoteManager = require('./src/voteManager');
var CodeManager = require('./src/codeManager');
var VoteCounter = require('./src/voteCounter');
var app = express();

app.set('port', (process.env.PORT || 5000));
app.set('password', (process.env.PASSWORD || 'admin'));



var vote = {};
var voteManager = null;
var codeManager = new CodeManager();
var adminToken = null;

var conf = {
    pass: app.get('password'),
    users: 20,
    lengthOfCodes: 12,
    nbrOfCodesPerUser: 20
};

var codes = [];

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser());
app.use(express.static('public'));

app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.engine('html', require('ejs').renderFile);

var POSSIBLE_STATES = {
    noVote: "noVote",
    vote: "vote",
    result: "result"
};

function isAuthenticated(req, res) {
    var header = req.header('Authorization');

    if (adminToken === null || header === null || header.substring(6) !== adminToken) {
        res.status(401).end();
        return false;
    }
    return true;
}

app.locals.POSSIBLE_STATES = POSSIBLE_STATES;
app.locals.CURRENT_STATE = POSSIBLE_STATES.noVote;

app.get('/', function(req, res) {
    res.render('index.html');
});

app.get('/admin', function(req, res) {
    res.redirect('/#/admin');
});

app.get('/status', function(req, res) {
    switch (app.locals.CURRENT_STATE) {
        case POSSIBLE_STATES.noVote:
            res.json({
                sessionNumber: codeManager.currentSession,
                votingOpened: false,
                votingComplete: false
            });
            break;
        case POSSIBLE_STATES.vote:
            res.json({
                sessionNumber: codeManager.currentSession,
                votingOpened: true,
                votingComplete: false,
                candidates: vote.options,
                vacants: vote.vacantOptions,
                codeLength: conf.lengthOfCodes
            });
            break;
        case POSSIBLE_STATES.result:
            res.json({
                sessionNumber: codeManager.currentSession,
                votingOpened: true,
                votingComplete: true,
                winners: vote.winners
            });
    }
    res.end();
});

app.post('/login', function(req, res) {
    if (req.body.pass === conf.pass) {
        adminToken = utils.randomToken(30);
        res
            .set('Authorization', 'token ' + adminToken)
            .end();
    } else {
        res.status(403).end();
    }
});

app.post('/vote', function(req, res) {
    var voteData = req.body.vote;
    var code = req.body.code;

    try {
        if (vote.state !== POSSIBLE_STATES.vote) {
            throw 'Voting is closed';
        }

        if (!codeManager.isValidCode(code)) {
            throw 'Invalid code';
        }

        codes = voteManager.castVote(voteData, code, sessionCodes);

        codeManager.invalidateCode(code);
    } catch (e) {
        res.status(400).send('FAIL: ' + e);
    }
});

app.get('/admin/print', function(req, res) {
    if (isAuthenticated(req, res)) {
        var codes = codeManager.generateCodes(conf.users, conf.nbrOfCodesPerUser, conf.lengthOfCodes);

        res.json({
            codes: codes.transpose()
        }).end();
    }
});

app.post('/createVoteSession', function(req, res) {
    if (isAuthenticated(req, res)) {
        app.locals.CURRENT_STATE = POSSIBLE_STATES.vote;

        codeManager.nextSession();
        var candidates = req.body.candidates.map(c => c.trim()).filter(c => c !== '');

        var vacantEnabled = req.body.vacant;
        var maxCandidates = req.body.max_candidates;

        vote = VoteSessionFactory.createVoteSession(candidates, vacantEnabled, maxCandidates);

        voteManager = new VoteManager(vote.options,
                                      vote.vacantOptions,
                                      vote.maximumNbrOfVotes);

        res.end();
    }
});

app.post('/admin/complete', function(req, res) {
    if (isAuthenticated(req, res)) {
        var votesCount = voteManager.closeVotingSession();
        vote.winners = VoteCounter.countVotes(votesCount, vote.maximumNbrOfVotes);
        app.locals.CURRENT_STATE = POSSIBLE_STATES.result;
    }
});


var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('VoteIT listening at http://%s:%s', host, port);
});
