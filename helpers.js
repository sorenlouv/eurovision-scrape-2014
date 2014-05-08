/*jslint node: true */
'use strict';

var http = require('http');
var https = require('https');
var Video = require('./video');

var getJSON = function(options, onResult){
  var port = options.port == 443 ? https : http;
  var req = port.request(options, function(res){
    var output = '';
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
      output += chunk;
    });

    res.on('end', function() {
      try{
        var outputJson = JSON.parse(output);
        onResult(res.statusCode, outputJson);
      }catch(err){
        onResult(res.statusCode, output);
      }
    });
  });

  req.on('error', function(err) {
    console.log('error: ' + err.message);
  });

  req.end();
};


var parseResponse = function(country, response) {
  return {
    video_id: country.video,
    country: country.name,
    title: response.entry.title.$t,
    views: parseInt(response.entry.yt$statistics.viewCount, 10),
    comments: response.entry.gd$comments ? parseInt(response.entry.gd$comments.gd$feedLink.countHint, 10) : 0,
    likes: parseInt(response.entry.yt$rating.numLikes, 10),
    dislikes: parseInt(response.entry.yt$rating.numDislikes, 10)
  };
};


exports.getVideos = function() {
  var countries = [
    {
      name: 'Sweden',
      video: 'XdXXnX5BvGY'
    },
    {
      name: 'Armenia',
      video: 'ChkJpnOgIwQ'
    },
    {
      name: 'United Kingdom',
      video: 'fFqYbibLh8k'
    },
    {
      name: 'Hungary',
      video: 'QzfRDZmuFUI'
    },
    {
      name: 'Ukraine',
      video: 'sdAf2EjhRiE'
    },
    {
      name: 'Netherlands',
      video: 'hkrF8uC92O4'
    },
    {
      name: 'Denmark',
      video: 'fn8DzOcpQas'
    },
    {
      name: 'Austria',
      video: 'ToqNa0rqUtY'
    },
    {
      name: 'Norway',
      video: '2LBOjxBty8U'
    },
    {
      name: 'Azerbaijan',
      video: 'ipQswujA5gw'
    },
    {
      name: 'Israel',
      video: '_uB4JMw4ctc'
    },
    {
      name: 'Spain',
      video: 'P9R96ZoWJBU'
    },
    {
      name: 'Greece',
      video: 'z8QIbL9i2MU'
    },
    {
      name: 'Finland',
      video: 'a-NSVFBKU-4'
    },
    {
      name: 'Russia',
      video: 'MPI7AnD_QS8'
    },
    {
      name: 'Romania',
      video: 'RYfyMkwTLPg'
    },
    {
      name: 'Malta',
      video: 'Qxi5C-lGX2Y'
    },
    {
      name: 'Italy',
      video: 'Si9K0ChHzDI'
    },
    {
      name: 'Ireland',
      video: 'Zc14AzCXUgQ'
    },
    {
      name: 'Germany',
      video: 'mTC-4YO_5eE'
    },
    {
      name: 'Poland',
      video: 'syMhJMmGEIc'
    },
    {
      name: 'France',
      video: 'hWJFfnHNOWI'
    },
    {
      name: 'Montenegro',
      video: 'Xym7CQFFTOU'
    },
    {
      name: 'Switzerland',
      video: 'kjWG0oNpWog'
    },
    {
      name: 'Iceland',
      video: 'TwfGKEIn5xw'
    },
    {
      name: 'San Marino',
      video: 'vt_3yms1PcM'
    },
    {
      name: 'Lithuania',
      video: 'PWi0zF6bFto'
    },
    {
      name: 'Slovenia',
      video: 'ZMpNkCOMaGU'
    },
    {
      name: 'Belarus',
      video: '0Qe7YmYgowM'
    },
    {
      name: 'Macedonia',
      video: 'ak73KTgy9nE'
    },
    {
      name: 'Georgia',
      video: 'o9ixkdkbieU'
    }
  ];

  console.log('run');

  var options = {
    host: 'gdata.youtube.com',
    port: 443,
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  };

  countries.forEach(function(country) {
    options.path = '/feeds/api/videos/' + country.video + '?&v=2&alt=json&fields=yt:rating,yt:statistics,gd:comments(gd:feedLink(@countHint)),title';
    getJSON(options, function(statusCode, response) {
      try{
        var video = parseResponse(country, response);
        var videoRecord = new Video(video);
        videoRecord.save();
      }catch(e){}
    });
  });
};
