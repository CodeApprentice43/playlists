import React from "react";
import "./Spotify.css";

export const Spotify = () => {

  const handleLogin = () => {
    window.location.href = 'http://localhost:8000/oauth.php'

   }

  return (
    <div className="desktop">
      <div className="div">


      

        <div className="overlap-group">

       


          <div className="rectangle" />
          <p className="text-wrapper">Link Spotify for Personalized Recommendations</p>
          <p className="please-login-with">
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Please login with your Spotify account to see personalized
            reccomendations !
          </p>

          <button
  className="spotify-login-button"
  onClick={handleLogin}
>
  Login with Spotify
</button>

        

            

        </div>
        <div className="text-wrapper-2">FEATURES YOU WILL RECEIVE</div>
        <img className="playlist" alt="Playlist" src="https://c.animaapp.com/SHI44g3e/img/playlist-1.svg" />
        <p className="p">Curated playlists based on your listening habits which you can import into Spotify</p>
        <img className="untitled" alt="Untitled" src="https://c.animaapp.com/SHI44g3e/img/untitled-1.svg" />
        <p className="text-wrapper-3">
          View your most listened tracks,artists,genre to give you a visual demonstration of your listening habits
        </p>
        <img
          className="explore-svgrepo-com"
          alt="Explore svgrepo com"
          src="https://c.animaapp.com/SHI44g3e/img/explore-svgrepo-com-1.svg"
        />
        <p className="text-wrapper-4">
          Experience genre exploration, our system will suggest songs from specific genres you like
        </p>
        <img
          className="boy-listening-to"
          alt="Boy listening to"
          src="https://c.animaapp.com/SHI44g3e/img/boy-listening-to-music-4ef948-1@2x.png"
        />
      </div>
    </div>
  );
};
