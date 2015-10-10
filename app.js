var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
var app = express();


var wrongTries=0;
var conf={
  pass:"admin",
  users:20,
  lengthOfCodes:32,
  votes:20
}
var codes=[];

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
var option = ["Tuna berg", "Erik bark", "Ndushi johan"];

app.get('/', function (req, res) {
  test++;
  res.render('frontend.html', {elec:elec,test:test,options:option});
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


app.post('/vote', function (req, res) {
  console.log(req.body);
  //res.send(test+' Hello World!');
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
  for(var i=0;i<conf.users;i++){
    temp=[];
    for(var j=0;j<conf.votes;j++){
      temp.push(randomString(conf.lengthOfCodes, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    }
    codes.push(temp);
  }
  return codes;
}

function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


//server start stuff.
var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
