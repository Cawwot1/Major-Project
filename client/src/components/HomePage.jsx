import React from 'react';
import PlayerSearch from './homecontent/SearchPlayer';
import DiscordLink from './logos/DiscordLogo';
import NewsSection from './homecontent/News';

import '../styles/main.css'
import TrackerNavBar from './header/TrackerHeader';

export default function HomePage() {

  return (
    <div>
      <TrackerNavBar />
      <div className="main-content">
        <div id="section-search-player-background">
          <div id="section-search-player">
            <PlayerSearch />
            <DiscordLink />
          </div>
        </div>
        <NewsSection />
      </div>
    </div>
  );
}
