(function() {
  'use strict';

  var chai = require('chai'),
    sinon = require('sinon'),
    assert = chai.assert,
    expect = chai.expect,
    request = require('supertest'),
    requireHelper = require('../lib/require_helper'),
    app = requireHelper('server'),

    jwt = require('jsonwebtoken'),

    io = require('socket.io-client'),

    socketURL = 'http://0.0.0.0:3000',
    options ={
      transports: ['websocket'],
      'force new connection': true
    };

    describe('server test', function() {
      describe('/', function() {
        beforeEach(function() {
          this.request = request(app).get('/');
        });

        it('should have Content-Type text/html', function(done) {
          this.request
            .expect('Content-Type', 'text/html')
            .end(function() {
              done();
            });
        });

        it('should have status 200', function(done) {
          this.request
            .expect(200, done);
        });
      });

      describe('/login', function() {
        it('should fail if no username is provided', function(done) {
          request(app).post('/login')
            .expect(401, done);
        });

        it('should have Content-Type application/json', function(done) {
          request(app)
            .post('/login')
            .send({
              username: 'xx'
            })
            .expect('Content-Type', 'application/json')
            .end(function(err, res) {
              done();
            });
        });

        describe('socket.io', function() {
          before(function(done) {
            this.jwtStub = sinon.stub(jwt, 'sign', function() {
              return 'this is the token';
            });

            this.user = {
              username: 'user1'
            };

            this.token = '';
            this.login = request(app)
              .post('/login')
              .send(this.user)
              .end(function(err, res) {
                this.token = res.body.token;
                done();
              }.bind(this));
          });

          after(function() {
            this.jwtStub.restore();
          });

          it('should create web token', function() {
            chai.assert.ok(this.jwtStub.calledWith(this.user));
            chai.assert.equal(this.jwtStub.args[0].length, 3);
          });

          it('should return web token', function() {
            chai.assert.equal(this.token, 'this is the token');
          });

          it('should return 401 if username already exist', function(done) {
            var username = {
              username: 'user1'
            };

            request(app)
              .post('/login')
              .send(username)
              .expect(401, done);
          });

          // it('should fail without token', function(done) {
          //   var socket = io.connect(socketURL, {
          //     'forceNew': true,
          //     'query': 'token=bb'
          //   });
          //
          //   socket.on('error', function(err) {
          //     assert.equal(err.type, 'UnauthorizedError');
          //     done();
          //   });
          // });
          //
          // after(function() {
          //   this.socket1.disconnect();
          // });
        });

        // describe('interaction between clients', function() {
        //
        //   before(function(done) {
        //     request(app)
        //       .post('/login')
        //       .send({
        //         username: 'user3'
        //       }).end(function(err, res, body) {
        //         this.token = res.body.token;
        //
        //         this.socket1 = io.connect(socketURL, {
        //           'forceNew': true,
        //           'query': 'token=' + this.token
        //         });
        //
        //       }.bind(this));
        //
        //     request(app)
        //       .post('/login')
        //       .send({
        //         username: 'user4'
        //       }).end(function(err, res, body) {
        //         this.token = res.body.token;
        //
        //         this.socket2 = io.connect(socketURL, {
        //           'forceNew': true,
        //           'query': 'token=' + this.token
        //         });
        //
        //         done();
        //       }.bind(this));
        //   });
        //
        //   it('should inform other clients connection', function(done) {
        //     this.socket1.on('user_joined', function(data) {
        //       expect(data.username).to.equal('user4');
        //       done();
        //     });
        //   });
        //
        //   it('should receive x and y positions', function(done) {
        //     this.socket1.emit('position', {
        //       x: 200,
        //       y: 300
        //     });
        //
        //     this.socket2.on('position', function(data) {
        //       assert.equal(data.x, 200);
        //       assert.equal(data.y, 300);
        //       done();
        //     });
        //   });
        //
        //   after(function() {
        //     this.socket1.disconnect();
        //     this.socket2.disconnect();
        //   });
        // });
      });
    });


})();
