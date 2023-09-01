const express = require('express');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

io.on('connection', socket => {
  socket.on('join room', roomId => {
    const roomClients = io.sockets.adapter.rooms[roomId] || { length: 0 };
    const numberOfClients = roomClients.length;

    // These events are emitted to individual sockets.
    if (numberOfClients === 0) {
      console.log(`Creating room ${roomId} and emitting room_created socket event`);
      socket.join(roomId);
      socket.emit('room_created', roomId);
    } else if (numberOfClients === 1) {
      console.log(`Joining room ${roomId} and emitting room_joined socket event`);
      socket.join(roomId);
      socket.emit('room_joined', roomId);
    } else {
      console.log(`Can't join room ${roomId}, emitting full_room socket event`);
      socket.emit('full_room', roomId);
    }
  });

  // These events are emitted to all connected sockets.
  socket.on('start_call', roomId => {
    console.log(`Broadcasting start_call event to all clients in room ${roomId}`);
    socket.broadcast.to(roomId).emit('start_call');
  });
  socket.on('webrtc_offer', (event) => {
    console.log(`Broadcasting webrtc_offer event to all clients in room ${event.roomId}`);
    socket.broadcast.to(event.roomId).emit('webrtc_offer', event.sdp);
  });
  socket.on('webrtc_answer', (event) => {
    console.log(`Broadcasting webrtc_answer event to all clients in room ${event.roomId}`);
    socket.broadcast.to(event.roomId).emit('webrtc_answer', event.sdp);
  });
  socket.on('webrtc_ice_candidate', (event) => {
    console.log(`Broadcasting webrtc_ice_candidate event to all clients in room ${event.roomId}`);
    socket.broadcast.to(event.roomId).emit('webrtc_ice_candidate', event);
  });
});

server.listen(5000, () => {
  console.log('listening on *:5000');
});
