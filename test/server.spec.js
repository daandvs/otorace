(function() {
  'use strict';

  var assert = require('chai').assert,
    request = require('supertest'),
    app = require('../server');

  describe('/', function() {
    it('should return 200', function(done) {
      request(app)
        .get('/')
        .expect(200, done);
    });

    it('should say "hello world"', function(done) {
      request(app)
        .get('/')
        .expect('hello world', done);
    });
  });
})();
