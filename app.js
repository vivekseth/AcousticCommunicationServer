
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


var lookupTable = {};

app.get('/register', function (req, res) {
	if (req.query.code && req.query.data) {
		lookupTable[req.query.code] = req.query.data;
		res.json({
			'status': 'OK'
		});
	} else {
		res.json({
			'status': 'ERROR',
			'payload': 'Must provode both code and data in query string.'
		});
	}
});

app.get('/lookup', function (req, res) {
	if (req.query.code) {
		var data = lookupTable[req.query.code];
		if (data) {
			res.json({
				'status': 'OK',
				'payload': data
			});
		} else {
			res.json({
				'status': 'ERROR',
				'payload': 'No data exists for given code.'
			});
		}
	} else {
		res.json({
			'status': 'ERROR',
			'payload': 'Must provode both code in query string.'
		});
	}
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
