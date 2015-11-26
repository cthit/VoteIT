var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var utils = require('./src/utils.js');
var VoteSessionFactory = require('./src/voteSessionFactory');
var VoteManager = require('./src/voteManager');
var CodeManager = require('./src/codeManager');
var VoteCounter = require('./src/voteCounter');
var app = express();

var currentCountDown;


app.set('port', (process.env.PORT || 5000));
app.set('password', (process.env.PASSWORD || 'admin'));



var vote = {};
var voteManager = null;
var codeManager = new CodeManager();

var conf = {
    pass: app.get('password'),
    users: 5,
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

app.locals.POSSIBLE_STATES = POSSIBLE_STATES;
app.locals.CURRENT_STATE = POSSIBLE_STATES.noVote;

app.get('/', function(req, res) {
    res.render('index.html');
    //res.json({
    //    title: '',
    //    vote: vote,
    //    lengthOfCodes: conf.lengthOfCodes,
    //    sessionNumber: codeManager.currentSession
    //});
});

app.get('/status', function(req, res) {
    if (!voteManager) {
        res.json({
            sessionNumber: codeManager.currentSession,
            votingOpened: false
        }).end();
    } else {
        res.json({
            sessionNumber: codeManager.currentSession,
            votingOpened: voteManager.isOpen,
            candidates: vote.options,
            vacants: vote.vacantOptions,
            codeLength: conf.lengthOfCodes
        }).end();
    }
});

app.get('/login', function(req, res) {
    res.render('loginAdmin.html', {
        title: 'Login'
    });
});

app.post('/login', function(req, res) {
    if (req.body.pass == conf.pass) {
        res.cookie('password', req.body.pass, {
            maxAge: 900000,
            httpOnly: false
        });
        res.redirect('/admin');
    } else {
        res.send('Invalid login credentials');
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

app.get('/admin', function(req, res) {
    var password = req.password;
    if (password != conf.pass) {
        res.status(403).send('');
    } else {
        res.render('admin.html', {
            title: 'Admin',
            votingIsOpen: voteManager && voteManager.isOpen
        });
    }
});

app.get('/admin/print', function(req, res) {
    var password = req.password;
    if (password != conf.pass) {
        res.status(401).end();
    } else {
        var codes = codeManager.generateCodes(conf.users, conf.nbrOfCodesPerUser, conf.lengthOfCodes);

        res.render('print.html', {
            codes: codes.transpose()
        });
    }
});

app.get('/createVoteSession', function(req, res) {
    res.render('createVoteSession.html', {
        title: 'Create vote session'
    });
});

app.post('/createVoteSession', function(req, res) {
    var password = req.password;
    if (password != conf.pass) {
        res.status(401).end();
    } else {
        app.locals.CURRENT_STATE = POSSIBLE_STATES.vote;
        codeManager.nextSession();

        var candidates = req.body.candidates;
        var vacantEnabled = req.body.vacant;
        var maxCandidates = req.body.max_candidates;
        var maxTimeInSeconds = req.body.maxtime;

        vote = VoteSessionFactory.createVoteSession(candidates, vacantEnabled, maxCandidates, maxTimeInSeconds);

        voteManager = new VoteManager(vote.options,
                                      vote.vacantOptions,
                                      vote.maximumNbrOfVotes);
    }
    res.redirect('/admin');

});

function countDown() {
    vote.timeLeft--;
    if (vote.timeLeft == 0) {
        countVotes();
        clearInterval(currentCountDown);
    }
}

function countVotes() {
    var votesCount = voteManager.closeVotingSession();
    vote.winners = VoteCounter.countVotes(votesCount, vote.maximumNbrOfVotes);
    app.locals.CURRENT_STATE = POSSIBLE_STATES.result;
}


var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('VoteIT listening at http://%s:%s', host, port);
});
