import React from 'react';
import WargamingNavBar from './header/WGHeader';
import TrackerNavBar from './header/TrackerHeader';

export default function Header() {
  return (
    <header className="header">
      <WargamingNavBar />
      <TrackerNavBar />
    </header>
  );
}
