/*jslint node: true */
'use strict';

var mongoose = require('mongoose');

var Videos = mongoose.model('Videos', {
  video_id: String,
  country: String,
  title: String,
  views: Number,
  comments: Number,
  likes: Number,
  dislikes: Number,
  updated: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Videos', Videos);
