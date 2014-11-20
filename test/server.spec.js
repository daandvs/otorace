(function() {
  'use strict';

  var chai = require('chai'),
    sinon = require('sinon'),
    assert = chai.assert,
    expect = chai.expect,
    request = require('supertest'),
    requireHelper = require('../lib/require_helper'),

    server = requireHelper('server'),

    socketURL = 'http://0.0.0.0:3000',
    app = request(socketURL),

    io = require('socket.io-client'),

    jwt = require('jsonwebtoken');
    // In Node.js require(..) loads modules once into a cache.
    // As our test case runs first it will loads the request module first.
    // We use the reference to the module to be able to stub methods on it.

  function createSocket(token) {
    var socket = io.connect(socketURL, {
      'forceNew': true,
      'query': 'token=' + token
    });

    return socket;
  }

  describe('server test', function() {
    before(function() {
      server.start();
    });

    after(function(done) {
      server.stop(done);
    });

    describe('/', function() {
      beforeEach(function() {
        this.request = app.get('/');
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
        app.post('/login')
          .expect(401, done);


      });


      it('should have Content-Type application/json', function(done) {
        app
          .post('/login')
          .send({
            username: 'xx'
          })
          .expect('Content-Type', 'application/json')
          .end(function(err, res) {
            done();
          });
      });

      describe('jwt auth', function() {
        before(function(done) {
          this.jwtStub = sinon.stub(jwt, 'sign', function() {
            return 'this is the token';
          });

          this.clock = sinon.useFakeTimers();

          this.user = {
            username: 'user1'
          };

          this.token = '';
          this.login = app
            .post('/login')
            .send(this.user)
            .end(function(err, res) {
              this.token = res.body.token;
              done();
            }.bind(this));
        });

        after(function() {
          this.jwtStub.restore();
          this.clock.restore();
        });

        it('should create web token', function() {
          chai.assert.ok(this.jwtStub.calledWith({stamp: 0, username: this.user.username}));
          chai.assert.equal(this.jwtStub.args[0].length, 3);
        });

        it('should return web token', function() {
          chai.assert.equal(this.token, 'this is the token');
        });

        // it('should return 401 if username already exist',
        //   function(done) {
        //     var username = {
        //       username: 'user1'
        //     };
        //
        //     request(app)
        //       .post('/login')
        //       .send(username)
        //       .expect(401, done);
        //   });



        //
        // after(function() {
        //   this.socket1.disconnect();
        // });
      });

      describe('socket.io', function() {

        // before(function(done) {
        //   this.user = {
        //     username: 'socket_1'
        //   };
        //
        //   this.socket = undefined;
        //
        //   request(app)
        //     .post('/login')
        //     .send(this.user)
        //     .end(function(err, res) {
        //       this.socket = createSocket(res.body.token);
        //       done();
        //     }.bind(this));
        // });

        it('should return 401 if username already exist', function(done) {
            var username = {
              username: 'user2'

            };

            // var request_1 = request(app);

            app
              .post('/login')
              .send(username)
              .end(function(err, res) {
                var mysocket = createSocket(res.body.token);


                mysocket.on('connect', function() {




                  app
                    .post('/login')
                    .send(username)

                    .expect(401)
                    .end(function(err, res) {
                      if(err) {
                        return done(err);
                      }

                      mysocket.disconnect();
                      done();


                    });
                });
              });
          });


        it('should have user available again after disconnect', function(done) {
          var user = {
            username: 'socket_1'
          };

          app
            .post('/login')
            .send(user)
            .end(function(err, res) {
              // console.log('token ' + res.body.token);

              var socket_1 = createSocket(res.body.token);

              socket_1.on('connect', function() {
                socket_1.disconnect();

                app
                    .post('/login')
                    .send(user)

                    .end(function(err, res) {

                      var socket_2 = createSocket(res.body.token);
                      socket_2.on('connect', function() {
                        socket_2.disconnect();
                        done();
                      });
                    });



              });
            })
          });

        it('should fail to connect without token', function(done) {
          var socket = createSocket('false_token');

          socket.on('error', function(err) {
            assert.equal(err.type, 'UnauthorizedError');
            done();
          });
        });
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
