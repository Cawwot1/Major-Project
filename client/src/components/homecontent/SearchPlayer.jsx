import { useState } from 'react';
import '../../styles/main.css'

export default function PlayerSearch() {
  const [username, setUsername] = useState('');
  // username: state variable for input
  // setUsername: function to update username
  // useState(''): sets initial value to empty string
  const [result, setResult] = useState(null);
    
  const handleSearch = async () => { //=> shorter method of defining functions
    try {
      const response = await fetch(`http://localhost:5050/api/player-search?nickname=${encodeURIComponent(username)}`); //encodes username
      const data = await response.json(); // parses the response as JSON
      setResult(data);
    }
    catch (error) {
      console.error('Error fetching player data:', error); //Notifies error
    }
  };

  return (
    <div className="container-fluid" id="player-search-form-container">
      <label htmlFor="player-search-form" className="form-label" id="search-player-form-label">
        Show Statistics for
      </label>
      <input 
        type="text" 
        className="form-control" 
        id="player-search-form" 
        placeholder="Enter Username"
        value={username} 
        onChange={(e) => setUsername(e.target.value)}/> 
      <div id="home-player-search-container">
        <button type="button" className="btn btn-primary" id="home-player-search-button" onClick={handleSearch}>
          Search Player
        </button>
      </div>
    </div>
  ); //onChange -> keystrokes trigger onChange, setUsername updates username in state
}
