


var express = require('express');
var app = express();
var test=0;
app.get('/', function (req, res) {
  test++;

  res.send(test+' Hello World!');
});

app.get('/admin', function (req, res) {
  res.send('Admin!');
});


var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
