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

      <a id="wg-games-wrapper-main" href="https://wargaming.net/en">
        <div id="wg-games-holder">
          <p id="wargaming-nav-bar-games-text">
            Games <span className="dropdown-arrow"></span>
          </p>
        </div>
      </a>
      <a id="wg-services-wrapper-main" href="https://wargaming.net/en/wgc">
        <div id="wg-services-holder">
          <p id="wargaming-nav-bar-services-text">
            Services <span className="dropdown-arrow"></span>
          </p>
        </div>
      </a>
      <a id="wg-premium-wrapper-main" href="https://wargaming.net/shop/">
        <div id="wg-premium-holder">
          <p id="wargaming-nav-bar-premium-text">Premium Shop</p>
        </div>
      </a>
      <a id="wg-support-wrapper-main" href="https://wargaming.net/support/en/">
        <div id="wg-support-holder">
          <p id="wargaming-nav-bar-support-text">Player Support</p>
        </div>
      </a>
    </div>
  );
}
