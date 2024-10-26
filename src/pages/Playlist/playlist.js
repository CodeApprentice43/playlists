import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './playlist.css';
import xSign from "../../asset/x-sign.png";
import { useNavigate } from 'react-router-dom';
import profileImage from '../../asset/Generic_avatar.png'; // Import your profile image


const PlaylistPage = () => {
    const location = useLocation();
    const genreValue = location.state?.genreValue || 'default'; // Fallback to 'default' if genreValue is not passed
    const genreName = location.state?.genreName || 'Genre'; // Fallback to 'Genre' if genreName is not passed
    const [songs, setSongs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchSongs = async () => {
            try {
                const response = await fetch(`https://se-dev.cse.buffalo.edu/CSE442/2024-Fall/nafismor/moodplaylist/php/getGenre.php?genre=${genreValue}`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (!response.ok) {
                    // If the response is not OK, set the error message
                    throw new Error('Failed to fetch songs. Check if your Spotify account is connected.');
                }

                const data = await response.json();
                
                // Check if there are songs in the response
                if (data.songs) {
                    setSongs(data.songs);
                } else {
                    // If no songs are found, set songs to an empty array
                    setSongs([]);
                }
            } catch (err) {
                // Set error state if there's an error
                setError(err.message);
                setSongs([]); // Ensure songs is set to an empty array on error
            } finally {
                setLoading(false);
            }
        };

        fetchSongs();
    }, [genreValue]); // Fetch songs whenever the genreValue changes

    if (loading) {
        return <div>Loading songs...</div>;
    }

    if (error) {
        return (
            <div>
                <h2 className="playlist-title">Your Playlist</h2>
                <div>{error}</div>
            </div>
        );
    }

    return (
        <div>
        <div className="song-list">
            <h2 className="playlist-title">My {genreName} Playlist</h2>
            
            <div className="playlist-container">
                {songs.length > 0 ? (
                    songs.map((song, index) => (
                        <div key={index} className="playlist-card">
                            <a
                                href={song.external_urls.spotify} // Use the Spotify URL
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ display: 'flex', alignItems: 'center', width: '100%' }}
                            >
                                <img
                                    src={song.album_images && song.album_images.length > 0 ? song.album_images[0].url : 'https://via.placeholder.com/80'}
                                    alt={song.song_name}
                                    className="playlist-image"
                                />
                                <div style={{ flex: 1 }}>
                                    <p className="track-title">{song.song_name}</p>
                                    <p className="artist-name">{song.artist_name}</p>
                                </div>
                            </a>
                        </div>
                    ))
                ) : (
                    <p>No songs found.</p>
                )}
            </div>
        </div>

        <button
            className="cancel-instance"
            style={{
                border: "none",
                background: "transparent",
                fontSize: "50px",
                cursor: "pointer",
                padding: "5px",
            }}
            aria-label="Cancel"
            onClick={() => navigate('/home')} // Navigates to /home when clicked
        >
            <img 
                src={xSign} 
                alt="Cancel"
            />
        </button>

        <button
            className="avatar"
            style={{
                border: "none",
                background: "transparent",
                fontSize: "50px",
                cursor: "pointer",
                padding: "5px",
            }}
            aria-label="avatar"
            onClick={() => navigate('/profile')} // Navigates to /home when clicked
        >
            <img 
                src={profileImage} 
                alt="avatar"
            />
        </button>
        
    </div>

    );
};

export default PlaylistPage;
