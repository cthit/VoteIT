var express = require('express');
var app = express();


var conf={
  users:20,
  lengthOfCodes:32,
  votes:20
}
var codes=[];

//conf
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
  //res.send(test+' Hello World!');
});

app.get('/admin', function (req, res) {
  res.render('admin.html');
});
app.get('/admin/print', function (req, res) {
  res.render('print.html',{codes:generateCodes()});
});

var generateCodes=function(){
  for(var i=0;i<conf.users;i++){
    temp=[];
    for(var j=0;j<conf.votes;j++){
      temp.push(randomString(conf.lengthOfCodes, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    }
    codes.push(temp);
    console.log(codes);
  }
  return codes;
}
function randomString(length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}


var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
