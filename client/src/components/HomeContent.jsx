import React from 'react';
import PlayerSearch from './homecontent/SearchPlayer';
import DiscordLink from './logos/DiscordLogo';
import NewsSection from './homecontent/News';
import RankingsSection from './homecontent/Rankings';

import '../styles/main.css'

export default function MainContent() {
  return (
    <div className="main-content">
      <div id="section-search-player-background">
        <div id="section-search-player">
          <PlayerSearch />
          <DiscordLink />
        </div>
      </div>
      <NewsSection />
      <RankingsSection />
    </div>
  );
}
