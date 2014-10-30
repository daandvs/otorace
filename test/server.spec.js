(function() {
  'use strict';

  var chai = require('chai'),
    assert = chai.assert,
    expect = chai.expect,
    request = require('supertest'),
    requireHelper = require('../lib/require_helper'),
    app = requireHelper('server'),

    io = require('socket.io-client'),

    socketURL = 'http://0.0.0.0:3000',
    options ={
      transports: ['websocket'],
      'force new connection': true
    };

  describe('/', function() {
    it('respond with html', function(done) {
      request(app)
        .get('/')
        .expect('Content-Type', 'text/html')
        .expect(200, done);
    });
  });

  describe('/login', function() {
    it('should fail if no username is provided', function(done) {
      request(app)
        .post('/login')
        .expect(401, done);
    });

    describe('socket.io', function() {
      before(function(done) {
        request(app)
          .post('/login')
          .send({
            username: 'user1'
          }).end(function(err, res) {
            this.token = res.body.token;
            this.socket1 = io.connect(socketURL, {
              'forceNew': true,
              'query': 'token=' + this.token
            });
            done();
          }.bind(this));
      });

      it('should do handshake and connect', function(done) {
        this.socket1.on('connect', function() {
          done();
        });
      });

      it('should fail without token', function(done) {
        var socket = io.connect(socketURL, {
          'forceNew': true,
          'query': 'token=bb'
        });

        socket.on('error', function(err) {
          assert.equal(err.type, 'UnauthorizedError');
          done();
        });
      });

      after(function() {
        this.socket1.disconnect();
      });
    });

    describe('interaction between clients', function() {

      before(function(done) {
        request(app)
          .post('/login')
          .send({
            username: 'user3'
          }).end(function(err, res, body) {
            this.token = res.body.token;

            this.socket1 = io.connect(socketURL, {
              'forceNew': true,
              'query': 'token=' + this.token
            });

          }.bind(this));

        request(app)
          .post('/login')
          .send({
            username: 'user4'
          }).end(function(err, res, body) {
            this.token = res.body.token;

            this.socket2 = io.connect(socketURL, {
              'forceNew': true,
              'query': 'token=' + this.token
            });

            done();
          }.bind(this));
      });

      it('should inform other clients connection', function(done) {
        this.socket1.on('user_joined', function(data) {
          expect(data.username).to.equal('user4');
          done();
        });
      });

      it('should receive x and y positions', function(done) {
        this.socket1.emit('position', {
          x: 200,
          y: 300
        });

        this.socket2.on('position', function(data) {
          assert.equal(data.x, 200);
          assert.equal(data.y, 300);
          done();
        });
      });

      after(function() {
        this.socket1.disconnect();
        this.socket2.disconnect();
      });
    });
  });
})();
