import React from 'react';
import '../../styles/main.css';
import WGLogo from '../logos/WGLogo';

export default function WargamingNavBar() {
  return (
    <div className="wargaming-nav-bar">
        <div id="wg-logo-wrapper-main">
          <div id="wg-logo-icon-holder">
            <WGLogo/>
          </div>
        </div>

      <div id="wg-games-wrapper-main">
        <div id="wg-games-holder">
          <p id="wargaming-nav-bar-games-text">
            Games <span className="dropdown-arrow"></span>
          </p>
        </div>
      </div>
      <div id="wg-services-wrapper-main">
        <div id="wg-services-holder">
          <p id="wargaming-nav-bar-services-text">
            Services <span className="dropdown-arrow"></span>
          </p>
        </div>
      </div>
      <div id="wg-premium-wrapper-main">
        <div id="wg-premium-holder">
          <p id="wargaming-nav-bar-premium-text">Premium Shop</p>
        </div>
      </div>
      <div id="wg-support-wrapper-main">
        <div id="wg-support-holder">
          <p id="wargaming-nav-bar-support-text">Player Support</p>
        </div>
      </div>
    </div>
  );
}
