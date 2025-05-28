import React from 'react';
import '../../styles/main.css';

export default function TrackerNavBar() {
  return (
    <div className="tracker-nav-bar">
      <a href="https://wargaming.net/en/games/wotb" id="wotb_logo">
        <img
          src="/WOTB_logo.png"
          alt="World of Tanks Blitz Logo"
        />
      </a>
      <div className="tracker-nav-bar-elements">
        <a className="tracker-nav-bar-buttons" href="/home">Home</a>
        <a className="tracker-nav-bar-buttons" href="/api">API</a>
        <div className="push-right">
          <a href="/login">
            <button type="button" className="btn btn-primary" id="login-button">
              Login
            </button>
          </a>
          <a href="/signup">
            <button type="button" className="btn btn-primary" id="login-button">
              Sign Up
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
