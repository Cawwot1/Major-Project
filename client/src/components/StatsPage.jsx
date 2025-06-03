import '../styles/main.css'
import { useLocation } from 'react-router-dom';

export default function StatsPage() {
  const location = useLocation();
  const result = location.state?.result;

  // Print result to console for debugging
  console.log('StatsPage result:', result);

  // Guard: if no data, show loading or no data message
  if (!result || !result.data) {
    return <p>Loading or no player data available.</p>;
  }

  const { all } = result.data;
  const name = result.name;

  return (
    <div className="main-content" id="player-stats-main-content">
      <div id="player-stats-head-background">
        <section className="section-flex" id="player-stats-head">
          <div className="title-container">
            <p id="player-stats-heading">Stats for {name}</p>
          </div>
          <div id="stats-head-button-container">
            <a className="player-stats-text1"><p>STAR</p></a>
            <a className="stats-head-button2"><p>Example 1</p></a>
            <a className="stats-head-button2"><p>Example 2</p></a>
          </div>
          <div id="stats-head-statistics-container">
            <div id="general-stats">
              <p className="player-stats-text1">Battles: {all.battles}</p>
              <p className="player-stats-text1">Capture Points: {all.capture_points}</p>
              <p className="player-stats-text1">Damage Dealt: {all.damage_dealt}</p>
              <p className="player-stats-text1">Damage Received: {all.damage_received}</p>
            </div>
            <div id="country-tank-rank-stats">
              <div id="country-tank-rank-stats-sub-container">
                <p className="player-stats-text1">Frags: {all.frags}</p>
                <p className="player-stats-text1">Wins: {all.wins}</p>
                <p className="player-stats-text1">XP: {all.xp}</p>
                <p className="player-stats-text1">Losses: {all.losses}</p>
              </div>
              <div id="country-tank-rank-stats-sub-container">
                <p className="player-stats-text1">Shots: {all.shots}</p>
                <p className="player-stats-text1">Spotted: {all.spotted}</p>
                <p className="player-stats-text1">Survived Battles: {all.survived_battles}</p>
                <p className="player-stats-text1">Max XP: {all.max_xp}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
