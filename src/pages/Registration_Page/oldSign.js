
import React, { useState } from 'react';// Import React library
import './Sign.css'; // Import CSS styles for the component
import profileIcon from '../../asset/Generic_avatar.png'; // Correct
import { Link } from 'react-router-dom';



function Sign() {

  const handleChange = () => {
    // This is a dummy function that does nothing
  };
  const handleSubmit = () => {
    // This is a dummy function that does nothing
  };

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });


  return (
    









    <div className="sign-container"> {/* Main container to center the sign-up form */}
      <div className="sign-box"> {/* Box for the sign-up form */}
        <div className="profile-icon"> {/* Container for the profile icon */}
          <img src={profileIcon} alt="Profile Icon" /> {/* Profile image */}
          {/* Placeholder for the icon if the image fails to load */}
          <i className="fas fa-user-circle"></i> 
        </div>
        <h2>User Registration</h2> {/* Title for the form */}
        <form onSubmit={handleSubmit}> {/* Attach onSubmit handler to the form */}
          {/* Input group for name */}
          <div className="input-group">
            <label htmlFor="name">Name <span>*</span></label> {/* Name label */}
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            /> {/* Name input field */}
          </div>
          {/* Input group for email */}
          <div className="input-group">
            <label htmlFor="email">Email address <span>*</span></label> {/* Email label */}
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            /> {/* Email input field */}
          </div>
          {/* Input group for password */}
          <div className="input-group">
            <label htmlFor="password">Password <span>*</span></label> {/* Password label */}
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            /> {/* Password input field */}
          </div>
          {/* Input group for confirm password */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password <span>*</span></label> {/* Confirm Password label */}
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            /> {/* Confirm Password input field */}
          </div>
          <p className="login-link"> {/* Link to log in if already have an account */}
            Already have an account? <a href="/login">Log in here</a>
          </p>
          <button type="submit" className="sign-btn">Sign Up</button> {/* Submit button */}

        </form>
      </div>
    </div>
  );
}


export default Sign; // Export the Sign component for use in other files

