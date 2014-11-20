/*jslint node: true */
'use strict';

function handleHTTP(req, res) {
  if (req.method === 'GET') {
    if (req.url === '/') {
      req.addListener('end', function() {
        req.url = 'index.html';
        static_files.serve(req, res);
      });
      req.resume();
    } else if (req.url === '/scripts/app.js') {
      static_files.serve(req, res);
    } else {
      res.writeHead(403);
    }
  } else if (req.method === 'POST') {
    if (req.url === '/login') {
      var body = '';

      req.on('data', function(chunk) {
        body += chunk;
      });

      req.on('end', function() {
        var postJSON = {};

        try {
          postJSON = JSON.parse(body);
        } catch (err) {
          res.writeHead(401);
          res.end();
        }

        if (postJSON.username && socketio.isUsernameAvailable(postJSON.username)) {
          res.writeHead(200, {
            'Content-Type': 'application/json'
          });

          var profile = {
            stamp: new Date().getTime(),
            username: postJSON.username
          };

          var token = jwt.sign(profile, jwt_secret, {
            expiresInMinutes: 60 * 5
          });

          res.end(JSON.stringify({
            token: token
          }));
        } else {
          res.writeHead(401);
          res.end();
        }
      });

    } else {
      res.writeHead(403);
    }
  } else {
    res.writeHead(403);
  }

}

function handleStart() {
  http_serv = http.createServer(handleHTTP);
  http_serv.listen(3000, host);

  socketio.init(http_serv, jwt_secret);
}

function handleStop(callback) {
  http_serv.close(callback);
  socketio.close();
}


var http = require('http'),
  http_serv,

  host = 'localhost', // or find IP address of host computer acting as server (terminal: ifconfig -> information under en1)
  port = 3000,

  node_static = require('node-static'),
  static_files = new node_static.Server(__dirname + '/app'),

  socketio = require('./lib/socket'),

  jwt = require('jsonwebtoken'),
  jwt_secret = 'token'; // best to store this in env variable

module.exports = {
  start: handleStart,
  stop: handleStop
};
