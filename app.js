var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var Random = require("random-js")(); // uses the nativeMath engine
var app = express();
var expressWs = require('express-ws')(app); //app = express app
var wrongTries=0;
var wrongAdminTries=0;
var currentCountDown;


var VoteSessionNumber=1;

var vote={
  id:1,
  timeLeft:100,//in sek
  options:[{name:"Tuna berg",id:0},{name:"Erik bark",id:1},{name:"Ndushi johan",id:2}],
  vacoptions:[{name:"Vakant1",id:3,vac:true},{name:"Vakant2",id:4,vac:true}],
  maximumnrOfVotes:2,
  winners:[]
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

var state="noVote";//vote|noVote|result

app.get('/', function (req, res) {
  res.render('frontend.html', {state:state,vote:vote});
});

app.get('/loginAdmin', function (req, res) {

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

  res.render('createVoteSession.html');
});

app.post('/createVoteSession', function (req, res) {
  state="vote";

  var optionsarr = req.body.textbox.map(function(value, index) {
    return {
      id: index,
      name: value,
      vac: false
    };
  });
  var vacoptions=[];
  if(req.body.vakant=='on'){
    for(var i=0;i<=req.body.maxallowedoptions; i++){
      var index = optionsarr.length + i
      vacoptions.push({id:index,name:"Vakant"+(i+1),vac:true});
    };
  }
  vote={
    id:VoteSessionNumber,
    timeLeft:req.body.maxtime,//in sek
    options:optionsarr,
    maximumnrOfVotes:req.body.maxallowedoptions,
    winners:[]
  };
  votesCount=Array.apply(null, Array(optionsarr.length)).map(function (x, i) { return 0; });
  VoteSessionNumber++;
  res.redirect('/admin');
  currentCountDown=setInterval(countDown,1000);
});
function countDown(){
  vote.timeLeft--;
  if(vote.timeLeft==0){//resolve vote

    for(var i=0;i<vote.maximumnrOfVotes;i++){
      console.log("votesCount");
      console.log(votesCount);
      var aWinner=votesCount.indexOf(Math.max.apply(Math, votesCount))+1;

      votesCount[aWinner-1]=-1;
      var findById=function(arr,id){
        console.log("findById");
        for (var i = 0; i < arr.length; i++) {
            console.log(arr[i].id+" - "+id);
          if(arr[i].id==id){
            return arr[i];
          }
        }
      }

      vote.winners.push(findById(vote.options,aWinner));
      console.log("winners");
      console.log(vote.winners);
    }


    state="result";
    clearInterval(currentCountDown);
  }
}

app.post('/vote', function (req, res) {
  var correctVote=false;
  if(req.body.code==undefined){
    res.send('FAIL undefined');
  }
  for(var i=0;i<codes.length;i++){


    if(codes[i][vote.id-1]==req.body.code){

      correctVote=true;
      break;
    }
  }
  if(correctVote){//Add vote
    //check if valid code
    if(req.body.vote.length>vote.maximumnrOfVotes){
      res.send('FAIL to many votes');
    }else{
      var allExist=true;
      for(var i=0;i<req.body.vote.length;i++){
        if(votesCount[req.body.vote[i]]==undefined){
          allExist=false;

        }
      }

      if(allExist){//okey
        //add votes
        for(var i=0;i<req.body.vote.length;i++){
            console.log("add vote to"+req.body.vote[i]);
          votesCount[req.body.vote[i]-1]++;
        }
        console.log("votesCount");
        console.log(req.body.vote);
        console.log(votesCount);
        res.send('okej');
      }else{
          res.send('FAIL try to vote on a non existing thing');
      }
    }
  }else{
    wrongTries++;
    res.send('FAIL wrong code');
  }
});


app.post('/login', function (req, res) {
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
