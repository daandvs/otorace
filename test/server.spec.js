(function() {
  'use strict';

  var assert = require('chai').assert,
    request = require('supertest'),
    app = require('../server'),

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
            username: 'daan'
          }).end(function(err, res, body) {
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

      it('should fail if user with same name tries to connect', function(done) {
        request(app)
          .post('/login')
          .send({
            username: 'daan'
          })
          .expect(401, done);
      });

      it('should inform other clients when disconnected', function(done) {
        this.socket1.on('disconnect', function(err) {
          //setTimeout(function() {
            done();
          //}, 500);
        });

        this.socket1.disconnect();
      });

      it('have the name available', function(done) {
        request(app)
          .post('/login')
          .send({
            username: 'daan'
          })
          .expect(200, done);
      });
    });

    /*describe('interaction between clients', function() {

      before(function(done) {
        request(app)
          .post('/login')
          .send({
            username: 'bob'
          }).end(function(err, res, body) {
            this.token = res.body.token;
            done();
          }.bind(this));
      });

      it('should succesfully connect a second user', function(done) {
        var socket = io.connect(socketURL, {
          'forceNew': true,
          'query': 'token=' + this.token
        });

        socket.on('connect', function() {
          done();
        });
      });


    });*/
  });

  /*describe('socket.io', function() {
    before(function() {
      this.client1 = io.connect(socketURL, options);
      this.client2 = io.connect(socketURL, options);
      this.client3 = io.connect(socketURL, options);

      this.client1.on('connect', function(data) {
        this.client1.emit('user', {
          name: 'daan'
        });
      }.bind(this));

      this.client2.on('connect', function(data) {
        this.client2.emit('user', {
          name: 'jos'
        });
      }.bind(this));

      this.client3.on('connect', function(data) {
        this.client3.emit('user', {
          name: 'jos'
        });
      }.bind(this));
    });

    it('should refuse connection when username is already taken', function(done) {
      this.client3.on('new user', function(data) {

        done();
      });


    });

    it('should inform other clients connection', function(done) {
      this.client1.on('new user', function(data) {
        done();
      });
    });

    it('should receive x and y positions', function(done) {
      this.client1.emit('position', {
        x: 200,
        y: 300
      });

      this.client2.on('position', function(data) {
        assert.equal(data.x, 200);
        assert.equal(data.y, 300);
        done();
      });
    });
  });*/
})();
