/*jslint node: true */
'use strict';

function handleHTTP(req, res) {
	res.end('hello world');
}

var http = require('http'),
	http_serv = http.createServer(handleHTTP),
	host = 'localhost', // or find IP address of host computer acting as server (terminal: ifconfig -> information under en1)
	port = 3000;

http_serv.listen(3000, host);
