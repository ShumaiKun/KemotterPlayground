var express = require('express');
var app = express();
var http = require('http').Server(app);
const PORT = process.env.PORT || 7000;

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

http.listen(PORT, function () {
  console.log('server listening. Port:' + PORT);
});