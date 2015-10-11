var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var Random = require("random-js")(); // uses the nativeMath engine
var app = express();
var expressWs = require('express-ws')(app); //app = express app
var wrongTries=0;
var wrongAdminTries=0;


var VoteSessionNumber=1;

var vote={
  id:1,
  timeLeft:100,//in sek
  options:[{name:"Tuna berg",id:1},{name:"Erik bark",id:2},{name:"Ndushi johan",id:3}],
  maximumnrOfVotes:2
};

var votesCount=[0,0,0];

var conf={
  pass:"admin",
  users:20,
  lengthOfCodes:12,
  nbr_of_codes_per_user:20,
  maxWrongTries:10000,
  maxWrongAdminTries:100,
  base58:'123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
}
var codes = [];

//conf
app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(cookieParser())
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');
app.use(express.static('public'));

var test=0;
var elec=true;

app.get('/', function (req, res) {
  console.log(codes);
  test++;
  res.render('frontend.html', {elec:elec,test:test,vote:vote});
});

app.get('/loginAdmin', function (req, res) {
  console.log(req.cookies.password);

  res.render('loginAdmin.html');
});
app.post('/loginAdmin', function (req, res) {

  if(req.body.pass==conf.pass){
    res.cookie('password', req.body.pass, { maxAge: 900000, httpOnly: false});
  //  res.send('OK');
    res.redirect('/admin');
  }else{
    res.send('FAIL');
  }

});

app.get('/createVoteSession', function (req, res) {
  console.log(req.cookies.password);

  res.render('createVoteSession.html');
});

app.post('/createVoteSession', function (req, res) {
  console.log(req.cookies.password);
  var temp = 1;
  var optionsarr = [];
  while (true) {
    if(req.body["textbox"+temp] !== undefined){
      optionsarr.push({name:req.body["textbox"+temp],id:temp});
      temp++;
    } else {
      break;
    }
  }
  vote={
    id:VoteSessionNumber,
    timeLeft:req.body.maxtime,//in sek
    options:optionsarr,
    maximumnrOfVotes:req.body.maxallowedoptions
  };
  VoteSessionNumber++;
  res.redirect('/admin');
});

app.post('/vote', function (req, res) {
  var correctVote=false;
  for(var i=0;i<codes.length;i++){
    console.log(codes[vote.id][i]);
    if(codes[vote.id][i]==req.body.code){
      correctVote=true;
      break;
    }
  }
  if(correctVote){//Add vote
    //check if valid code
    if(req.body.vote.length>vote.maximumnrOfVotes){
      res.send('FAIL');
    }

    res.send('okej');
  }else{
    console.log(req.body);
    wrongTries++;
    res.send('FAIL');
  }
});


app.post('/login', function (req, res) {
  console.log(req.body);
  //res.send(test+' Hello World!');
});



app.get('/admin', function (req, res) {
  if(req.cookies.password!=conf.pass){
    res.redirect('/loginAdmin');
  }else {
    res.render('admin.html');
  }
});
app.get('/admin/print', function (req, res) {
  if(req.cookies.password!=conf.pass){
    res.redirect('/loginAdmin');
  }else {
    res.render('print.html',{codes:generateCodes()});
  }
});

var generateCodes=function(){
  codes = [];
  for(var i=0; i < conf.users; i++){
    one_user_codes=[];
    for(var j=0; j < conf.nbr_of_codes_per_user; j++){
      one_user_codes.push(randomString(conf.lengthOfCodes, conf.base58));
    }
    codes.push(one_user_codes);
  }
  return codes;
}



function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i){
      result += chars[Random.integer(0, chars.length - 1)];
    }
    return result;
}
//server start stuff.
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
