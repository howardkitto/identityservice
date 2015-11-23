var express = require('express');
var http = require('http');
var path = require('path');
var passport = require('passport');
var mongoose = require('mongoose');

var Identity = require('./models/identity');
var configDB = require('./config/database.js');

mongoose.connect(configDB.url, function (err, res) {
  if (err) {
  console.log ('ERROR connecting to: ' + configDB.url + '. ' + err);
  } else {
  console.log ('Succeeded connected to: ' + configDB.url);
  }
});

//==================================================================

// Start express application
var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

require('./config/passport')(passport, Identity);

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser()); 
app.use(express.bodyParser());
app.use(express.session({ secret: 'securedsession' }));
app.use(passport.initialize()); // Add passport initialization
app.use(passport.session());    // Add passport initialization
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

require('./app/routes.js')(app, passport, Identity);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
