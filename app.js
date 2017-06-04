// set variables for environment
var express = require('express');
var app = express();
var path = require('path');

/*
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/test';
MongoClient.connect(url, function(err, db) {
  assert.equal(null, err);
  console.log("Connected correctly to server.");
  db.close();
});
*/

// views as directory for all template files
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade'); // use either jade or ejs 

// instruct express to server up static assets
app.use(express.static('public'));

// set routes
app.get('/', function(req, res) {
  res.render('index');
});


app.get('/income', function(req, res) {
  res.render('income');
});

app.get('/cashflow', function(req, res) {
  res.render('cashflow');
});

//console.log("hello " + JSON.stringify(process.env));
//console.log("hello " + process.env.PORT);

port = process.env.PORT || 4000
// Set server port
app.listen(port, function () {
  console.log(' app listening on port:' + port )
})
//app.listen(4000);

