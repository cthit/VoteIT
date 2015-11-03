var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var utils = require('./utils.js');
var VoteSessionFactory = require('./voteSessionFactory.js');
var app = express();
var wrongTries = 0;
var wrongAdminTries = 0;
var currentCountDown;


app.set('port', (process.env.PORT || 5000));
app.set('password', (process.env.PASSWORD || 'admin'));



var vote = {};

var votesCount = [0, 0, 0];

var conf = {
    pass: app.get('password'),
    users: 20,
    lengthOfCodes: 12,
    nbrOfCodesPerUser: 20,
    maxWrongTries: 10000,
    maxWrongAdminTries: 100
}

var codes = [];

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // support encoded bodies
app.use(cookieParser())
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

var POSSIBLE_STATES = {
    noVote: "noVote",
    vote: "vote",
    result: "result"
};
app.locals.POSSIBLE_STATES = POSSIBLE_STATES;

app.locals.CURRENT_STATE = POSSIBLE_STATES.noVote;
app.locals.VOTE_SESSION_NUMBER = 0;

app.get('/', function(req, res) {
    console.log('vote', vote);
    res.render('frontend.html', {
        vote: vote
    });
});

app.get('/login', function(req, res) {
    res.render('loginAdmin.html');
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
    if (!isValidCode(req.body.code, codes)) {
        wrongTries++;
        res.send('FAIL: invalid code');
        return;
    }

    var vote = req.body.vote;

    if (!isValidAmountOfVotes(vote)) {
        wrongTries++;
        res.send('FAIL: invalid amount of votes');
        return;
    }

    if (checkIfAllOptionsAreValid(vote)) {
        vote.map(function(optionIndex) {
            increaseVoteForOption(optionIndex - 1);
        });
        codes = removeUsedCode(req.body.code, codes)
        res.send('Vote registered');
    } else {
        res.send('FAIL: invalid option voted for');
    }
});

app.get('/admin', function(req, res) {
    if (req.cookies.password != conf.pass) {
        res.redirect('/login');
    } else {
        res.render('admin.html');
    }
});

app.get('/admin/print', function(req, res) {
    if (req.cookies.password != conf.pass) {
        res.redirect('/login');
    } else {
        codes = utils.generateCodes(conf.users, conf.nbrOfCodesPerUser, conf.lengthOfCodes);

        res.render('print.html', {
            codes: codes
        });
    }
});

app.get('/createVoteSession', function(req, res) {
    res.render('createVoteSession.html');
});

app.post('/createVoteSession', function(req, res) {
    app.locals.CURRENT_STATE = POSSIBLE_STATES.vote;

    var candidates = req.body.textbox;
    var vacantEnabled = req.body.vacant == 'on';
    var maxCandidates = req.body.max_candidates;
    var maxTimeInSeconds = req.body.maxtime;

    vote = VoteSessionFactory.createVoteSession(candidates, vacantEnabled, maxCandidates, maxTimeInSeconds);
    votesCount = VoteSessionFactory.createEmptyVoteResults(vote.options, vote.vacantOptions);

    app.locals.VOTE_SESSION_NUMBER++;
    res.redirect('/admin');
    currentCountDown = setInterval(countDown, 1000);
});

function countDown() {
    vote.timeLeft--;
    if (vote.timeLeft == 0) {
        countVotes();
        clearInterval(currentCountDown);
    }
}

function countVotes() {

    votesCount.sort(compareVoteItem);

    var groupedOptions = votesOfOptions.reduce(function(acc, curr){
        acc[curr.value] = acc[curr.value] || []
        acc[curr.value].push(curr.item);
    }, {});

    var keys = Object.keys(groupedOptions).sort().reverse();
    var winners = [];

    while(vote.maximumNbrOfVotes - winners.length > 0){
        var key = keys.pop();
        if(groupedOptions[key].length <= spots) {
            winners = winners.concat(groupedOptions[key])
        } else {
            winners = winners.concat(
                pickWinnersWhenSameVoteCount(
                    vote.maximumNbrOfVotes - winners.length,
                    groupedOptions[key]
                )
            );
        }
    }

    vote.winners = winners;
    app.locals.CURRENT_STATE = POSSIBLE_STATES.result;
}

function isVacant(item) {
    return Boolean(item.vacant);
}

function pickWinnersWhenSameVoteCount(spots, candidates) {
    var winners = [];
    var vacantLessOptions = candidates.reject(isVacant);
    if(spots >= vacantLessOptions.length){
        winners = winners.concat(vacantLessOptions)
        var vacantOnlyOptions = candidates.filter(isVacant);
        while (spots - winners.length > 0){
            winners.push(vacantOnlyOptions.pop());
        }
    } else {
        vacantLessOptions.shuffle();
        while (spots - winners.length > 0) {
            winners.push(vacantLessOptions.pop());
        }
    }

    return winners;
}

function compareVoteItem(item1, item2) {
    var diff = item1.value - item2.value
    if(diff < 0){
        return -1;
    } else if (diff > 0) {
        return 1;
    } else {
        return item2.index - item1.index
    }
}

function isValidCode(code, codes) {
    if (code == undefined) {
        return false;
    }

    return codes.some(codeExists);
}

function codeExists(c) {
    return c[app.locals.VOTE_SESSION_NUMBER] == code;
}

function removeUsedCode(code, codes) {
    return codes.reject(codeExists);
}

function isValidAmountOfVotes(vote) {
    return vote.length <= vote.maximumNbrOfVotes
}

function checkIfAllOptionsAreValid(vote) {
    return vote.every(function(v) {
        return votesCount[v] !== undefined;
    });
}

function increaseVoteForOption(optionIndex) {
    votesCount[optionIndex].value++;
}


var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('VoteIT listening at http://%s:%s', host, port);
});
