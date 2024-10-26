import React, { useEffect } from 'react';
import { HashRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import Login from '../Login_page/Login';
import Registration_Page from '../Registration_Page/Sign';
import ForgotPasswordPage from '../ForgotPassword_Page/Forgot';
import HomePage from '../Homepage/Homepage';
import {Settings} from '../Settings/SettingsIdx'
import OAuthLogin from '../OAuthLogin/OAuthLogin';
import Callback from '../Callback/Callback';
import Profile from '../Profile/profile';
import Playlist from '../Playlist/playlist';

function App() {
  const navigate = useNavigate();

  // Function to handle logo click
  const handleClick = () => {
    // Check if the "logged_in" cookie exists and is set to true
    const isLoggedIn = getCookie("logged_in") === "true";

    if (isLoggedIn) {
      navigate('/home'); // If logged in, redirect to home page
    } else {
      navigate('/login'); // If not logged in, redirect to login page
    }
  };

  return (
    <div className="container">
      <div className="centered-circle" onClick={handleClick} style={{ cursor: 'pointer' }}>
        <p>TBD</p>
      </div>
      <div className="footer-text">
        Click logo to continue
      </div>
    </div>
  );
}

// Utility function to get cookie by name
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

export default function AppWrapper() {
  return (
    <Router basename="/">
      <Routes>
        {/* Check login status and redirect accordingly */}
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Registration_Page />} />
        <Route path="/forgot" element={<ForgotPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="spotify" element={<OAuthLogin/>}/>
        <Route path="/callback" element={<Callback/>}/>
        <Route path="/profile" element={<Profile/>}/>
        <Route path="/playlist" element={<Playlist/>}/>

      </Routes>
    </Router>
  );
}
