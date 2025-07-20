import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/main.css'

export default function PlayerSearch() {
  const [username, setUsername] = useState('');
  // username: state variable for input
  // setUsername: function to update username
  // useState(''): sets initial value to empty string
  const [result, setResult] = useState(null);
  const navigate = useNavigate(); // React Router hook
    
  const handleSearch = async () => {
    try {
      const response = await fetch(`http://localhost:5050/player-search?nickname=${encodeURIComponent(username)}`);
  
      if (!response.ok) {
        // If response is not ok (like 401 Unauthorized), navigate to login
        navigate('/login');
        return; // stop further execution
      }
  
      const data = await response.json();
      setResult(data);
  
      navigate('/stats', { state: { result: data } });
    } catch (error) {
      console.error('Error fetching player data:', error);
      navigate('/login');
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
        onChange={(e) => setUsername(e.target.value)}
        autoComplete="off"/> 
      <div id="home-player-search-container">
        <button type="button" className="btn btn-primary" id="home-player-search-button" onClick={handleSearch}>
          Search Player
        </button>
      </div>
    </div>
  ); //onChange -> keystrokes trigger onChange, setUsername updates username in state
}
