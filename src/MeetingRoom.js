/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
import { useParams } from 'react-router-dom';
import io from "socket.io-client";
import Peer from "simple-peer";
import './App.css';

export const createPeer = (socketId, roomId, socket, stream, partnerVideo) => {
  const peer = new Peer({
    initiator: true,
    trickle: false,
    stream: stream,
  });

  peer.on('signal', (sdp) => {
    socket.emit('webrtc_offer', {
      sdp: sdp,
      roomId: roomId,
    });
  });

  peer.on('track', (track, stream) => {
    partnerVideo.current.srcObject = stream;
  });

  return peer;
}

function MeetingRoom() {
    const { roomId } = useParams();
    const [socket, setSocket] = useState();
    const userVideo = useRef(null);
    const partnerVideo = useRef(null);
    const peerRef = useRef();
  
    const handleRoomCreated = () => {
      peerRef.current = createPeer(socket.id, roomId, socket, userVideo.current.srcObject, partnerVideo);
    };
  
    const handleRoomJoined = () => {
      peerRef.current = createPeer(socket.id, roomId, socket, userVideo.current.srcObject, partnerVideo);
      socket.emit('start_call', roomId);
    };
  
    const handleStartCall = () => {
      const peer = peerRef.current;
      const stream = userVideo.current.srcObject;
      stream.getTracks().forEach(track => peer.addTrack(track, stream));
    };
  
    const handleWebRTCOffer = (sdp) => {
      const peer = peerRef.current;
      peer.setRemoteDescription(sdp)
        .then(() => {
          return peer.createAnswer();
        })
        .then(answer => {
          return peer.setLocalDescription(answer);
        })
        .then(() => {
          socket.emit('webrtc_answer', {
            sdp: peer.localDescription,
            roomId: roomId,
          });
        })
    };
  
    const handleWebRTCAnswer = (sdp) => {
      const peer = peerRef.current;
      peer.setRemoteDescription(sdp);
    };
  
    const handleWebRTCIceCandidate = (event) => {
      const peer = peerRef.current;
      const iceCandidate = new RTCIceCandidate(event.candidate);
      peer.addIceCandidate(iceCandidate);
    };
  
    useEffect(() => {
      setSocket(io.connect("/"));
    }, []);
  
    useEffect(() => {
      if (socket) {
        navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then(stream => {
          userVideo.current.srcObject = stream;
          socket.emit('join room', roomId);
  
          socket.on('room_created', handleRoomCreated);
          socket.on('room_joined', handleRoomJoined);
          socket.on('start_call', handleStartCall);
          socket.on('webrtc_offer', handleWebRTCOffer);
          socket.on('webrtc_answer', handleWebRTCAnswer);
          socket.on('webrtc_ice_candidate', handleWebRTCIceCandidate);
        });
      }
    }, [socket, roomId]);
  
    return (
      <div className="App">
        <h1>Video Chat App</h1>
        <div className="video-container">
          <div className="video">
            <video playsInline ref={userVideo} autoPlay muted role="presentation" />
          </div>
          <div className="video">
            <video playsInline ref={partnerVideo} autoPlay role="presentation" />
          </div>
        </div>
      </div>
    );
  }
  

export default MeetingRoom;
