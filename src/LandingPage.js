import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function LandingPage() {
  const [roomId, setRoomId] = useState("");
  const navigate = useNavigate();

  const startVideo = () => {
    if (roomId === "") {
        alert("Please enter a Room ID");
        return;
      }
      navigate(`/meeting/${roomId}`);
    };

  return (
    <div className="App">
      <h1>Video Chat App</h1>
      <div>
        <input type="text" placeholder="Enter Room ID" onChange={e => setRoomId(e.target.value)} />
        <button onClick={startVideo}>Start Video Chat</button>
      </div>
    </div>
  );
}

export default LandingPage;
