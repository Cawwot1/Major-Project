import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/main.css';
import PongModal from '../OOP_Game/Snake';

export default function TrackerNavBar() {
  const [showPong, setShowPong] = useState(false);

  return (
    <div className="tracker-nav-bar">
      <a href="https://wargaming.net/en/games/wotb" id="wotb_logo">
        <img src="/WOTB_logo.png" alt="World of Tanks Blitz Logo" />
      </a>
      <div className="tracker-nav-bar-elements">
        <Link className="tracker-nav-bar-buttons" to="/">
          Home
        </Link>
        <div className="push-right" id="login-right-button-container">
          <div>
            <button className="btn btn-primary" id="login-button" onClick={() => setShowPong(true)}>Play Snake</button>
            {showPong && <PongModal onClose={() => setShowPong(false)} />}
          </div>
          <a href="/login">
            <button type="button" className="btn btn-primary" id="login-button">
              Login
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
