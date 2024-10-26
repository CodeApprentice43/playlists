import React from "react";
import "./Spotify.css";



export const Spotify = () => {

  // Define handleLogin function
  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/oauth.php'; // Redirect to Spotify OAuth
  }

  return (
    <div className="desktop">
      <div className="container">


    
        <div className="topBox">
          
          <div className="greyTopHeader" />
          
          <p className="linkSpotifyText">Link Spotify for Personalized Recommendations</p>
          
          <p className="pleaseLoginWithText">
            Please login with your Spotify account to see personalized
            reccomendations !
          </p>

          <button className="spotifyLoginButton"
          onClick={handleLogin}>
          Login with Spotify
          </button>

        </div>




        {/*CHANGE THESE TO REMOVE THE LINKS, ACCESS THE FILES LOCALLY*/}
        <div className="featuresYouReceive">FEATURES YOU WILL RECEIVE</div>
        <img className="firstPic" alt="Playlist" src="https://c.animaapp.com/SHI44g3e/img/playlist-1.svg" />
        <p className="firstCaption">Curated playlists based on your listening habits which you can import into Spotify</p>
        <img className="secondPic" alt="Untitled" src="https://c.animaapp.com/SHI44g3e/img/untitled-1.svg" />
        <p className="secondCaption">
          View your most listened tracks,artists,genre to give you a visual demonstration of your listening habits
        </p>
        <img
          className="thirdPic"
          alt="Explore svgrepo com"
          src="https://c.animaapp.com/SHI44g3e/img/explore-svgrepo-com-1.svg"
        />




        <p className="thirdCaption">
          Experience genre exploration, our system will suggest songs from specific genres you like
        </p>
        <img
          className="boyListeningPic"
          alt="Boy listening to"
          src="https://c.animaapp.com/SHI44g3e/img/boy-listening-to-music-4ef948-1@2x.png"
        />


        
      </div>
    </div>




  );
};
