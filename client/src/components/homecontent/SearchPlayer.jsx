import '../../styles/main.css'

export default function PlayerSearch() {
    return (
      <div className="container-fluid" id="player-search-form-container">
        <label htmlFor="player-search-form" className="form-label" id="search-player-form-label">
          Show Statistics for
        </label>
        <input type="email" className="form-control" id="player-search-form" placeholder="Enter Username" />
        <div id="home-player-search-container">
          <button type="button" className="btn btn-primary" id="home-player-search-button">
            Search Player
          </button>
        </div>
      </div>
    );
  }
  