// set variables for environment
var express = require('express');
var app = express();
var path = require('path');

// views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // use either jade or ejs 

// instruct express to server up static assets
app.use(express.static('public'));

// set routes
app.get('/', function(req, res) {
  res.render('index');
});

app.get('/tenants', function(req, res) {
  res.render('tenants');
});

app.get('/cashflow', function(req, res) {
  res.render('cashflow');
});

// Set server port
app.listen(process.env.PORT,4000);
console.log('server is running');
