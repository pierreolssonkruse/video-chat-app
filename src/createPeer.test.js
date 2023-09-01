import React from 'react';
import { createPeer } from './App';
import Peer from 'simple-peer';

require('setimmediate');

jest.mock('simple-peer');

test('createPeer function initializes Peer object correctly', () => {
  const mockStream = {};
  const socket = { id: 'someSocketId', emit: jest.fn() };
  const roomId = 'someRoomId';
  const partnerVideo = React.createRef();

  createPeer(socket.id, roomId, socket, mockStream, partnerVideo);

  expect(Peer).toHaveBeenCalledWith({
    initiator: true,
    trickle: false,
    stream: mockStream,
  });
});
