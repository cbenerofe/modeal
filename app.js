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
  res.render('deals');
});


app.get('/deals', function(req, res) {
  res.render('deals');
});

app.get('/deals/new', function(req, res) {
  res.render('new_deal');
});

app.get('/deals/:id', function(req, res) {
  res.render('deal',{ dealId: req.params['id']});
});

app.get('/deals/:id/edit', function(req, res) {
  res.render('edit_deal',{ dealId: req.params['id']});
});

app.get('/deals/:id/returns', function(req, res) {
  res.render('returns',{ dealId: req.params['id']});
});

app.get('/deals/:id/cashflow', function(req, res) {
  res.render('cashflow',{ dealId: req.params['id']});
});

app.get('/deals/:id/tenants', function(req, res) {
  res.render('tenants',{ dealId: req.params['id']});
});

app.get('/buildings/:id/leases', function(req, res) {
  res.render('building_leases',{ buildingId: req.params['id']});
});

app.get('/buildings/:id/expenses', function(req, res) {
  res.render('building_expenses',{ buildingId: req.params['id']});
});

app.get('/leases/:id/edit', function(req, res) {
  res.render('edit_lease',{ leaseId: req.params['id']});
});


port = process.env.PORT || 4000
// Set server port
app.listen(port, function () {
  console.log(' app listening on port:' + port )
})
//app.listen(4000);


