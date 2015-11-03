var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var Random = require("random-js")(); // uses the nativeMath engine
var app = express();
var expressWs = require('express-ws')(app);
var wrongTries = 0;
var wrongAdminTries = 0;
var currentCountDown;


app.set('port', (process.env.PORT || 5000));
app.set('password', (process.env.PASSWORD || 'admin'));



var voteSessionNumber = 1;

var vote = {};

var votesCount = [0, 0, 0];

var conf = {
    pass: app.get('password'),
    users: 20,
    lengthOfCodes: 12,
    nbrOfCodesPerUser: 20,
    maxWrongTries: 10000,
    maxWrongAdminTries: 100,
    base58string: '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
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
}

var state = POSSIBLE_STATES.noVote;

app.get('/', function(req, res) {
    console.log('vote', vote);
    res.render('frontend.html', {
        state: state,
        vote: vote,
        POSSIBLE_STATES: POSSIBLE_STATES
    });
});

app.get('/loginAdmin', function(req, res) {
    res.render('loginAdmin.html');
});

app.post('/loginAdmin', function(req, res) {
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

app.get('/createVoteSession', function(req, res) {
    res.render('createVoteSession.html');
});

app.post('/createVoteSession', function(req, res) {
    state = POSSIBLE_STATES.vote;

    var optionsList = req.body.textbox.map(function(value, index) {
        return {
            id: index,
            name: value,
            vacant: false
        };
    });

    var vacantOptions = [];
    if (req.body.vakant == 'on') {
        for (var i = 0; i < req.body.maxallowedoptions; i++) {
            var index = optionsList.length + i
            vacantOptions.push({
                id: index,
                name: "Vakant" + (i + 1),
                vacant: true
            });
        };
    }

    vote = {
        id: voteSessionNumber,
        timeLeft: req.body.maxtime, //in sek
        options: optionsList,
        vacantOptions: vacantOptions,
        maximumNbrOfVotes: req.body.maxallowedoptions,
        winners: []
    };

    votesCount = {};
    vote.options.concat(vote.vacantOptions).forEach(function(option) {
        votesCount[option.index] = {
            value: 0,
            item: option
        }
    });

    voteSessionNumber++;
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
    state = POSSIBLE_STATES.result;
}

function isVacant(item) {
    return Boolean(item.vacant);
}

function pickWinnersWhenSameVoteCount(spots, options) {
    var winners = [];
    var vacantLessOptions = options.filter(!isVacant);
    if(spots >= vacantLessOptions.length){
        winners = winners.concat(vacantLessOptions)
        var vacantOnlyOptions = options.filter(isVacant);
        while (spots - winners.length > 0){
            winners.push(vacantOnlyOptions.pop());
        }
    } else {
        var engine = Random.engines.mt19937().autoSeed();
        Random.shuffle(engine,vacantLessOptions);
        while (spots - winners.length > 0) {
            winners.push(vacantLessOptions.pop());
        }
    }

    return winners;
}

function compareVoteItem(item1, item2) {
    diff = item1.value - item2.value
    if(diff < 0){
        return -1;
    } else if (diff > 0) {
        return 1;
    } else {
        return item2.index - item1.index
    }
}

app.post('/vote', function(req, res) {
    console.log(req, res);
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

function isValidCode(code, codes) {
    if (code == undefined) {
        return false;
    }

    return codes.some(function(c) {
        return c[vote.id - 1] == code;
    });
}

function removeUsedCode(code, codes) {
    return codes.filter(function(c) {
        return c[vote.id - 1] != code;
    });
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

app.post('/login', function(req, res) {
    //res.send(test+' Hello World!');
});

app.get('/admin', function(req, res) {
    if (req.cookies.password != conf.pass) {
        res.redirect('/loginAdmin');
    } else {
        res.render('admin.html');
    }
});

app.get('/admin/print', function(req, res) {
    if (req.cookies.password != conf.pass) {
        res.redirect('/loginAdmin');
    } else {
        res.render('print.html', {
            codes: generateCodes()
        });
    }
});

var generateCodes = function() {
    codes = [];
    for (var i = 0; i < conf.users; i++) {
        oneUserCodes = [];
        for (var j = 0; j < conf.nbrOfCodesPerUser; j++) {
            oneUserCodes.push(randomString(conf.lengthOfCodes, conf.base58string));
        }
        codes.push(oneUserCodes);
    }
    return codes;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) {
        result += chars[Random.integer(0, chars.length - 1)];
    }
    return result;
}

var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('VoteIT listening at http://%s:%s', host, port);
});
