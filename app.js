var express = require('express');
var app = express();

var codes=[
  [123,124,5,123,41235,123,123123],
  [1,1,5,123,41235,1231,123123],
  [3,124,5,123,41235,123,123123],
  [5,124,5,123,41235,123,123123],
  [6,124,5,123,41235,123123,123123],
  [213,34,5,123,41235,123123,123123]
];

//conf
app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'ejs');


var test=0;
app.get('/', function (req, res) {
  test++;
  res.render('frontend.html');
  //res.send(test+' Hello World!');
});

app.get('/admin', function (req, res) {
  res.render('admin.html');
});
app.get('/admin/print', function (req, res) {
  res.render('print.html',{codes:codes});
});


var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
