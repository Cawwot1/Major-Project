import '../styles/main.css'

export default function StatsPage() {
    return (
      <div className="main-content" id="player-stats-main-content">
        <div id="player-stats-head-background">
          <section className="section-flex" id="player-stats-head">
            <div className="title-container">
              <p id="player-stats-heading">Stats for Username</p>
            </div>
            <div id="stats-head-button-container">
              <a className="player-stats-text1"><p>STAR</p></a>
              <a className="stats-head-button2"><p>Example 1</p></a>
              <a className="stats-head-button2"><p>Example 2</p></a>
            </div>
            <div id="stats-head-statistics-container">
              <div id="general-stats">
                <p className="player-stats-text1">statistic1 </p>
                <p className="player-stats-text1">statistic2 </p>
                <p className="player-stats-text1">statistic3 </p>
                <p className="player-stats-text1">statistic4 </p>
              </div>
              <div id="country-tank-rank-stats">
                <div id="country-tank-rank-stats-sub-container">
                  <p className="player-stats-text1">statistic1 </p>
                  <p className="player-stats-text1">statistic2 </p>
                  <p className="player-stats-text1">statistic3 </p>
                  <p className="player-stats-text1">statistic4 </p>
                </div>
                <div id="country-tank-rank-stats-sub-container">
                  <p className="player-stats-text1">statistic1 </p>
                  <p className="player-stats-text1">statistic2 </p>
                  <p className="player-stats-text1">statistic3 </p>
                  <p className="player-stats-text1">statistic4 </p>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    );
  }
  