/*jslint node: true */
'use strict';

var express = require('express');
var app = express();
var helpers = require('./helpers');
var mongoose = require('mongoose');
var Video = require('./video');
var getVideosInterval;

mongoose.connect('mongodb://localhost/eurovision');

app.get('/', function(req, res) {
  Video.count(function(err, count){
    res.statusCode = 200;
    res.send('count: ' + count + '\n Time to next: ' + getTimeLeft(getVideosInterval));
  });
});

var getTimeLeft = function(interval){
  return Math.ceil((interval._idleStart + interval._idleTimeout - Date.now()) / 1000);
};

var server = app.listen(3000, function() {
  helpers.getVideos();

  // Run every hour
  var intervalDuration = 1000000;
  getVideosInterval = setInterval(helpers.getVideos, intervalDuration);
  console.log('Scraping every ' + (intervalDuration/(1000*60)) + ' minute');

  console.log('Listening on port %d', server.address().port);
});
