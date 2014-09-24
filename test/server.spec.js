(function() {
  'use strict';

  var assert = require('chai').assert,
    http = require('http'),
    host = 'localhost',
    port = 3000,

    URI = 'http://' + host + ':' + port;

  describe('/', function() {
    it('should return 200', function(done) {
      http.get(URI, function(res) {
        assert.equal(200, res.statusCode);
        done();
      });
    });

    it('should say "hello world"', function(done) {
      http.get(URI, function(res) {
        var data = '';

        res.on('data', function(chunk) {
          data += chunk;
        });

        res.on('end', function() {
          assert.equal('hello world', data);
          done();
        });
      });
    });
  });
})();
