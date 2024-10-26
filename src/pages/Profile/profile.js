import React, { useState, useEffect } from 'react';
import './profile.css'; // Import the CSS file
import profileIcon from '../../asset/Generic_avatar.png';
import gear from '../../asset/gear.png';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const Profile = () => {
  const [profile, setProfile] = useState({
    tdbName: '', // tdb profile name
    spotifyName: '', // Spotify profile name
    spotifyLink: 'https://open.spotify.com/', // Spotify profile link
  });

  const [spotifyName, setSpotifyName] = useState('');
  const [username, setUsername] = useState(''); // Displayed username
  const [name, setName] = useState(''); // Name input
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [playlists, setPlaylists] = useState([]); // State to hold playlist data

  const navigate = useNavigate(); // Hook to navigate to another route

  const handleSettingsClick = () => {
    navigate('/settings'); // Navigate to the settings page
  };

  // Fetch Spotify Name on mount
  useEffect(() => {
    fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getSpotifyName.php', {
      method: 'GET',
      credentials: 'include', // Ensure session cookies are included
    })
      .then(response => response.json())
      .then(data => {
        if (data && data.spotifyName) { // Check for the correct property
          setSpotifyName(data.spotifyName); // Set the Spotify name
          localStorage.setItem('spotifyName', JSON.stringify(data.spotifyName)); // Store locally for caching
        } else {
          console.error('No Spotify name found in response:', data);
        }
      })
      .catch(err => console.error('Error fetching Spotify Name:', err));
  }, []);

  // Fetch Username on mount
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const response = await fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getUsername.php', {
          method: 'GET',
          credentials: 'include', // Include credentials if necessary
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        if (data.success) {
          setUsername(data.username); // Update state with username
          setName(data.username); // Pre-populate the form input
        } else {
          setError(data.message); // Handle any error messages from the backend
        }
      } catch (err) {
        setError(err.message); // Set error state if the fetch fails
      } finally {
        setLoading(false); // Stop loading regardless of success or failure
      }
    };
    fetchUsername();
  }, []); // Empty dependency array means this runs once on mount

  // Fetch playlists on mount (updated to not use recently played tracks)
  useEffect(() => {
    // Fetch the user's playlists from the server
    fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getUserPlaylists.php', {
      method: 'GET',
      credentials: 'include',
    })
      .then((response) => response.json())
      .then((data) => {
        setPlaylists(data);
      })
      .catch((error) => console.error('Error fetching playlists:', error));
  }, []);


  return (
    <div className="profile-container">
      <div className="profile-box">
        {/* Profile Icon */}
        <div className="profile-icon">
          <img src={profileIcon} alt="Profile Icon" />
        </div>

        {/* Profile Information */}
        <h2>{username}</h2>

        <div className="profile-info">Spotify: {spotifyName || 'Not Connected'}</div>

        {/* Spotify Link/Button */}
        <a href={profile.spotifyLink} target="_blank" rel="noopener noreferrer" className="spotify-link">
          Visit Spotify
        </a>

        {/* Gear Icon with onClick */}
        <div className="gear-icon" onClick={handleSettingsClick} style={{ cursor: 'pointer' }}>
          <img src={gear} alt="Gear Icon" />
        </div>
      </div>

      {/* Playlist Section */}
      <div className="playlist-container" id="playlistContainer">
        {playlists.length > 0 ? (
          playlists.map((playlist, index) => (
            <div key={index} className="playlist-item">
              <h3>{playlist.playlist_name}</h3>
              <p>Playlist ID: {playlist.playlist_id}</p>
              <p>Tracks:</p>
              <ul>
                {typeof playlist.track_uris === 'string' ? (
                  playlist.track_uris.split(';').map((uri, index) => (
                    <li key={index}>
                      <a href={`https://open.spotify.com/track/${uri.split(':').pop()}`} target="_blank" rel="noopener noreferrer">
                        Track {index + 1}
                      </a>
                    </li>
                  ))
                ) : (
                  <li>No tracks found.</li>
                )}
              </ul>
            </div>
          ))
        ) : (
          <p>No playlists available</p>
        )}
      </div>
    </div>
  );

};

export default Profile;

