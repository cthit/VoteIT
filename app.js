var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var Random = require("random-js")(); // uses the nativeMath engine
var app = express();
var expressWs = require('express-ws')(app); //app = express app
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
    no_vote: "noVote",
    vote: "vote"
    result: "result"
}

var state = "noVote";

app.get('/', function(req, res) {
    console.log(vote);
    res.render('frontend.html', {
        state: state,
        vote: vote
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
        res.send('FAIL');
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

    votesCount = Array.apply(null, Array(optionsList.length)).map(function(x, i) {
        return 0;
    });

    voteSessionNumber++;
    res.redirect('/admin');
    currentCountDown = setInterval(countDown, 1000);
});

function countDown() {
    vote.timeLeft--;
    if (vote.timeLeft == 0) {
        for (var i = 0; i < vote.maximumNbrOfVotes; i++) {
            var aWinner = votesCount.indexOf(Math.max.apply(Math, votesCount)) + 1;
            votesCount[aWinner - 1] = -1;

            var findById = function(arr, id) {
                for (var i = 0; i < arr.length; i++) {
                    console.log(arr[i].id + " - " + id);
                    if (arr[i].id == id) {
                        return arr[i];
                    }
                }
            }

            vote.winners.push(findById(vote.options, aWinner));
        }
        state = POSSIBLE_STATES.result;
        clearInterval(currentCountDown);
    }
}

app.post('/vote', function(req, res) {
    var validCode = false;
    if (req.body.code == undefined) {
        res.send('FAIL: code not defined');
    }
    for (var i = 0; i < codes.length; i++) {
        if (codes[i][vote.id - 1] == req.body.code) {
            validCode = true;
            break;
        }
    }
    if (validCode) { 
        if (req.body.vote.length > vote.maximumNbrOfVotes) {
            res.send('FAIL to many votes');
        } else {
            var allExist = true;
            for (var i = 0; i < req.body.vote.length; i++) {
                if (votesCount[req.body.vote[i]] == undefined) {
                    allExist = false;

                }
            }

            if (allExist) {
                for (var i = 0; i < req.body.vote.length; i++) {
                    votesCount[req.body.vote[i] - 1]++;
                }
                res.send('okej');
            } else {
                res.send('FAIL try to vote on a non existing thing');
            }
        }
    } else {
        wrongTries++;
        res.send('FAIL: invalid code');
    }
});

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

//server start stuff.
var server = app.listen(app.get('port'), function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Example app listening at http://%s:%s', host, port);
});