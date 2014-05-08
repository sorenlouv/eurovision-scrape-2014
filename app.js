/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var helpers = require('./helpers');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/eurovision');

app.get('/', function(req, res) {
  res.statusCode = 200;
  res.send('');
});

var server = app.listen(3000, function() {
  // Run every hour
  setInterval(helpers.getVideos, 1000000);
  console.log('Started...');

  console.log('Listening on port %d', server.address().port);
});
