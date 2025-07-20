import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css';
import PongModal from '../OOP_Game/Snake';
import ChatModal from '../Chatbot/Chatbot';

export default function TrackerNavBar() {
  const [showPong, setShowPong] = useState(false);
  const [showChat, setShowChat] = useState(false);

  const navigate = useNavigate();

  const handleLogoutClick = async () => {
    try {
      const csrfToken = localStorage.getItem('csrfToken');
  
      const response = await fetch('http://localhost:5050/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'csrfToken': csrfToken || ''
        },
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error(`Logout failed: ${response.statusText}`);
      }
  
      // Optional: Remove local auth-related data
      localStorage.removeItem('csrfToken');
  
      // Redirect to login or stats page
      navigate('/');
  
    } catch (err) {
      console.error('Logout error:', err.message);
    }
  };

  return (
    <div className="tracker-nav-bar">
      <a href="https://wargaming.net/en/games/wotb" id="wotb_logo">
        <img src="/WOTB_logo.png" alt="World of Tanks Blitz Logo" />
      </a>
      <div className="tracker-nav-bar-elements">
        <a className="tracker-nav-bar-buttons" href="/">Home</a>
        <div className="push-right" id="login-right-button-container">
          <div>
          <button className="btn btn-primary" id="login-button" onClick={() => setShowChat(true)}>Open Gemini Chatbot</button>
          {showChat && <ChatModal onClose={() => setShowChat(false)} />}
          </div>
          <div>
            <button className="btn btn-primary" id="login-button" onClick={() => setShowPong(true)}>Play Snake</button>
            {showPong && <PongModal onClose={() => setShowPong(false)} />}
          </div>
          <button 
            type="button" 
            className="btn btn-primary" 
            id="login-button"
            onClick={handleLogoutClick}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
