import React, { useState, useEffect } from 'react';
import profileIcon from '../../asset/Generic_avatar.png';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { setCookie, getCookie, eraseCookie } from '../../utils/cookiesUtils';


const Login = () => {
  const [email, setEmail] = useState(''); // State to handle email input
  const [password, setPassword] = useState(''); // State to handle password input
  const [error, setError] = useState(''); // State to store error messages
  const [success, setSuccess] = useState(''); // State to store success messages
  const [rememberMe, setRememberMe] = useState(false); 
  const navigate = useNavigate();

  useEffect(() => {
    const savedEmail = getCookie('email'); // Get saved email from cookie
    const savedPassword = getCookie('password'); // Get saved password from cookie

    if (savedEmail && savedPassword) {
      setEmail(savedEmail);
      setPassword(savedPassword);
      setRememberMe(true); // Set Remember Me checkbox to true if cookies exist
    }
  }, []); // Run only on component mount

  // Login handler function
  const handleLogin = async () => {
    setError(''); // Reset error message
    setSuccess(''); // Reset success message

    try {
      console.log("Sending login request to PHP with:", email, password);
      const response = await fetch('/CSE442/2024-Fall/skim243/php/login.php', { // Adjust PHP file path as needed
        method: 'POST',
        credentials: 'include', // Ensure session cookies are included
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: email, password: password }), // Convert input data to JSON format and send
      });
      console.log("Response status:", response.status);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json(); // Convert the response to JSON format

      if (data.success) {
        setSuccess('Login successful! Redirecting to home page...'); // Set success message
        if (rememberMe) {
          setCookie('email', email, 7); // Save email for 7 days
          setCookie('password', password, 7); // Save password for 7 days
        } else {
          // Erase cookies if Remember Me is not checked
          eraseCookie('email');
          eraseCookie('password');
        }
        setTimeout(() => {
          navigate('/home'); // Replace '/homepage' with the actual path of your homepage
        }, 1000); // 1 second delay for showing success message

      } else {
        setError(data.message); // Set error message
      }
    } catch (err) {
      setError('An error occurred while trying to log in.'); // Handle network error
    }
  };

 const goToSignUp = () => {
  navigate('/signup'); 
};

// Forgot Password 
const goToForgotPassword = () => {
  navigate('/forgot'); 
};

  return (
    <div className="login-container">
      <div className="login-box">
        {/* Load profile icon */}
        <div className="profile-icon">
          <img src={profileIcon} alt="Profile Icon" />
        </div>
        <h2>Log in to TBD</h2>

        {/* Email input field */}
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password input field */}
        <div className="form-group">
          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

         {/* Remember me checkbox */}
         <div className="checkbox-group">
          <input
            type="checkbox"
            id="remember"
            checked={rememberMe}
            onChange={(e) => setRememberMe(e.target.checked)} // Toggle Remember Me state
          />
          <label htmlFor="remember">Remember me</label>
        </div>


        {/* Display error message */}
        {error && <div className="error-message">{error}</div>}
        {/* Display success message */}
        {success && <div className="success-message">{success}</div>}

        {/* Login button */}
        <button className="login-btn" onClick={handleLogin}>
          Log in
        </button>

        {/* Bottom links */}
        <div className="login-links">
          <a onClick={goToForgotPassword} style={{ cursor: 'pointer' }}>
            Forgot your password?
          </a>
          <p>Don’t have an account?</p>
          <a onClick={goToSignUp} style={{ cursor: 'pointer' }}>
            Sign up for TBD
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
