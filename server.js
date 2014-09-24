'use strict';

function handleHTTP(req, res) {
	res.end('joo wèrld!');
}

var http = require('http'),
	http_serv = http.createServer(handleHTTP),
	host = 'localhost'; // or find IP address of host computer acting as server (terminal: ifconfig -> information under en1)

http_serv.listen(3000, host);
