(function(){
	'use strict';

	var http = require('http'),
		server = http.createServer(function(req, res){
			res.end('joo wèrld!');
		});

	// find IP address of host computer acting as server (terminal: ifconfig -> information under en1)
	server.listen(3000, '192.168.1.8');
})();