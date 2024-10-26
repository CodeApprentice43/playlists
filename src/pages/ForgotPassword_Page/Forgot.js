import React, { useState } from 'react';
import './ForgotPass.css';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [email, setEmail] = useState('');
  const [redirectMessage, setRedirectMessage] = useState(''); // New state for redirect message
  const navigate = useNavigate();

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    fetch('/CSE442/2024-Fall/skim243/php/reset-request.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({ email }),
    })
      .then((response) => response.text())
      .then((data) => {
        alert(data);
        
        // Show redirect message
        setRedirectMessage('Redirecting to the login page...');
        
        // Redirect to login page after 2.5 seconds
        setTimeout(() => {
          navigate('/login');
        }, 2500);
      })
      .catch((err) => console.log(err));
  };

  const handleClose = () => {
    navigate('/login');
  };

  return (
    <div className="forgotpass-container">
      <div className="reset-container">
        <div className="reset-box">
          <button className="close-btn" onClick={handleClose}>X</button>
          <div className="logo">
            <div className="circle">
              <span>TBD</span>
            </div>
          </div>
          <h2>Reset Your Password</h2>
          <a>
            Enter the email address or username linked to your TBD account and we'll send you an email.
          </a>
          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Enter your email address:</label>
            <input 
              type="email" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
            <button type="submit" className="send-btn">Send Link</button>
          </form>
          {redirectMessage && <p className="redirect-message">{redirectMessage}</p>} {/* Conditionally render redirect message */}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
