/*jslint node: true */
'use strict';

function handleIsUsernameAvailable(name) {
  if(!clients[name]) {
    return true;
  }

  return false;
}

function handleInit(server, jwt_secret) {
  io = require('socket.io').listen(server);
  io.use(io_jwt.authorize({
    secret: jwt_secret,
    handshake: true
  }));

  io.on('connection', handleIO);
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

  socket.broadcast.emit('user_joined', {
    username: username
  });
}

function handleClose() {
  io.engine.close();
}

var clients = {},
  io,
  io_jwt = require('socketio-jwt');

module.exports = {
  isUsernameAvailable: handleIsUsernameAvailable,
  init: handleInit,
  close: handleClose
};
