/*jslint node: true */
(function() {
	'use strict';

	function handleHTTP(req, res) {
		if(req.method === 'GET') {
			if(req.url === '/') {
				req.addListener('end',function() {
					req.url = 'index.html';
					static_files.serve(req, res);
				});
				req.resume();
			}else if(req.url === '/scripts/app.js') {
				static_files.serve(req, res);
			}else {
				res.writeHead(403);
			}
		}else if(req.method === 'POST') {
			if(req.url === '/login') {
				var body = '';

				req.on('data', function(chunk) {
					body += chunk;
				});

				req.on('end', function() {
					var postJSON = {};

					try {
						postJSON = JSON.parse(body);
					}catch(err) {
						res.writeHead(401);
						res.end();
					}

				if(postJSON.username && verifyUsername(postJSON.username)) {
						clients[postJSON.username] = {}; // already reserve this username

						res.writeHead(200, {'Content-Type': 'application/json'});

						var profile = {
							username: postJSON.username
						};
						//
						var token = jwt.sign(profile, jwt_secret, { expiresInMinutes: 60*5 });
						res.end(JSON.stringify({token: token}));
					}else {
						res.writeHead(401);
						res.end();
					}
				});

			}else {
				res.writeHead(403);
			}
		}else {
			res.writeHead(403);
		}
	}

	function verifyUsername(name) {
		if(!clients[name]) {
			return true;
		}
		return false;
	}

	function handleIO(socket) {
		var username = socket.decoded_token.username;

		clients[username] = socket;

		function disconnect() {
			delete clients[username];
		}

		function handlePosition(data) {
			socket.broadcast.emit('position', data);
		}

		socket.on('disconnect', disconnect);
		socket.on('position', handlePosition);

		socket.broadcast.emit('user_joined', {username: username});
	}

	var http = require('http'),
		http_serv = http.createServer(handleHTTP),

		host = 'localhost', // or find IP address of host computer acting as server (terminal: ifconfig -> information under en1)
		port = 3000,

		node_static = require('node-static'),
		static_files = new node_static.Server(__dirname + '/app'),

		io = require('socket.io').listen(http_serv),
		io_jwt = require('socketio-jwt'),

		jwt = require('jsonwebtoken'),
		jwt_secret = 'token', // store in env variable

		clients = {};


	http_serv.listen(3000, host);

	io.use(io_jwt.authorize({
		secret: jwt_secret,
		handshake: true
	}));

	io.on('connection', handleIO);

	module.exports = http_serv;
})();
