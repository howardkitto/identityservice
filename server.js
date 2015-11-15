// server.js

//Get my packages
var express  = require('express');
var bodyParser   = require('body-parser');
var mongoose = require('mongoose');
var Identity = require('./app/models/identity');
var configDB = require('./config/database.js');

//Set Stuff up

var app      = express();
var port     = process.env.PORT || 8080;

app.use(bodyParser.json());

app.use(express.static(__dirname + "/views"));

mongoose.connect(configDB.url, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + configDB.url + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + configDB.url);
  }
});

//Fire!!

require('./app/routes.js')(app);
app.listen(port);
console.log('The magic happens on port ' + port);