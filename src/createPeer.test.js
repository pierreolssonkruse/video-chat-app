import React from 'react';
import { createPeer } from './MeetingRoom';
import Peer from 'simple-peer';

require('setimmediate');

jest.mock('simple-peer', () => {
  return function(options) {
    return {
      options: options,
      on: jest.fn((event, handler) => {
        if (event === 'signal') {
          handler('mockSdp');
        }
      }),
      signal: jest.fn()
    };
  };
});

class MockPeer {
  constructor(config) {
    this.config = config;
    this.on = jest.fn((event, handler) => {
      if (event === 'signal') {
        handler('mockSdp');
      }
    });
    this.signal = jest.fn();
  }
}

Peer.default = MockPeer;

test('createPeer function initializes Peer object correctly', () => {
  const mockStream = {};
  const socket = { id: 'someSocketId', emit: jest.fn() };
  const roomId = 'someRoomId';
  const partnerVideo = React.createRef();

  const peer = createPeer(socket.id, roomId, socket, mockStream, partnerVideo);

  expect(peer.options).toEqual({
    initiator: true,
    trickle: false,
    stream: mockStream,
  });

  const mockSdp = 'mockSdp';
  peer.signal(mockSdp);
  expect(socket.emit).toHaveBeenCalledWith('webrtc_offer', {
    sdp: mockSdp,
    roomId: roomId,
  });
});

