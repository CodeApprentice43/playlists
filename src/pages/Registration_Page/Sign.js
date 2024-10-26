import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate hook
import './Sign.css'; // Import CSS styles
import profileIcon from '../../asset/Generic_avatar.png'; // Correct path to the profile image

function Sign() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const navigate = useNavigate(); // Initialize navigate hook

  // Function to handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = {
      name: e.target.name.value,
      email: e.target.email.value,
      password: e.target.password.value,
      confirmPassword: e.target.confirmPassword.value,
    };



    try {
      const response = await fetch('/CSE442/2024-Fall/skim243/php/register.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(formData),
      });

      const text = await response.text();

      if (text.includes("Registration successful")) {
        // Show the popup and redirect to login page after "OK"
        if (window.confirm(text)) {
          navigate('/login'); // Redirect to login page after the user clicks OK
        }
      } else {
        // Handle other cases like errors
        alert(text);
      }
    } catch (error) {
      console.error('Error:', error);
    }




   
      









  };






  return (
    <div className="sign-container">
      <div className="sign-box">
        <div className="profile-icon">
          <img src={profileIcon} alt="Profile Icon" />
        </div>
        <h2>User Registration</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="name">Name <span>*</span></label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="email">Email address <span>*</span></label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password <span>*</span></label>
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password} 
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirm Password <span>*</span></label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword" 
              value={formData.confirmPassword} 
              onChange={handleChange} 
              required 
            />
          </div>
          <p className="login-link">
            Already have an account? <a href="https://se-prod.cse.buffalo.edu/CSE442/2024-Fall/cse-442l/#/login">Log in here</a>
          </p>
          <button type="submit" className="sign-btn">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default Sign;
