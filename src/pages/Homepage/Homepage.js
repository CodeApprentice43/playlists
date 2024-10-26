import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import profileImage from './Generic_avatar.png'; // Import your profile image
import settingsIcon from './settingsIcon.png';
import linkImage from './link.png'; // Import link image

const HomePage = () => {
  const [recentlyPlayed, setRecentlyPlayed] = useState([]);
  const [mood, setMood] = useState('happy'); // Track selected mood
  const [moodPlaylist, setMoodPlaylist] = useState(null); // Store generated playlist
  const [showPlaylistOverlay, setShowPlaylistOverlay] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false); // State to control the overlay
  const [topArtistsContent, setTopArtistsContent] = useState(''); // State to store the fetched data
  const [showShareOverlay, setShowShareOverlay] = useState(false); // Overlay for sharing profile
  const [spotifyProfileLink, setSpotifyProfileLink] = useState(''); // Store profile link
  const [myPlaylist, setMyPlaylist] = useState([]);
  const [recommendedTrackUris, setRecommendedTrackUris] = useState([]);
  const [isOverlayOpen, setIsOverlayOpen] = useState(false); // State to control overlay visibility
  const [isHovered, setIsHovered] = useState(false);


  {/*Overlay for the recently played tracks recommendation*/}
  const [showRecOverlay, setShowRecOverlay] = useState(false); // Control overlay visibility for genre
  const closeRecOverlay = () => setShowRecOverlay(false);


  {/*For Genre Stuff (formerly '/playlist') (Currently overlay) */}
  const [selectedGenre, setSelectedGenre] = useState(null); // Track selected genre
const [genrePlaylist, setGenrePlaylist] = useState(null); // Store generated genre playlist
const [showGenreOverlay, setShowGenreOverlay] = useState(false); // Control overlay visibility for genre
const closeGenreOverlay = () => setShowGenreOverlay(false);

//For mood playlist overlay 
const openPlaylistOverlay = () => setShowPlaylistOverlay(true);
const closePlaylistOverlay = () => setShowPlaylistOverlay(false);





const navigate = useNavigate();



{/*Function to generate genre playlist and display overlay*/}
const generateGenrePlaylist = (genre) => {
  fetch(`https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getGenre.php?genre=${genre}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.songs) {
        setGenrePlaylist(data.songs); // Store the list of tracks
        setShowGenreOverlay(true);
      } else {
        console.error('No tracks found in the playlist.');
      }
    })
    .catch((err) => console.error('Error generating playlist:', err));
};

{/*Function to generate Recently Played Recommendations playlist and display overlay*/}
  const handleGeneratePlaylist = async () => {
    const data = {
      recentlyPlayed: recentlyPlayed.map(item => item.track.id),
    };

    try {
      const response = await fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/generateRecommendedPlaylist.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(data),
      });

      const responseData = await response.json();

      if (responseData.success && responseData.recommendedTrackUris) {
        setRecommendedTrackUris(responseData.recommendedTrackUris);
        setShowRecOverlay(true);
        alert('Yay! TBD has just made recommendations for you!');
      } else {
        alert('Oops! Failed to generate recommended playlist.');
      }
    } catch (err) {
      console.error('Error generating recommended playlist:', err);
    }
  };





{/*Function that Saves Mood, Genre, Recommendations Playlists to Spotify*/}
{/*Takes in string to determine the Title and Description of playlist*/}
const savePlaylistNew = (playlist, playlistType) => {

  const trackUris = playlist.map((track) => {
    if (track.uri) {
      // For mood or recent playlists, where URIs are available
      return track.uri;
    } else if (track.external_urls && track.external_urls.spotify) {
      // For genre playlists, extract track ID from Spotify URL
      const spotifyUrl = track.external_urls.spotify;
      const trackId = spotifyUrl.split('/track/')[1];
      return `spotify:track:${trackId}`;
    }
    return null; // Handle missing data gracefully
  }).filter((uri) => uri !== null); // Filter out nulls

  if (trackUris.length === 0) {
    alert('No tracks found to save.');
    return;
  }

  let playlistName = 'My Playlist';
  let playlistDescription = 'Generated playlist.';

  switch (playlistType) {
    case 'genre':
      playlistName = 'Genre Playlist';
      playlistDescription = 'Generated based on your selected Genre.';
      break;
    case 'mood':
      playlistName = 'Mood Playlist';
      playlistDescription = 'Generated based on your selected Mood.';
      break;
    case 'recent':
      playlistName = 'Recently Played Playlist';
      playlistDescription = 'Generated based on your recent plays.';
      break;
    default:
      break;
  }

  fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/savePlaylist.php', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      tracks: trackUris,
      name: playlistName,
      description: playlistDescription,
    }),
  })
    .then((response) => response.json())
    .then((data) => alert(data.message || 'Playlist saved!'))
    .catch((err) => console.error('Error saving playlist:', err));
};

  {/*Heres all the genres!!!*/}
  const genres = [
    { name: 'Pop', value: 'pop' },
    { name: 'R&B', value: 'r-n-b' },
    { name: 'Disney', value: 'disney' },
    { name: 'Broadway', value: 'show-tunes' },
    { name: 'J-Pop', value: 'j-pop' },
    { name: 'Hip-Hop', value: 'hip-hop' },
    { name: 'Sleep', value: 'sleep' },
    { name: 'Folk', value: 'folk' },
    { name: 'K-Pop', value: 'k-pop' },
    { name: 'Country', value: 'country' },
    { name: 'Jazz', value: 'jazz' },
    { name: 'Punk', value: 'punk' },
    { name: 'Rock', value: 'rock' },
    { name: 'Latino', value: 'latino' },
    { name: 'Classical', value: 'classical' },
    { name: 'Anime', value: 'anime' },
    // Add more genres as needed
];


{/*Function gets recently played tracks upon loading homepage*/}
  useEffect(() => {
    // Fetch the recently played tracks from the backend
    fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getRecentlyPlayedTracks.php', {
      method: 'GET',
      credentials: 'include', // Ensure session cookies are included
    })
    .then(response => response.json())
    .then(data => {
      if (data && data.items) {
        setRecentlyPlayed(data.items);
        localStorage.setItem('recentlyPlayed', JSON.stringify(data.items)); // Store locally for caching
      }
    })
    .catch(err => console.error('Error fetching recently played tracks:', err));
  }, []);


 {/*For Playlist by reccomendations*/}
  useEffect(() => {
    const storedPlaylist = localStorage.getItem('myPlaylist');
    if (storedPlaylist) {
      setMyPlaylist(JSON.parse(storedPlaylist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('myPlaylist', JSON.stringify(myPlaylist));
  }, [myPlaylist]);



    {/*Function to send Recommendations Playlist to Sptofy NOTE: THIS FUNCTION IS NO LONGER BEING USED!!!!*/}
    {/*Has been replaced by 'savePlaylistNew'*/}
    {/*Even though this function is not being used, Ill leave it here in case ~Arianna*/}
  const handleSendPlaylistToSpotify = () => {
    if (recommendedTrackUris.length === 0) {
      alert('No tracks available to export. Generate the playlist first.');
      return;
    }

    const playlistName = 'Recommended by TBD';

    const data = {
      trackUris: recommendedTrackUris,
      playlistName: playlistName,
    };

    fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/sendPlaylistToSpotify.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
      if (data.success) {
        alert(`Playlist '${playlistName}' created and added to Spotify!`);
      } else {
        alert(`Error: ${data.message}`);
      }
    })
    .catch(err => console.error('Error sending playlist to Spotify:', err));
  };


  {/*For Playlist by reccomendations*/}
  const handleDeleteFromMyPlaylist = (index) => {
    const updatedPlaylist = myPlaylist.filter((_, i) => i !== index);
    setMyPlaylist(updatedPlaylist);
  };



  {/*For changing mood*/}
  const handleMoodChange = (e) => setMood(e.target.value);



  {/*Function that generates a Playlist based on mood*/}
  const generatePlaylist = () => {
  fetch(`https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/generateMoodPlaylist.php?mood=${mood}`, {
    method: 'GET',
    credentials: 'include',
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.tracks) {
        setMoodPlaylist(data.tracks); // Store the list of tracks
        setShowPlaylistOverlay(true); // Automatically open the playlist overlay
      } else {
        console.error('No tracks found in the playlist.');
      }
    })
    .catch((err) => console.error('Error generating playlist:', err));
};



  


  const handleShowOverlay = () => {
    // Fetch the top artists from the PHP script
    fetch('https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/topArtists.php', {
      method: 'GET',
      credentials: 'include', // Include session cookies
    })
    .then(response => response.text()) // Expecting HTML response from PHP
    .then(data => {
      setTopArtistsContent(data); // Set the content of the overlay
      setShowOverlay(true); // Show the overlay
    })
    .catch(err => console.error('Error fetching top artists:', err));
  };

 
const handleShowShareOverlay = () => {
  // Extract the base URL up to the first hash (#) to avoid /home inclusion
  const baseUrl = window.location.href.split('#')[0]; 
  
  // Construct the correct profile URL
  const profileLink = `${baseUrl}#/profile`;

  setSpotifyProfileLink(profileLink);
  setShowShareOverlay(true);
};



  const handleCloseOverlay = () => setShowOverlay(false);
  const handleCloseShareOverlay = () => setShowShareOverlay(false);




  return (
    <div style={styles.container}>
      <div style={styles.headerContainer}>
        <div style={styles.leftHeader}>
          <h1 style={styles.title}>Your Library</h1>
        </div>
        <div style={styles.rightHeader}>
          {/* Profile image button */}
          <button style={styles.iconButton} onClick={() => navigate('/profile')}>
            <img src={profileImage} alt="Profile" style={styles.profileImage} />
          </button>
          <button style={styles.iconButton} onClick={() => navigate('/settings')}>
            <img src={settingsIcon} alt="Settings" style={styles.settingsImage} />
          </button>
          {/* Share Profile Button (using link.png instead of emoji) */}
          <button style={styles.iconButton} onClick={handleShowShareOverlay}>
            <img src={linkImage} alt="Share Link" style={styles.iconImage} />
          </button>
          
        </div>

      </div>

      
      
      <h2 style={styles.subtitle}>Recently Played Tracks</h2>

      <div style={styles.playlistContainer}>
        {recentlyPlayed && recentlyPlayed.length > 0 ? (
          recentlyPlayed.map(item => (
            <div key={item.track.id} style={styles.playlistCard}>
              <a href={item.track.external_urls.spotify} target="_blank" rel="noopener noreferrer">
                <img src={item.track.album.images[0].url} alt={item.track.name} style={styles.playlistImage} />
                <p style={styles.trackTitle}>{item.track.name}</p>
                <p style={styles.artistName}>{item.track.artists.map(artist => artist.name).join(', ')}</p>
              </a>
            </div>
          ))
        ) : (
          <p>No recently played tracks found.</p>
        )}
      </div>





      {/* New button to trigger overlay */}
      <button style={styles.overlayButton} onClick={handleShowOverlay}>Show Top Artists</button>

      {/* Overlay for displaying top artists */}
      {showOverlay && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <button style={styles.closeButton} onClick={handleCloseOverlay}>Close</button>
            <div dangerouslySetInnerHTML={{ __html: topArtistsContent }} />
          </div>
        </div>
      )}



{showShareOverlay && (
        <div style={styles.overlay}>
          <div style={styles.overlayContent}>
            <button style={styles.closeButton} onClick={handleCloseShareOverlay}>Close</button>
            <p>Your Spotify Profile Link:</p>
            <a href={spotifyProfileLink} target="_blank" rel="noopener noreferrer">
              {spotifyProfileLink}
            </a>
          </div>
        </div>
      )}


<div style={styles.moodSelector}>
  <label htmlFor="mood" style={styles.moodLabel}>Select Mood: </label>
  <select 
    id="mood" 
    value={mood} 
    onChange={handleMoodChange} 
    style={styles.moodDropdown}
  >
    <option value="happy">Happy</option>
    <option value="sad">Sad</option>
    <option value="work-out">Energetic</option>
    <option value="chill">Chill</option>
  </select>
  <button style={styles.overlayButton} onClick={generatePlaylist}>
    Generate Playlist
  </button>
</div>
      

{showPlaylistOverlay && moodPlaylist && (
  <div style={styles.overlay}>
    <div style={styles.overlayContent}>
      <button style={styles.closeButton} onClick={closePlaylistOverlay}>
        Close
      </button>
      <h3>Your Generated Playlist</h3>
      {moodPlaylist.map((track) => (
        <div key={track.id} style={styles.playlistCard}>
          {/* Clickable link to the track on Spotify */}
          <a href={track.external_urls.spotify} target="_blank" rel="noopener noreferrer" style={styles.trackLink}>
            <img src={track.album.images[0].url} alt={track.name} style={styles.playlistImage} />
            <div>
              <p style={styles.trackTitle}>{track.name}</p>
              <p style={styles.artistName}>
                {track.artists.map((artist) => artist.name).join(', ')}
              </p>
            </div>
          </a>
        </div>
      ))}
     <div style={styles.tooltipContainer}>
  <button
    style={styles.overlayButton}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => savePlaylistNew(moodPlaylist, 'mood')}
  >
    Save to Spotify
  </button>
  {isHovered && (
    <div style={styles.tooltip}>
      This action will import the playlist into your Spotify account and save it to your TDB account.
    </div>
  )}
</div>

    </div>
  </div>
)}


{/*Stuff for the genre overlay */}
{ showGenreOverlay && genrePlaylist &&(
  <div style={styles.overlay}>
    <div style={styles.overlayContent}>
      <button style={styles.closeButton} onClick={closeGenreOverlay}>Close</button>
      <h3>Your {selectedGenre} Playlist</h3>
      {genrePlaylist.map((songs) => (

        <div key={songs.uri} style={styles.playlistCard}>
          <a href={songs.external_urls.spotify} target="_blank" rel="noopener noreferrer">
          <img
             src={songs.album_images && songs.album_images.length > 0 ? songs.album_images[0].url : 'https://via.placeholder.com/80'}
              alt={songs.song_name}
              className="playlist-image"
          />            
            
            <div>
              <p style={styles.trackTitle}>{songs.song_name}</p>
              <p style={styles.artistName}>
              {songs.artist_name}
              </p>
          

            </div>
          </a>
        </div>
      ))}
     <div style={styles.tooltipContainer}>
  <button
    style={styles.overlayButton}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => savePlaylistNew(genrePlaylist, 'genre')}
  >
    Save to Spotify
  </button>
  {isHovered && (
    <div style={styles.tooltip}>
      This action will import the playlist into your Spotify account and save it to your TDB account.
    </div>
  )}
</div>

    </div>
  </div>
)}



{/*Stuff for the Rec  overlay */}
{showRecOverlay && recommendedTrackUris && (
  <div style={styles.overlay}>
    <div style={styles.overlayContent}>
      <button style={styles.closeButton} onClick={closeRecOverlay}>Close</button>
      <h3>Your Recommended Playlist</h3>

      {recommendedTrackUris.map((tracks) => (
        <div key={tracks.uri} style={styles.playlistCard}>
        <a href={tracks.external_url} target="_blank" rel="noopener noreferrer">
          <img
            src={tracks.album_image ? tracks.album_image : 'https://via.placeholder.com/80'}
            alt={tracks.song_name}
            className="playlist-image"
          />            
          
          <div>
            <p style={styles.trackTitle}>{tracks.song_name}</p>
            <p style={styles.artistName}>
              {tracks.artist_name}
            </p>
          </div>
          </a>
        </div>
      ))}
    <div style={styles.tooltipContainer}>
  <button
    style={styles.overlayButton}
    onMouseEnter={() => setIsHovered(true)}
    onMouseLeave={() => setIsHovered(false)}
    onClick={() => savePlaylistNew(recommendedTrackUris, 'recent')}
  >
    Save to Spotify
  </button>
  {isHovered && (
    <div style={styles.tooltip}>
      This action will import the playlist into your Spotify account and save it to your TDB account.
    </div>
  )}
</div>

    </div>
  </div>
)}






<h2 style={styles.subtitle}>Genres</h2>


{/*Changed this*/}
<div style={styles.genresContainer}>
  {genres.map((genre, index) => (
    <div
      key={index}
      style={styles.genreCard}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
      onClick={() => {
        setSelectedGenre(genre.value); // Set the selected genre
        generateGenrePlaylist(genre.value); // Generate the playlist for the selected genre
      }}
    >
      <h3 style={styles.genreCardTitle}>{genre.name}</h3>
    </div>
  ))}
</div>








         {/* Generate Playlist Section */}
         <div style={styles.buttonContainer}>
        <button style={styles.generateButton} onClick={handleGeneratePlaylist}>
          Recommendations
        </button>

        {isOverlayOpen && (
  <div className="overlay">
    <div className="overlay-content">
      <h2>Recommended Playlist</h2>
      <ul>
        {recommendedTrackUris.map((uri, index) => (
          <li key={index}>{uri}</li>
        ))}
      </ul>
      <button onClick={() => setIsOverlayOpen(false)}>Close</button>
    </div>
  </div>
)}


{/*NOTE! Below is the button which used to send the recommended playlist to spotify,
Since Standardizing the playlists with one function, Ive removed it, 
im not deleting it just in case we need it later ~ Arianna */}
{/*
        <button style={styles.exportButton} onClick={handleSendPlaylistToSpotify}>
          Create Playlist
        </button>

*/}


      </div>
  
      <h2 style={styles.subtitle}>My Playlist</h2>
      <div style={styles.myPlaylistContainer}>
        {myPlaylist.length > 0 ? (
          myPlaylist.map((item, index) => (
            <div key={index} style={styles.playlistItem}>
              <div style={styles.playlistTitleContainer}>
                <button 
                  style={styles.deleteButton} 
                  onClick={() => handleDeleteFromMyPlaylist(index)}
                >
                  Delete
                </button>
              </div>
              <div dangerouslySetInnerHTML={{ __html: item }} style={styles.playlistContent} />
            </div>
          ))
        ) : (
          <p>No playlists saved yet.</p>
        )}
      </div>

        

        
        


      
    </div>
  );
};
const styles = {
  container: {
    padding: '20px',
    backgroundColor: '#d7ff9e',
    height: '100vh',
    fontFamily: 'Arial, sans-serif',
  },
  moodSelector: {
    marginTop: '20px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  },
  moodLabel: {
    fontSize: '1.2em',
    fontWeight: 'bold',
  },
  moodDropdown: {
    padding: '10px 15px',
    fontSize: '1.1em',
    borderRadius: '10px',
    border: '1px solid #4CAF50',
    backgroundColor: '#fff',
    color: '#333',
    cursor: 'pointer',
    transition: 'border-color 0.3s ease',
  },
  moodDropdownHover: {
    borderColor: '#388E3C',
  },
  overlayButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1.2em',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
  },
  overlayButtonHover: {
    backgroundColor: '#388E3C',
  },
  genresContainer: {
    display: 'flex',
    flexDirection: 'row', // Horizontal layout
    overflowX: 'auto', // Allow horizontal scrolling
    gap: '20px', // Space between cards
    marginTop: '20px',
    padding: '10px', // Add some padding if needed
    width: '100%', // Make sure the container takes full width
    whiteSpace: 'nowrap', // Prevent wrapping
},
genreCard: {
    width: '200px',
    height: '100px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: '8px',
    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease',
    flexShrink: 0, // Prevent cards from shrinking
},
genreCardHover: {
    transform: 'scale(1.05)',
},
genreCardTitle: {
    fontSize: '25px',
    color: '#333',
    textAlign: 'center',
},

  headerContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  leftHeader: {
    display: 'flex',
    alignItems: 'center',
  },
  rightHeader: {
    display: 'flex',
    gap: '10px',
  },
 
  title: {
    fontSize: '2.5em',
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  playlistContainer: {
    display: 'flex',
    flexDirection: 'column', // Vertical layout for tracks
    gap: '20px', // Gap between items
    padding: '10px 0',
    marginTop: '20px',
  },
  playlistCard: {
    width: '100%', // Full width for each card
    textAlign: 'left',
    padding: '10px',
    backgroundColor: 'white',
    borderRadius: '10px',
    display: 'flex', // Flexbox for image and text
    alignItems: 'center',
  },
  playlistImage: {
    width: '80px', // Fixed size for the track image
    height: '80px',
    borderRadius: '10px',
    marginRight: '15px', // Space between image and text
  },
  trackTitle: {
    margin: 0, // Reset default margin
    fontWeight: 'bold',
  },
  artistName: {
    color: 'gray',
    margin: 0, // Reset default margin
  },
  overlayButton: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '1.2em',
    cursor: 'pointer',
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  overlayContent: {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '10px',
    width: '80%',
    maxHeight: '80%',
    overflowY: 'auto',
  },
  closeButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    borderRadius: '5px',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
    color: 'white',
    border: 'none',
    padding: '10px',
    cursor: 'pointer',
    fontSize: '1em',
    borderRadius: '5px',
    marginBottom: '10px',
  },
  profileImage: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: 'none',
  },
  settingsImage: {
    width: '55px',
    height: '55px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: 'none',
  },
  iconButton: {
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  iconImage: {
    width: '55px',
    height: '55px',
    
    objectFit: 'cover',
  },
  moodSelector: { marginTop: '20px' },
  subtitle: {
    fontSize: '1.5em',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  dropdown: {
    marginTop: '10px',
    backgroundColor: 'white',
    boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
    borderRadius: '5px',
    width: '200px',
  },
  dropdownItem: {
    padding: '10px',
    width: '100%',
    textAlign: 'left',
    backgroundColor: 'white',
    border: 'none',
    cursor: 'pointer',
  },
  playlistItem: {
    backgroundColor: '#fff',
    borderRadius: '10px',
    padding: '10px',
    marginBottom: '10px',
  },
  playlistTitleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playlistTitle: {
    margin: 0,
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    color: 'white',
    border: 'none',
    padding: '5px 10px',
    cursor: 'pointer',
    borderRadius: '5px',
    marginLeft: '10px',
  },
  playlistContent: {
    marginTop: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '20px',
    gap: '20px',
  },
  generateButton: {
    padding: '15px 30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 128, 0, 0.4)',
    transition: 'all 0.3s',
    flex: 1,
  },
  exportButton: {
    padding: '15px 30px',
    fontSize: '1.2em',
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    boxShadow: '0px 4px 8px rgba(0, 128, 0, 0.4)',
    transition: 'all 0.3s',
    flex: 1,
  },



















  // Media queries for responsiveness
  '@media (max-width: 768px)': {
    title: {
      fontSize: '2em',
    },
    subtitle: {
      fontSize: '1.2em',
    },
    playlistCard: {
      flexDirection: 'row', // Horizontal layout for small screens
    },
    overlayButton: {
      fontSize: '1em',
    },
    profileImage: {
      width: '45px',
      height: '45px',
    },
  },

  '@media (max-width: 480px)': {
    headerContainer: {
      flexDirection: 'column', // Stack header elements on small screens
      alignItems: 'flex-start',
    },
    title: {
      fontSize: '1.5em',
    },
    subtitle: {
      fontSize: '1em',
    },
    playlistContainer: {
      padding: '5px 0',
    },
    playlistCard: {
      padding: '15px', // Increase padding for touch targets
    },
    overlayContent: {
      width: '90%', // Slightly wider on small screens
    },
  },
  tooltipContainer: {
    position: 'relative',
    display: 'inline-block',
  },
  tooltip: {
    position: 'absolute',
    top: '50%', // Position vertically centered to the button
    left: '105%', // Position right next to the button
    transform: 'translateY(-50%)', // Adjust vertically centered
    backgroundColor: '#333',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '5px',
    fontSize: '0.9em',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Add shadow for visibility
    
    animation: 'fadeIn 0.3s forwards',
  },
  
};

export default HomePage;