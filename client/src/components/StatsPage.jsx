import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/main.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import TrackerNavBar from './header/TrackerHeader (stats)';
import { useNavigate } from "react-router-dom";

export default function StatsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = location.state?.result;
  console.log(username)

  const [playerData, setPlayerData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [searchUsername, setsearchUsername] = useState(null);
  const [isFavourited, setIsFavourited] = useState(false);

  const csrfToken = localStorage.getItem('csrfToken');
  console.log(csrfToken)

  //SEARCH BUTTON PRESSED
  const handleSearch = async (e) => {
    e.preventDefault();
  
    try {
      console.log(searchUsername)
      navigate('/stats', { state: { result: searchUsername } });
    } catch (err) {
      console.error("Unexpected error:", err);
      alert("Navigation failed due to an unexpected issue.");
    }    
  };  

  useEffect(() => {
    setLoading(true);
    setError(null);
    setPlayerData(null);
  }, [username]);

  useEffect(() => {
    if (!username) {
      setError("No username provided.");
      console.log("No username provided.")
      return;
    }

    const fetchPlayerData = async () => {
      try {
        const response = await fetch(`http://localhost:5050/player-search?nickname=${encodeURIComponent(username)}`, {
          headers: {
            "csrfToken": csrfToken,
          },
          credentials: "include" //DO NOT PUT THIS IN THE HEADER (it will not work)
        });
        if (!response.ok) {
          throw new Error(`Error fetching player data: ${response.statusText}`);
        }
        const data = await response.json();

        setPlayerData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayerData();
  }, [username]);

  function Loading() {
    const [dots, setDots] = useState('');

    useEffect(() => {
      const interval = setInterval(() => {
        setDots(prev => (prev.length < 3 ? prev + '.' : ''));
      }, 1000);

      return () => clearInterval(interval); // cleanup on unmount
    }, []);

    return (
        <p className='center-screen white-text large-text-size'>Loading player data{dots}</p>
    );
  }

  const renderContent = () => {
    
    //No Name was entered (or Login)

    if (!username) {
      return (
        <div className="player-stats-background">
          <div className="player-stats-main-content-nofound main-content">
            <div className='player-stats-head-background'>
              <form onSubmit={handleSearch} className="form-inline stats-search player-stats-element">
                <input 
                className="form-control mr-sm-2 curved-border" 
                type="search" 
                placeholder="Search Player Name" 
                aria-label="Search"
                value={searchUsername || ''}
                onChange={(e) => setsearchUsername(e.target.value)}
                />
                <button className="button-format btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
              <p id="stats-no-player" className="horizontal-center medium-text-size player-stats-element">
                No name was entered, please search for a player
              </p>
            </div>
          </div>
        </div>
      );
    }

    //PLAYER NOT FOUND
    if (loading) return <Loading />;
    if (error) return <p>Error: {error}</p>;

    if (!playerData || playerData.name === "player not found") {
      return (
        <div className="player-stats-background">
          <div className="player-stats-main-content-nofound main-content">
            <div className='player-stats-head-background'>
              <form onSubmit={handleSearch} className="form-inline stats-search player-stats-element">
                <input 
                className="form-control mr-sm-2 curved-border" 
                type="search" 
                placeholder="Search Player Name" 
                aria-label="Search"
                value={searchUsername}
                onChange={(e) => setsearchUsername(e.target.value)}
                />
                <button className="button-format btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
              </form>
              <p id="stats-no-player" className="horizontal-center medium-text-size player-stats-element">Player "{username}" not found. Please search a name.</p>
            </div>
          </div>
        </div>
        );
    }

    const { all } = playerData.data;
    const name = playerData.name;

    //PLAYER FOUND
    return (

      <div className="player-stats-background">
        <div className="player-stats-main-content-found main-content">
          <div className='player-stats-head-background'>
            <form onSubmit={handleSearch} className="form-inline stats-search player-stats-element">
              <input 
              className="form-control mr-sm-2 curved-border" 
              type="search" 
              placeholder="Search Player Name" 
              aria-label="Search"
              value={searchUsername}
              onChange={(e) => setsearchUsername(e.target.value)}
              />
              <button className="button-format btn btn-outline-success my-2 my-sm-0" type="submit">Search</button>
            </form>
            <section className="section-flex player-stats-element" id="player-stats-head">
              <div className="title-container">
                <p id="player-stats-heading" className=''>Stats for {name}</p>
              </div>
              <div id="stats-head-button-container">
                <a className="player-stats-text1">
                <button
                  type="button"
                  className={`btn btn-outline-primary rounded-circle p-2 favourite-button ${isFavourited ? 'favourited' : ''}`}
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title="Add to favourites"
                  onClick={() => setIsFavourited(!isFavourited)}>
                  <svg 
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide-star favourite-button-star"
                  >
                    <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z" />
                  </svg>
                </button>
                </a>
              </div>
              <div id="stats-head-statistics-container">
              <table className="table table-bordered table-dark text-center stats-table">
                <thead>
                  <tr>
                    <th scope="col" className='stats-table-column'></th>
                    <th scope="col">Overall</th>
                    <th scope="col">Recent</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <th scope="row" className='fw-normal stats-table-column'>Battles</th>
                    <td>{all.battles}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>
                        Win Rate
                    </th>
                    <td className={
                      all.battles === 0
                        ? 'fw-normal'
                        : (all.wins / all.battles) * 100 > 85
                        ? 'green'
                        : (all.wins / all.battles) * 100 > 70
                        ? 'light-green'
                        : (all.wins / all.battles) * 100 > 55
                        ? 'yellow'
                        : (all.wins / all.battles) * 100 > 40
                        ? 'orange'
                        : 'red'}>
                      {all.battles>0?(all.wins / all.battles *100).toFixed(2) : '-'}%
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Battles Survived</th>
                    <td>{all.survived_battles}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Points Captured</th>
                    <td>{all.capture_points}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-bold'>Average Battle Values</th>
                    <td></td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Damage</th>
                    <td className={
                      all.battles === 0
                        ? 'fw-normal'
                        : (all.damage_dealt / all.battles) >= 2000
                        ? 'green'
                        : (all.damage_dealt / all.battles) >= 1500
                        ? 'light-green'
                        : (all.damage_dealt / all.battles) >= 1000
                        ? 'yellow'
                        : (all.damage_dealt / all.battles) >= 700
                        ? 'orange'
                        : 'red'}>
                        {all.damage_dealt>0?(all.damage_dealt / all.battles).toFixed(0) : '-'}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Destroyed Tanks</th>
                    <td className={
                      all.battles === 0
                      ? 'fw-normal'
                      : (all.frags / all.battles) >= 2
                      ? 'green'
                      : (all.frags / all.battles) >= 1.5
                      ? 'light-green'
                      : (all.frags / all.battles) >= 1
                      ? 'yellow'
                      : (all.frags / all.battles) >= 0.7
                      ? 'orange'
                      : 'red'}>
                      {all.frags>0?(all.frags / all.battles).toFixed(1) : '-'}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Experience</th>
                    <td>{all.xp>0?(all.xp / all.battles).toFixed(0) : '-'}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className={'fw-normal'}>
                      Kill / Death
                      </th>
                    <td className={
                      all.battles === 0
                        ? 'fw-normal'
                        : all.frags / (all.battles-all.survived_battles) >= 3
                        ? 'green'
                        : all.frags / (all.battles-all.survived_battles) >= 2
                        ? 'light-green'
                        : all.frags / (all.battles-all.survived_battles) >= 1.2
                        ? 'yellow'
                        : all.frags / (all.battles-all.survived_battles) >= 0.8
                        ? 'orange'
                        : 'red'}>
                      {(all.battles-all.survived_battles)>0?(all.frags / (all.battles-all.survived_battles)).toFixed(2) : '-'}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Tanks Spotted</th>
                    <td>{all.spotted>0?(all.spotted / all.battles).toFixed(2) : '-'}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Shots</th>
                    <td>{all.shots>0?(all.shots / all.battles).toFixed(1) : '-'}</td>
                    <td></td>
                  </tr>
                  <tr>
                    <th scope="row" className='fw-normal'>Damage Recieved</th>
                    <td>{all.damage_recieved>0?(all.damage_recieved / all.battles).toFixed(0) : '-'}</td> 
                    <td></td>
                  </tr>
                </tbody>
              </table>

              </div>
            </section>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div>
      <TrackerNavBar />
      {renderContent()}
    </div>
  );
}
