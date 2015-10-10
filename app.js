var express = require('express');
var app = express();

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


var server = app.listen(3001, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});
