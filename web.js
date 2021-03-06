var express = require('express');
var fs = require('fs');
var INDEX_HTML = 'index.html';
var htmlText;

htmlText = fs.readFileSync(INDEX_HTML,"utf-8");
//console.log(htmlText);

var app = express.createServer(express.logger());

app.get('/', function(request, response) {
  response.send(htmlText);
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
