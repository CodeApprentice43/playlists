import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Callback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getRecentlyPlayedTracks.php', {
      method: 'GET', 
      credentials: 'include',
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`Error: ${response.status} - ${response.statusText}`);
      }
      return response.json();
    })
    .then(data => {
      localStorage.setItem('recentlyPlayed', JSON.stringify(data));
      navigate('/home');
    })
    .catch(err => {
      console.error('Error fetching recently played tracks:', err);
    });
  }, [navigate]);
  

  return <h1>Fetching Recently Played...</h1>;
};

export default Callback;
